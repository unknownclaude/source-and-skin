/**
 * Grades a real photograph into the Source and Skin palette.
 *
 * Product photography of net sponges tends to arrive vivid and high-contrast —
 * the nets are genuinely bright, and they are usually shot outdoors against
 * whatever was behind them. Dropped in raw, that fights the cream/charcoal/earth
 * system this site is built on and reads as a snapshot rather than a brand shot.
 *
 * This script does three things, in order:
 *   1. CROP  — a relative crop box, so you can cut away fences, posts, hands and
 *              other background noise without hardcoding pixel dimensions.
 *   2. GRADE — pulls saturation down, warms the whites, and lifts the blacks
 *              slightly so the image sits in the same tonal family as the page.
 *   3. VEIL  — an optional wash of cream or an accent colour over the whole
 *              frame, which is what actually makes a photo feel like it belongs
 *              to the palette rather than merely coexisting with it.
 *
 * Usage:
 *   node scripts/process-photo.mjs <input> --out net-sponge-regular --preset product
 *   node scripts/process-photo.mjs <input> --out sourcing --preset band \
 *        --crop 0.05,0.45,0.9,0.5 --sat 0.55 --veil 0.16
 *
 * Flags (all optional except --out):
 *   --preset  product | wide | band | square        (default: product)
 *   --crop    x,y,w,h as fractions of 0–1           (default: whole frame)
 *   --sat     0–1 saturation multiplier             (default: 0.68)
 *   --warm    0–1 strength of the warm cast         (default: 0.5)
 *   --veil    0–1 opacity of the colour wash        (default: 0.12)
 *   --veilcolor  hex, defaults to cream             (try an accent for spotlights)
 *   --quality JPEG quality                          (default: 88)
 */

import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = join(ROOT, "public", "images");

const PRESETS = {
  product: { width: 1200, height: 1500 }, // 4:5 — cards, spotlights, PDP gallery
  wide: { width: 1920, height: 1080 }, // 16:9 — hero poster, full-bleed bands
  band: { width: 1600, height: 1100 }, // editorial two-column image
  square: { width: 1200, height: 1200 }, // thumbnails, social
};

const PALETTE = { cream: "#F5F1EA", terracotta: "#C57A54", olive: "#6B7259", clay: "#8C4A3B" };

function parseArgs(argv) {
  const [input, ...rest] = argv;
  const flags = {};
  for (let i = 0; i < rest.length; i += 2) {
    if (!rest[i].startsWith("--")) continue;
    flags[rest[i].slice(2)] = rest[i + 1];
  }
  return { input, flags };
}

const { input, flags } = parseArgs(process.argv.slice(2));

if (!input || !flags.out) {
  console.error("Usage: node scripts/process-photo.mjs <input> --out <name> [--preset product]");
  process.exit(1);
}
if (!existsSync(input)) {
  console.error(`Input not found: ${input}`);
  process.exit(1);
}

const preset = PRESETS[flags.preset ?? "product"];
if (!preset) {
  console.error(`Unknown preset "${flags.preset}". Options: ${Object.keys(PRESETS).join(", ")}`);
  process.exit(1);
}

const saturation = Number(flags.sat ?? 0.68);
const warmth = Number(flags.warm ?? 0.5);
const veil = Number(flags.veil ?? 0.12);
const veilColor = PALETTE[flags.veilcolor] ?? flags.veilcolor ?? PALETTE.cream;
const quality = Number(flags.quality ?? 88);

let pipeline = sharp(input).rotate(); // honour EXIF orientation

// 1. Crop, if a box was given.
if (flags.crop) {
  const [x, y, w, h] = String(flags.crop).split(",").map(Number);
  if ([x, y, w, h].some((n) => !Number.isFinite(n))) {
    console.error("--crop expects four numbers: x,y,w,h as fractions of 0-1");
    process.exit(1);
  }
  const { width, height } = await sharp(input).rotate().metadata();
  pipeline = pipeline.extract({
    left: Math.round(x * width),
    top: Math.round(y * height),
    width: Math.max(1, Math.round(w * width)),
    height: Math.max(1, Math.round(h * height)),
  });
}

// 2. Fit the preset, then grade.
pipeline = pipeline
  .resize(preset.width, preset.height, { fit: "cover", position: "attention" })
  .modulate({ saturation, brightness: 1.03 })
  // Gentle contrast with lifted blacks — keeps it soft rather than punchy.
  .linear(1.06, -6);

const layers = [];

// A warm cast, applied as a soft-light wash so it tints without flattening.
if (warmth > 0) {
  layers.push({
    input: {
      create: {
        width: preset.width,
        height: preset.height,
        channels: 4,
        background: { r: 214, g: 168, b: 120, alpha: warmth * 0.5 },
      },
    },
    blend: "soft-light",
  });
}

// The palette veil — this is the step that makes it feel like the same site.
if (veil > 0) {
  const clean = veilColor.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(clean.slice(i, i + 2), 16));
  layers.push({
    input: {
      create: {
        width: preset.width,
        height: preset.height,
        channels: 4,
        background: { r, g, b, alpha: veil },
      },
    },
    blend: "over",
  });
}

if (layers.length) pipeline = pipeline.composite(layers);

const outPath = join(OUT_DIR, `${flags.out}.jpg`);
await pipeline.jpeg({ quality, mozjpeg: true }).toFile(outPath);

const { size } = await sharp(outPath).metadata().then(async (m) => ({ ...m, size: (await import("node:fs")).statSync(outPath).size }));
console.log(
  `Wrote ${outPath}\n  ${preset.width}x${preset.height}  ${(size / 1024).toFixed(0)}kB` +
    `  sat=${saturation} warm=${warmth} veil=${veil} (${veilColor})`
);
