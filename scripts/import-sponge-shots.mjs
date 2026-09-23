/**
 * Brings the net-sponge colourway photographs into the site's format.
 *
 * Source frames arrive at assorted sizes and aspect ratios; the layout wants
 * 4:5 at 1200×1500 for every product shot. Two ways to get there, and which
 * one applies is decided by the frame, not by a preference:
 *
 *   - **Too wide** — crop. The two landscape frames carry the model on the
 *     left and the rolled sponge on the right, and the crop keeps the back and
 *     the drape, which is what the product page is about.
 *   - **Too narrow** — extend the backdrop sideways rather than crop the
 *     height. Cropping height on these takes the top off the model's head,
 *     which is worse than a slightly wider wall. The fill colour is sampled
 *     from the frame's own backdrop so the join is invisible.
 *
 * Grading is deliberately light. The README's rule is one vivid colour per
 * frame on a quiet ground, and these already are that — they were shot on a
 * warm off-white that is within a few steps of the site's cream. Pulling the
 * saturation down the way the old marketplace shots needed would only make
 * them muddy.
 *
 * Re-run: node scripts/import-sponge-shots.mjs
 */

import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(ROOT, "source-photos", "net-sponge-colourways");
const OUT = join(ROOT, "public", "images");
mkdirSync(OUT, { recursive: true });

const TARGET_W = 1200;
const TARGET_H = 1500;
const RATIO = TARGET_W / TARGET_H;

/**
 * `focus` is where the crop centres, as a fraction of width — only consulted
 * on a frame that is too wide. 0.5 is centred; the landscape frames need to
 * sit left of centre because the model does.
 */
/**
 * `focus` is where a too-wide frame is cropped, as a fraction of width.
 * `topBias` is how much of a too-tall frame's loss comes off the top — 0.6
 * keeps the flower and gives up more of the towel at the bottom.
 */
const SHOTS = [
  { colour: "red", focus: 0.52, topBias: 0.6 },
  { colour: "white", focus: 0.5, topBias: 0.6 },
  { colour: "blue", focus: 0.5, topBias: 0.6 },
  { colour: "purple", focus: 0.5, topBias: 0.5 },
  { colour: "yellow", focus: 0.5, topBias: 0.22 },
  { colour: "pink", focus: 0.5, topBias: 0.2 },
];

for (const shot of SHOTS) {
  const input = join(SRC, `${shot.colour}.png`);
  const base = sharp(input);
  const meta = await base.metadata();
  const { width, height } = meta;

  let pipeline;
  let note;

  if (width / height > RATIO) {
    // Too wide: take a full-height slice at the focal point.
    const cropW = Math.round(height * RATIO);
    const ideal = Math.round(width * shot.focus - cropW / 2);
    const left = Math.max(0, Math.min(width - cropW, ideal));
    pipeline = sharp(input).extract({ left, top: 0, width: cropW, height });
    note = `cropped ${width}→${cropW} wide at x=${left}`;
  } else if (width / height < RATIO) {
    // Too narrow: shorten the frame rather than widen it.
    //
    // Padding was the obvious move and it was wrong twice over. A flat fill
    // leaves a tonal step, and stretching the edge columns smears whatever
    // touches the frame edge — on these that is the model's arm and the
    // rolled sponge, which turn into horizontal streaks that blurring
    // softens but does not hide.
    //
    // Cropping height costs about a fifth of the tallest frames, and
    // `topBias` decides where from. It is low on the tall frames because the
    // flower sits close to the top edge and a half-cut flower reads as a
    // mistake, where a roll cropped at the bottom reads as framing. The
    // drape — the thing a product shot is actually for — is untouched either
    // way.
    const cropH = Math.round(width / RATIO);
    const loss = height - cropH;
    const top = Math.round(loss * (shot.topBias ?? 0.5));
    pipeline = sharp(input).extract({ left: 0, top, width, height: cropH });
    note = `cropped ${height}→${cropH} tall, ${top}px off the top`;
  } else {
    pipeline = sharp(input);
    note = "already 4:5";
  }

  const out = join(OUT, `sponge-${shot.colour}.jpg`);
  await pipeline
    .resize(TARGET_W, TARGET_H, { fit: "fill", kernel: "lanczos3" })
    // A touch of warmth and the faintest lift, to sit with the rest of the
    // palette without draining the colour these products are bought for.
    .modulate({ saturation: 0.96, brightness: 1.02 })
    .jpeg({ quality: 92, chromaSubsampling: "4:4:4" })
    .toFile(out);

  const upscale = (TARGET_H / height).toFixed(1);
  console.log(`sponge-${shot.colour}.jpg  ${width}×${height} → 1200×1500  (${note}, ${upscale}× upscale)`);
}
