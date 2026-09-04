/**
 * Clones clean marble over an unwanted object in a flat-lay.
 *
 * Used to take the net sponge out of the 3-pack frame: the product is three
 * miswak sticks, and a white shape at the edge of the card reads as a fourth
 * item in the box. The ground is smooth, evenly-lit marble, so a scaled and
 * softened patch of it from elsewhere in the SAME photograph is
 * indistinguishable from the surface it replaces.
 *
 * The mask is a half-plane, not a rectangle. In this frame the sticks run
 * diagonally and the sponge sits to their upper right, so a rectangle wide
 * enough to cover the sponge also covers the third stick (which is what the
 * first attempt did — it wiped the stick's top and left a ghost). A line
 * traced down the gap between them separates the two cleanly.
 *
 * Usage:
 *   node scripts/patch-marble.mjs <in> <out> --src x,y,w,h --dst x,y,w,h \
 *     [--line x1,y1,x2,y2] [--feather 30]
 *
 * With --line, only the pixels to the RIGHT of the line are replaced.
 */
import sharp from "sharp";

const args = process.argv.slice(2);
const [input, output] = args;
const flag = (name) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? null : args[i + 1];
};
const nums = (s) => s.split(",").map(Number);
const box = (s) => {
  const [x, y, w, h] = nums(s);
  return { left: x, top: y, width: w, height: h };
};

const src = box(flag("src"));
const dst = box(flag("dst"));
const feather = Number(flag("feather") ?? 30);
const line = flag("line") ? nums(flag("line")) : null;

const patch = await sharp(input)
  .extract(src)
  .resize(dst.width, dst.height, { fit: "fill" })
  .blur(3)
  .removeAlpha()
  .raw()
  .toBuffer();

const { width: W, height: H } = dst;
const rgba = Buffer.alloc(W * H * 4);

for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const i = y * W + x;
    // Fade to nothing at the patch's own edges so it has no visible border.
    const edge = Math.min(x, y, W - 1 - x, H - 1 - y);
    let a = Math.min(1, edge / feather);

    if (line) {
      const [x1, y1, x2, y2] = line;
      const gy = y + dst.top;
      const boundary = x1 + ((gy - y1) * (x2 - x1)) / (y2 - y1) - dst.left;
      // Opaque well right of the boundary, transparent left of it.
      a *= Math.max(0, Math.min(1, (x - boundary) / feather));
    }

    rgba[i * 4] = patch[i * 3];
    rgba[i * 4 + 1] = patch[i * 3 + 1];
    rgba[i * 4 + 2] = patch[i * 3 + 2];
    rgba[i * 4 + 3] = Math.round(255 * a);
  }
}

await sharp(input)
  .composite([{ input: rgba, raw: { width: W, height: H, channels: 4 }, left: dst.left, top: dst.top }])
  .png()
  .toFile(output);

console.log(`patched ${W}x${H} at ${dst.left},${dst.top}${line ? " (half-plane)" : ""}`);
