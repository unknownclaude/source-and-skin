/**
 * Grades a real photograph into the Source and Skin palette.
 *
 * Product photography arrives vivid, high-contrast and usually on pure white
 * (marketplace convention) or against whatever happened to be behind it.
 * Dropped in raw, both fight the cream/charcoal/earth system this site is built
 * on and read as a listing photo rather than a brand shot.
 *
 * Four stages, in order:
 *   1. CROP  — a relative crop box, so you can cut away fences, posts and hands
 *              without hardcoding pixel dimensions.
 *   2. GRADE — pulls saturation down, warms the whites, lifts the blacks, so the
 *              subject sits in the same tonal family as the page.
 *   3. VEIL  — an optional wash of cream or an accent colour over the frame.
 *   4. GROUND— optionally keys out a white studio background and replaces it
 *              with a brand colour. This is what stops a white-background photo
 *              reading as a bright rectangle punched into a warm page.
 *
 * Usage:
 *   node scripts/process-photo.mjs <input> --out <name> [flags]
 *
 *   # White-background product shot onto the site's cream
 *   node scripts/process-photo.mjs shot.jpg --out placeholder-editorial-sourcing \
 *     --preset portrait --bg cream --sat 0.74 --warm 0.55
 *
 * Flags (only --out is required):
 *   --preset      product | portrait | wide | band | square   (default: product)
 *   --crop        x,y,w,h as fractions of 0-1                 (default: whole frame)
 *   --sat         0-1 saturation multiplier                   (default: 0.68)
 *   --warm        0-1 strength of the warm cast               (default: 0.5)
 *   --veil        0-1 opacity of the colour wash              (default: 0.12)
 *   --veilcolor   palette name or hex                         (default: cream)
 *   --bg          palette name or hex — replaces a white background (default: off)
 *   --bgthreshold 0-255 luminance counted as background       (default: 236)
 *   --bgfeather   edge softening in px                        (default: 1.5)
 *   --quality     JPEG quality                                (default: 88)
 */

import { existsSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = join(ROOT, "public", "images");

const PRESETS = {
  product: { width: 1200, height: 1500 }, // 4:5 — cards, spotlights, PDP gallery
  portrait: { width: 1200, height: 1500 }, // alias, reads better for people shots
  wide: { width: 1920, height: 1080 }, // 16:9 — hero poster, full-bleed bands
  band: { width: 1600, height: 1100 }, // editorial two-column image
  square: { width: 1200, height: 1200 },
};

const PALETTE = {
  cream: "#F5F1EA",
  creamDeep: "#EBE4D8",
  sand: "#D8CFC0",
  terracotta: "#C57A54",
  olive: "#6B7259",
  clay: "#8C4A3B",
  charcoal: "#1E1B16",
};

const toRgb = (value) => {
  const hex = (PALETTE[value] ?? value).replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
  if ([r, g, b].some(Number.isNaN)) throw new Error(`Not a colour: "${value}"`);
  return { r, g, b };
};

function parseArgs(argv) {
  const [input, ...rest] = argv;
  const flags = {};
  for (let i = 0; i < rest.length; i += 2) {
    if (rest[i]?.startsWith("--")) flags[rest[i].slice(2)] = rest[i + 1];
  }
  return { input, flags };
}

const { input, flags } = parseArgs(process.argv.slice(2));

if (!input || !flags.out) {
  console.error("Usage: node scripts/process-photo.mjs <input> --out <name> [--preset product] [--bg cream]");
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

const { width, height } = preset;
const saturation = Number(flags.sat ?? 0.68);
const warmth = Number(flags.warm ?? 0.5);
const veil = Number(flags.veil ?? 0.12);
const quality = Number(flags.quality ?? 88);
const bgThreshold = Number(flags.bgthreshold ?? 236);
const bgFeather = Number(flags.bgfeather ?? 1.5);

// --- 1. Crop and fit. Everything downstream works at the output size. ---
let base = sharp(input).rotate(); // honour EXIF orientation

if (flags.crop) {
  const [x, y, w, h] = String(flags.crop).split(",").map(Number);
  if ([x, y, w, h].some((n) => !Number.isFinite(n))) {
    console.error("--crop expects four numbers: x,y,w,h as fractions of 0-1");
    process.exit(1);
  }
  const meta = await sharp(input).rotate().metadata();
  base = base.extract({
    left: Math.round(x * meta.width),
    top: Math.round(y * meta.height),
    width: Math.max(1, Math.round(w * meta.width)),
    height: Math.max(1, Math.round(h * meta.height)),
  });
}

// When we are keying out a white ground, `contain` keeps the whole subject in
// frame (the padding is white, which the key removes anyway). Otherwise fill.
const fitting = flags.bg
  ? { fit: "contain", background: { r: 255, g: 255, b: 255 } }
  : { fit: "cover", position: "attention" };

const fitted = sharp(await base.resize(width, height, fitting).png().toBuffer());

// --- 2 & 3. Grade the subject, then wash it toward the palette. ---
const layers = [];
if (warmth > 0) {
  layers.push({
    input: { create: { width, height, channels: 4, background: { r: 214, g: 168, b: 120, alpha: warmth * 0.5 } } },
    blend: "soft-light",
  });
}
if (veil > 0) {
  layers.push({
    input: { create: { width, height, channels: 4, background: { ...toRgb(flags.veilcolor ?? "cream"), alpha: veil } } },
    blend: "over",
  });
}

let graded = fitted
  .clone()
  .modulate({ saturation, brightness: 1.03 })
  .linear(1.06, -6); // gentle contrast, lifted blacks
if (layers.length) graded = graded.composite(layers);

let output;

if (flags.bg) {
  // --- 4. Key the white ground out and drop the subject onto a brand colour.
  // The mask is derived from the UNGRADED frame so the threshold stays
  // predictable no matter how hard the grade is pushed.
  const mask = await fitted
    .clone()
    .greyscale()
    .threshold(bgThreshold) // background (bright) -> 255, subject -> 0
    .negate() // subject -> 255, background -> 0
    .blur(bgFeather > 0 ? Math.max(0.3, bgFeather) : 0.3)
    .raw()
    .toBuffer();

  const subject = await graded.removeAlpha().raw().toBuffer();

  const cutout = await sharp(subject, { raw: { width, height, channels: 3 } })
    .joinChannel(mask, { raw: { width, height, channels: 1 } })
    .png()
    .toBuffer();

  output = sharp({ create: { width, height, channels: 3, background: toRgb(flags.bg) } })
    .composite([{ input: cutout }]);
} else {
  output = graded;
}

const outPath = join(OUT_DIR, `${flags.out}.jpg`);
await output.jpeg({ quality, mozjpeg: true }).toFile(outPath);

console.log(
  `Wrote ${outPath}\n  ${width}x${height}  ${(statSync(outPath).size / 1024).toFixed(0)}kB` +
    `  sat=${saturation} warm=${warmth} veil=${veil}` +
    (flags.bg ? `  ground=${flags.bg} (threshold ${bgThreshold}, feather ${bgFeather})` : "")
);
