/**
 * Crops a studio shot so the subject fills the frame.
 *
 * Marketplace product photography is shot small in a large white field —
 * useful for a listing thumbnail, wrong for an editorial grid. Dropped into a
 * 4:5 card at 427px wide, a miswak stick occupying 11% of its own frame reads
 * as an empty cream rectangle with something small in it, and a page of those
 * reads as an unfinished site. The subject has to own the frame.
 *
 * Finds the subject by difference from the frame's own corner colour, which
 * works for any pale ground (white cyclorama, cream marble) without being told
 * which. Then crops to the target aspect around the subject's centre, growing
 * whichever dimension is short rather than squashing.
 *
 * `--rotate` runs first and matters more than it sounds: a stick lying
 * diagonally across a landscape frame cannot fill a portrait one at any crop,
 * because its bounding box is the wrong shape. Turn it steep and the same
 * object fills the frame corner to corner.
 *
 * Usage:
 *   node scripts/fill-frame.mjs <in> <out.png> [--rotate 55] [--aspect 0.8]
 *                                              [--margin 0.05] [--threshold 42]
 */
import sharp from "sharp";

const args = process.argv.slice(2);
const [input, output] = args;
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? fallback : Number(args[i + 1]);
};

const rotate = flag("rotate", 0);
const aspect = flag("aspect", 0.8); // width / height
const margin = flag("margin", 0.05); // share of the subject's larger side
const threshold = flag("threshold", 42);

// Rotate first, filling new corners with the frame's own background so the
// added area is indistinguishable from the original ground.
const probe = await sharp(input).raw().toBuffer({ resolveWithObject: true });
const pc = probe.info.channels;
const bg = { r: probe.data[0], g: probe.data[1], b: probe.data[2] };

const rotated = rotate
  ? await sharp(input).rotate(rotate, { background: bg }).png().toBuffer()
  : await sharp(input).png().toBuffer();

const { data, info } = await sharp(rotated).raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H, channels: C } = info;

let minX = W;
let maxX = 0;
let minY = H;
let maxY = 0;
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const i = (y * W + x) * C;
    const diff =
      Math.abs(data[i] - bg.r) + Math.abs(data[i + 1] - bg.g) + Math.abs(data[i + 2] - bg.b);
    if (diff > threshold) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
}

if (maxX <= minX || maxY <= minY) throw new Error("No subject found — lower --threshold");

const subjectW = maxX - minX;
const subjectH = maxY - minY;
const pad = Math.round(Math.max(subjectW, subjectH) * margin);
const cx = (minX + maxX) / 2;
const cy = (minY + maxY) / 2;

// Grow the short side to reach the target aspect; never shrink the long one,
// or the crop would cut the subject it was supposed to showcase.
let cropW = subjectW + pad * 2;
let cropH = subjectH + pad * 2;
if (cropW / cropH > aspect) cropH = cropW / aspect;
else cropW = cropH * aspect;

// Clamp inside the image, keeping the aspect exact.
const scale = Math.min(1, W / cropW, H / cropH);
cropW = Math.floor(cropW * scale);
cropH = Math.floor(cropH * scale);
const left = Math.max(0, Math.min(W - cropW, Math.round(cx - cropW / 2)));
const top = Math.max(0, Math.min(H - cropH, Math.round(cy - cropH / 2)));

await sharp(rotated).extract({ left, top, width: cropW, height: cropH }).png().toFile(output);

const before = ((subjectW * subjectH) / (W * H)) * 100;
const after = ((subjectW * subjectH) / (cropW * cropH)) * 100;
console.log(
  `${input} -> ${output}\n  subject ${subjectW}x${subjectH}  crop ${cropW}x${cropH} at ${left},${top}` +
    `\n  subject box went from ${before.toFixed(1)}% to ${after.toFixed(1)}% of the frame`
);
