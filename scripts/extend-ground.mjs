// Extends a marble-ground product shot downward so the near-square frame can be
// cropped to 4:5 without cutting the subject. The bottom strip of these photos
// is plain, softly-lit marble, so a vertical stretch of it reads as more of the
// same surface rather than as a repeat.
import sharp from "sharp";

const [input, output, targetRatioArg] = process.argv.slice(2);
const targetRatio = Number(targetRatioArg ?? 0.8); // w/h

const src = sharp(input);
const { width: W, height: H } = await src.metadata();
const targetH = Math.round(W / targetRatio);
const add = targetH - H;
if (add <= 0) throw new Error(`No extension needed: ${W}x${H}`);

const SAMPLE = 70; // rows of marble to stretch
const strip = await sharp(input)
  .extract({ left: 0, top: H - SAMPLE, width: W, height: SAMPLE })
  .resize(W, add, { fit: "fill", kernel: "lanczos3" })
  .blur(6) // kills the vertical smear of any veining
  .toBuffer();

// Feather the joint: the top ~40px of the extension fades into the original.
const FEATHER = 40;
const mask = await sharp({
  create: { width: W, height: add, channels: 3, background: "#000" },
})
  .composite([
    {
      input: await sharp({
        create: { width: W, height: FEATHER, channels: 3, background: "#fff" },
      })
        .linear(-1, 255) // top opaque -> handled by gradient below
        .png()
        .toBuffer(),
      top: 0,
      left: 0,
      blend: "over",
    },
  ])
  .png()
  .toBuffer();

const base = await sharp(input).toBuffer();
const out = await sharp({
  create: { width: W, height: targetH, channels: 3, background: "#f2ece2" },
})
  .composite([
    { input: strip, top: H, left: 0 },
    { input: base, top: 0, left: 0 },
  ])
  .png()
  .toBuffer();

// Smooth the hard seam at y=H with a narrow blurred band composited back.
const BAND = 26;
const band = await sharp(out)
  .extract({ left: 0, top: H - BAND / 2, width: W, height: BAND })
  .blur(5)
  .toBuffer();

await sharp(out)
  .composite([{ input: band, top: H - BAND / 2, left: 0 }])
  .png()
  .toFile(output);

console.log(`${input} ${W}x${H} -> ${W}x${targetH} (+${add})`);
