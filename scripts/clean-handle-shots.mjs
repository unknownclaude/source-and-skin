/**
 * Prepares the handled-sponge product shots: removes the branded prop card and
 * outputs them at the 4:5 the product grid expects.
 *
 * Two steps, in this order, because the order is what makes it work:
 *
 *   1. CROP right-anchored to 4:5. The card sits top-left, so the crop the
 *      layout needs anyway removes most of it for free — and a crop cannot
 *      smear or damage the mesh the way inpainting can.
 *   2. FILL the narrow strip of card still showing at the left edge. After the
 *      crop, no product overlaps that strip, so a plain background transfer is
 *      exact rather than a guess.
 *
 * An earlier attempt inpainted the card in place across the whole frame. It was
 * abandoned: the card photographs darker than the mesh on some colourways and
 * brighter on others, so no single rule separated them, and on the blue it ate
 * a rectangle out of the product.
 *
 * Run: node scripts/clean-handle-shots.mjs
 */

import { mkdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const IN = "/tmp/shots";
const OUT = "public/images";
mkdirSync(OUT, { recursive: true });

/**
 * `isProduct` per colourway, from probed pixel values. It is used to find where
 * the mesh actually begins, so the fill stops there rather than at a guessed
 * fraction — guessing at 17% ate into the pink and the ivory.
 */
const JOBS = [
  // Probed card vs mesh — each rule is the one axis that actually separates them:
  //   black   card lum 234 vs mesh 8      -> darkness
  //   blue    card sat .15 vs mesh .78-1  -> saturation
  //   pink    card lum  74 vs mesh 145    -> saturation AND brightness
  //   purple  card sat .13 vs mesh .36    -> saturation
  //   ivory   card r-b 11  vs mesh 23     -> warmth
  { file: "01.png", out: "sponge-handle-black", isProduct: (r, g, b, s, l) => l < 120 },
  // `patches` mop up card left ABOVE the row-scan's reach: on these rows the
  // braid is the first product pixel, so the scan stops before the fragment
  // sitting to its left-of-centre. Bounded well clear of the braid loop.
  { file: "02.png", out: "sponge-handle-blue", isProduct: (r, g, b, s, l) => s > 0.4,
    patches: [[0.03, 0.03, 0.14, 0.17]] },
  { file: "03.png", out: "sponge-handle-pink", isProduct: (r, g, b, s, l) => s > 0.28 && l > 110 },
  { file: "04.png", out: "sponge-handle-purple", isProduct: (r, g, b, s, l) => s > 0.24,
    patches: [[0.02, 0.03, 0.13, 0.16]] },
  { file: "05.png", out: "sponge-handle-white", isProduct: (r, g, b) => r - b > 18,
    patches: [[0.02, 0.03, 0.15, 0.16]] },
];

for (const job of JOBS) {
  const src = join(IN, job.file);
  const meta = await sharp(src).metadata();

  // 1. Right-anchored 4:5 crop.
  let cw = Math.round(meta.height * 0.8);
  let ch = meta.height;
  if (cw > meta.width) {
    cw = meta.width;
    ch = Math.round(meta.width / 0.8);
  }
  const cropped = await sharp(src)
    .extract({ left: meta.width - cw, top: Math.max(0, meta.height - ch), width: cw, height: ch })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { data, info } = cropped;
  const { width: W, height: H, channels: C } = info;
  const out = Buffer.from(data);

  // 2. Fill leftward of the product, ROW BY ROW.
  //    The two mesh panels form a V, so the product's left edge moves with y.
  //    A single vertical strip either leaves card behind at the top or eats
  //    into the mesh at the bottom; a per-row boundary does neither.
  const cleanX = W - 10;
  const CAP = Math.round(0.30 * W); // never intrude this far, whatever happens
  let painted = 0;

  for (let y = 0; y < H; y++) {
    // Where does the product begin on this row?
    let edge = CAP;
    for (let x = 0; x < CAP; x++) {
      const i = (y * W + x) * C;
      const r = data[i], g = data[i + 1], b = data[i + 2];
      const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
      const sat = mx === 0 ? 0 : (mx - mn) / mx;
      const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      if (job.isProduct(r, g, b, sat, lum)) { edge = x; break; }
    }

    const stop = Math.max(0, edge - 3); // keep a hair of clearance off the mesh
    const ci = (y * W + cleanX) * C;
    const br = data[ci], bg = data[ci + 1], bb = data[ci + 2];

    for (let x = 0; x < stop; x++) {
      const i = (y * W + x) * C;
      const a = x > stop - 5 ? (stop - x) / 5 : 1; // feather the inner edge
      out[i] = Math.round(data[i] * (1 - a) + br * a);
      out[i + 1] = Math.round(data[i + 1] * (1 - a) + bg * a);
      out[i + 2] = Math.round(data[i + 2] * (1 - a) + bb * a);
      if (a > 0.5) painted++;
    }
  }

  // 3. Mop-up patches, protecting the braid by saturation.
  for (const [px, py, pw, ph] of job.patches ?? []) {
    const bx0 = Math.round(px * W), by0 = Math.round(py * H);
    const bx1 = Math.round((px + pw) * W), by1 = Math.round((py + ph) * H);
    for (let y = by0; y < by1; y++) {
      const ci = (y * W + cleanX) * C;
      const br = data[ci], bg = data[ci + 1], bb = data[ci + 2];
      for (let x = bx0; x < bx1; x++) {
        const i = (y * W + x) * C;
        const r = out[i], g = out[i + 1], b = out[i + 2];
        const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
        const sat = mx === 0 ? 0 : (mx - mn) / mx;
        if (sat > 0.25) continue; // braid threads
        out[i] = br; out[i + 1] = bg; out[i + 2] = bb;
        painted++;
      }
    }
  }

  await sharp(out, { raw: { width: W, height: H, channels: C } })
    .resize(1200, 1500, { fit: "cover" })
    .jpeg({ quality: 90, mozjpeg: true })
    .toFile(join(OUT, `${job.out}.jpg`));

  console.log(`${job.out}.jpg  crop ${cw}x${ch}  repainted ${painted}px (${((painted / (W * H)) * 100).toFixed(1)}%)`);
}
