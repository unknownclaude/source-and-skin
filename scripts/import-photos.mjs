/**
 * Brings supplied photography into the site's format.
 *
 * Every product shot the layout renders is 4:5 at 1200×1500. Source frames
 * arrive at whatever shape they arrive in, and there are three ways to get
 * from one to the other. Which applies is a property of the photograph, not a
 * preference, so it is declared per frame below:
 *
 *   - **crop width** — a frame wider than 4:5 whose subject does not reach the
 *     edges. `focus` says where the slice is centred.
 *   - **pad height** — a frame wider than 4:5 shot on a flat ground, where
 *     cutting the subject would be worse than adding empty ground. Only safe
 *     on a plain background; the fill is sampled from the frame's own corner.
 *   - **crop height** — a frame taller than 4:5. `topBias` says where the loss
 *     comes from. Low values protect something near the top edge.
 *
 * Padding a frame *sideways* is deliberately not an option. It was tried and
 * it fails twice over: a flat fill leaves a tonal step on anything but a plain
 * ground, and stretching the edge columns smears whatever touches the frame
 * edge into horizontal streaks that blurring softens but does not hide.
 *
 * Grading is light on purpose. The README's rule is one vivid colour per frame
 * on a quiet ground, and these already are that.
 *
 * Re-run: node scripts/import-photos.mjs
 */

import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(ROOT, "source-photos");
const OUT = join(ROOT, "public", "images");
mkdirSync(OUT, { recursive: true });

const TARGET_W = 1200;
const TARGET_H = 1500;
const RATIO = TARGET_W / TARGET_H;

const IMPORTS = [
  // Net sponge colourways — on-model, tall frames shot against a warm wall.
  // `topBias` is low because the flower sits close to the top edge and a
  // half-cut flower reads as a mistake, where a roll cropped at the bottom
  // reads as framing.
  { src: "net-sponge-colourways/red.png", out: "sponge-red.jpg", focus: 0.52 },
  { src: "net-sponge-colourways/white.png", out: "sponge-white.jpg" },
  { src: "net-sponge-colourways/blue.png", out: "sponge-blue.jpg" },
  { src: "net-sponge-colourways/purple.png", out: "sponge-purple.jpg", topBias: 0.5 },
  { src: "net-sponge-colourways/yellow.png", out: "sponge-yellow.jpg", topBias: 0.22 },
  { src: "net-sponge-colourways/pink.png", out: "sponge-pink.jpg", topBias: 0.2 },

  // Handled sponge colourways — near-square frames, each in a room styled to
  // its own colour. Cropped rather than padded: the backgrounds are full
  // scenes, so there is nothing flat to extend into.
  { src: "handled-sponge-colourways/black.png", out: "sponge-handle-black.jpg" },
  { src: "handled-sponge-colourways/blue.png", out: "sponge-handle-blue.jpg" },
  { src: "handled-sponge-colourways/pink.png", out: "sponge-handle-pink.jpg" },
  { src: "handled-sponge-colourways/purple.png", out: "sponge-handle-purple.jpg" },

  // Miswak 3-pack — three sticks laid diagonally on white. Padded rather than
  // cropped, because a crop tight enough to reach 4:5 takes the ends off the
  // sticks, and the ground is plain white so added ground is invisible.
  { src: "miswak/three-pack.png", out: "miswak-3-pack.jpg", wide: "pad" },
];

/** Mean colour of a corner patch, for padding a flat-ground frame. */
async function cornerColour(input, width, height) {
  // Two steps on purpose: sharp's `stats()` reads the *input* image and
  // ignores a pending `extract`, so chaining them returns the average of the
  // whole photograph. Materialising the crop first is what makes it a sample.
  const patch = await sharp(input)
    .extract({
      left: 2,
      top: 2,
      width: Math.min(48, width - 4),
      height: Math.min(48, height - 4),
    })
    .toBuffer();
  const { channels } = await sharp(patch).stats();
  return { r: Math.round(channels[0].mean), g: Math.round(channels[1].mean), b: Math.round(channels[2].mean) };
}

for (const entry of IMPORTS) {
  const input = join(SRC, entry.src);
  const { width, height } = await sharp(input).metadata();

  let pipeline;
  let note;

  if (width / height > RATIO && entry.wide === "pad") {
    const fullH = Math.round(width / RATIO);
    const padH = fullH - height;
    const top = Math.floor(padH / 2);
    const bg = await cornerColour(input, width, height);
    pipeline = sharp(input).extend({
      top,
      bottom: padH - top,
      left: 0,
      right: 0,
      background: bg,
    });
    note = `padded ${height}→${fullH} tall on rgb(${bg.r},${bg.g},${bg.b})`;
  } else if (width / height > RATIO) {
    const cropW = Math.round(height * RATIO);
    const ideal = Math.round(width * (entry.focus ?? 0.5) - cropW / 2);
    const left = Math.max(0, Math.min(width - cropW, ideal));
    pipeline = sharp(input).extract({ left, top: 0, width: cropW, height });
    note = `cropped ${width}→${cropW} wide at x=${left}`;
  } else if (width / height < RATIO) {
    const cropH = Math.round(width / RATIO);
    const loss = height - cropH;
    const top = Math.round(loss * (entry.topBias ?? 0.6));
    pipeline = sharp(input).extract({ left: 0, top, width, height: cropH });
    note = `cropped ${height}→${cropH} tall, ${top}px off the top`;
  } else {
    pipeline = sharp(input);
    note = "already 4:5";
  }

  await pipeline
    .resize(TARGET_W, TARGET_H, { fit: "fill", kernel: "lanczos3" })
    .modulate({ saturation: 0.96, brightness: 1.02 })
    .jpeg({ quality: 92, chromaSubsampling: "4:4:4" })
    .toFile(join(OUT, entry.out));

  const upscale = Math.max(TARGET_W / width, TARGET_H / height).toFixed(1);
  console.log(`${entry.out.padEnd(26)} ${width}×${height} → 1200×1500  (${note}, ${upscale}× upscale)`);
}
