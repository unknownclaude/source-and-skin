/**
 * Generates the placeholder art in /public/images.
 *
 * These are stand-ins for real photography — flat vector compositions on the
 * brand accent colours, sized to the aspect ratios the layout expects. They are
 * authored as SVG and rasterised to .jpg with sharp, so the committed assets
 * behave exactly like the photographs that will replace them.
 *
 * Re-run with `node scripts/generate-placeholders.mjs` after changing the
 * palette. When real photography arrives, delete this script and drop .jpg
 * files in with the same names (or update the paths in data/products.ts). Keep
 * 4:5 for product shots and 16:9-ish for the wide editorial bands.
 *
 * Composition rules, learned the hard way: the subject must be opaque and sit
 * on a ground a few steps off its own tone, and it needs a cast shadow. A
 * translucent subject on a matching ground reads as an empty coloured box.
 */

import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "images");
mkdirSync(OUT, { recursive: true });

const PALETTE = {
  cream: "#F5F1EA",
  creamDeep: "#EBE4D8",
  charcoal: "#1E1B16",
  terracotta: "#C57A54",
  olive: "#6B7259",
  clay: "#8C4A3B",
  sand: "#D8CFC0",
};

/** Bone tones for the subjects — warm off-whites, opaque. */
const BONE = "#E8DFCE";
const BONE_SHADE = "#C6B79E";
const BONE_DEEP = "#A2907A";

/** Lighten (amount > 0) or darken (amount < 0) a hex colour. */
function shade(hex, amount) {
  const clean = hex.replace("#", "");
  const channels = [0, 2, 4].map((i) => parseInt(clean.slice(i, i + 2), 16));
  const mixed = channels.map((value) => {
    const target = amount > 0 ? 255 : 0;
    return Math.round(value + (target - value) * Math.abs(amount));
  });
  return `#${mixed.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

let uid = 0;
const nextId = () => `f${(uid += 1)}`;

/**
 * Studio ground: the accent colour with a raking light from upper-left, a
 * vignette, and a fine grain pass so the JPEG does not band.
 */
function ground(id, w, h, base) {
  return `
  <defs>
    <radialGradient id="light-${id}" cx="0.36" cy="0.28" r="0.85">
      <stop offset="0%" stop-color="${shade(base, 0.24)}"/>
      <stop offset="58%" stop-color="${base}"/>
      <stop offset="100%" stop-color="${shade(base, -0.26)}"/>
    </radialGradient>
    <filter id="blur-${id}" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="34"/>
    </filter>
    <filter id="softblur-${id}" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="12"/>
    </filter>
    <filter id="grain-${id}" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.82" numOctaves="3" seed="${id.length * 11}"/>
      <feColorMatrix type="saturate" values="0"/>
      <feComponentTransfer><feFuncA type="linear" slope="0.05"/></feComponentTransfer>
    </filter>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#light-${id})"/>`;
}

const frame = (w, h, base, body) => {
  const id = nextId();
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img">
${ground(id, w, h, base)}
${typeof body === "function" ? body(id) : body}
  <rect width="${w}" height="${h}" filter="url(#grain-${id})" opacity="0.55"/>
</svg>`;
};

/** Soft cast shadow beneath a subject — what lifts it off the ground. */
const castShadow = (id, cx, cy, rx, ry, opacity = 0.34) =>
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${PALETTE.charcoal}" opacity="${opacity}" filter="url(#blur-${id})"/>`;

/**
 * The net sponge: a coiled mesh tube seen from above. Drawn as an opaque ring
 * with a crosshatch weave clipped inside it, plus the loop lines that show it
 * is a tube rather than a disc.
 */
function netSponge(id, cx, cy, outerR, { squash = 0.82, rotate = -12, scale = 1 } = {}) {
  const clip = `weave-${id}-${Math.round(cx)}`;
  const outerRy = outerR * squash;
  const innerR = outerR * 0.34;
  const innerRy = innerR * squash;

  const hatch = [];
  const span = outerR * 2.4;
  for (let offset = -span; offset <= span; offset += 26) {
    hatch.push(
      `<line x1="${(cx + offset).toFixed(0)}" y1="${(cy - span).toFixed(0)}" x2="${(cx + offset + span).toFixed(0)}" y2="${(cy + span).toFixed(0)}" stroke="${BONE_SHADE}" stroke-width="7"/>`,
      `<line x1="${(cx + offset).toFixed(0)}" y1="${(cy + span).toFixed(0)}" x2="${(cx + offset + span).toFixed(0)}" y2="${(cy - span).toFixed(0)}" stroke="${BONE_SHADE}" stroke-width="7"/>`
    );
  }

  // Loops running around the ring, suggesting the coiled tube.
  const loops = [];
  for (let i = 0; i < 26; i++) {
    const a = (i / 26) * Math.PI * 2;
    const x1 = cx + Math.cos(a) * innerR * 1.05;
    const y1 = cy + Math.sin(a) * innerRy * 1.05;
    const x2 = cx + Math.cos(a) * outerR * 0.99;
    const y2 = cy + Math.sin(a) * outerRy * 0.99;
    loops.push(
      `<line x1="${x1.toFixed(0)}" y1="${y1.toFixed(0)}" x2="${x2.toFixed(0)}" y2="${y2.toFixed(0)}" stroke="${BONE_DEEP}" stroke-opacity="0.5" stroke-width="5"/>`
    );
  }

  return `<g transform="translate(${cx} ${cy}) rotate(${rotate}) scale(${scale}) translate(${-cx} ${-cy})">
    ${castShadow(id, cx + outerR * 0.1, cy + outerRy * 0.5, outerR * 0.94, outerRy * 0.62)}
    <defs>
      <clipPath id="${clip}">
        <path d="M ${cx - outerR} ${cy}
                 a ${outerR} ${outerRy} 0 1 0 ${outerR * 2} 0
                 a ${outerR} ${outerRy} 0 1 0 ${-outerR * 2} 0
                 M ${cx - innerR} ${cy}
                 a ${innerR} ${innerRy} 0 1 1 ${innerR * 2} 0
                 a ${innerR} ${innerRy} 0 1 1 ${-innerR * 2} 0 Z"
              clip-rule="evenodd"/>
      </clipPath>
    </defs>
    <g clip-path="url(#${clip})">
      <rect x="${cx - outerR}" y="${cy - outerRy}" width="${outerR * 2}" height="${outerRy * 2}" fill="${BONE}"/>
      ${hatch.join("")}
      ${loops.join("")}
      <ellipse cx="${cx - outerR * 0.28}" cy="${cy - outerRy * 0.4}" rx="${outerR * 0.7}" ry="${outerRy * 0.6}" fill="${PALETTE.cream}" opacity="0.34" filter="url(#softblur-${id})"/>
      <ellipse cx="${cx + outerR * 0.34}" cy="${cy + outerRy * 0.42}" rx="${outerR * 0.62}" ry="${outerRy * 0.5}" fill="${PALETTE.charcoal}" opacity="0.2" filter="url(#softblur-${id})"/>
    </g>
    <ellipse cx="${cx}" cy="${cy}" rx="${outerR}" ry="${outerRy}" fill="none" stroke="${BONE_DEEP}" stroke-opacity="0.55" stroke-width="4"/>
    <ellipse cx="${cx}" cy="${cy}" rx="${innerR}" ry="${innerRy}" fill="none" stroke="${BONE_DEEP}" stroke-opacity="0.45" stroke-width="4"/>
  </g>`;
}

/**
 * A miswak root: tapered rod, opaque, with a bark band, a form shadow down one
 * side, splayed bristles at the top and a cast shadow underneath.
 */
function miswak(id, x, y, length, width, angle, { bristles = true, shadow = true } = {}) {
  const half = length / 2;
  const bristleStrokes = [];
  if (bristles) {
    for (let i = 0; i < 11; i++) {
      const t = (i - 5) / 5;
      const rootX = t * width * 0.42;
      const tipX = t * width * 1.15;
      const len = 46 - Math.abs(t) * 14;
      bristleStrokes.push(
        `<line x1="${rootX.toFixed(1)}" y1="${(-half + 6).toFixed(1)}" x2="${tipX.toFixed(1)}" y2="${(-half - len).toFixed(1)}" stroke="${BONE}" stroke-width="6" stroke-linecap="round"/>`
      );
    }
  }

  return `<g>
    ${shadow ? castShadow(id, x + width * 0.55, y + length * 0.06, width * 1.5, half * 0.92, 0.3) : ""}
    <g transform="translate(${x} ${y}) rotate(${angle})">
      <rect x="${-width / 2}" y="${-half}" width="${width}" height="${length}" rx="${width / 2}" fill="${BONE}"/>
      <rect x="${width * 0.06}" y="${-half}" width="${width * 0.44}" height="${length}" rx="${width / 2.4}" fill="${BONE_SHADE}"/>
      <rect x="${width * 0.3}" y="${-half}" width="${width * 0.2}" height="${length}" rx="${width / 3}" fill="${BONE_DEEP}" opacity="0.55"/>
      <rect x="${-width / 2}" y="${half * 0.1}" width="${width}" height="${half * 0.78}" rx="${width / 2}" fill="${PALETTE.clay}" opacity="0.42"/>
      <rect x="${-width / 2}" y="${half * 0.1}" width="${width}" height="10" fill="${BONE_DEEP}" opacity="0.6"/>
      ${bristleStrokes.join("")}
    </g>
  </g>`;
}

/** Vertical fibrous bands — bark, or the weave seen very close. */
function fibreField(w, h, tone, { count = 26, wobble = 30, light = PALETTE.cream } = {}) {
  const bands = [];
  const step = w / count;
  for (let i = 0; i < count; i++) {
    const x = i * step;
    const drift = ((i % 5) - 2) * wobble;
    const width = step * (0.42 + ((i * 7) % 5) / 12);
    const fill = i % 3 === 0 ? light : i % 3 === 1 ? tone : shade(tone, -0.2);
    const opacity = 0.2 + ((i * 3) % 4) * 0.13;
    bands.push(
      `<path d="M ${x.toFixed(0)} -20 C ${(x + drift).toFixed(0)} ${(h * 0.34).toFixed(0)}, ${(x - drift).toFixed(0)} ${(h * 0.68).toFixed(0)}, ${(x + drift / 2).toFixed(0)} ${(h + 20).toFixed(0)} L ${(x + width + drift / 2).toFixed(0)} ${(h + 20).toFixed(0)} C ${(x + width - drift).toFixed(0)} ${(h * 0.68).toFixed(0)}, ${(x + width + drift).toFixed(0)} ${(h * 0.34).toFixed(0)}, ${(x + width).toFixed(0)} -20 Z" fill="${fill}" opacity="${opacity.toFixed(2)}"/>`
    );
  }
  return bands.join("");
}

const files = [];
const add = (name, svg) => files.push([name, svg]);

/* ---------- Net sponge, regular — terracotta ---------- */
add("placeholder-net-sponge-regular.jpg",
  frame(1200, 1500, PALETTE.terracotta, (id) => netSponge(id, 600, 760, 400)));

add("placeholder-net-sponge-regular-alt.jpg",
  frame(1200, 1500, shade(PALETTE.terracotta, -0.14), (id) =>
    `${netSponge(id, 520, 700, 520, { rotate: 18, squash: 0.9 })}
     ${netSponge(id, 900, 1180, 230, { rotate: -30, squash: 0.7 })}`));

/* ---------- Net sponge, XL — clay ---------- */
add("placeholder-net-sponge-xl.jpg",
  frame(1200, 1500, PALETTE.clay, (id) =>
    `${netSponge(id, 600, 660, 420)}
     ${netSponge(id, 600, 1180, 300, { squash: 0.42, rotate: 6 })}`));

add("placeholder-net-sponge-xl-alt.jpg",
  frame(1200, 1500, shade(PALETTE.clay, -0.16), (id) =>
    netSponge(id, 600, 780, 560, { rotate: 24, squash: 0.94 })));

/* ---------- Miswak, single — olive ---------- */
add("placeholder-miswak-single.jpg",
  frame(1200, 1500, PALETTE.olive, (id) => miswak(id, 600, 760, 900, 96, 7)));

add("placeholder-miswak-single-alt.jpg",
  frame(1200, 1500, shade(PALETTE.olive, -0.16), (id) =>
    `${miswak(id, 560, 800, 1120, 150, -5)}
     <g opacity="0.5">${miswak(id, 950, 900, 700, 70, 22, { shadow: false })}</g>`));

/* ---------- Miswak, 3-pack — terracotta ---------- */
add("placeholder-miswak-3pack.jpg",
  frame(1200, 1500, PALETTE.terracotta, (id) =>
    `${miswak(id, 400, 790, 840, 82, -11)}
     ${miswak(id, 600, 760, 900, 88, 1)}
     ${miswak(id, 800, 795, 830, 82, 13)}`));

add("placeholder-miswak-3pack-alt.jpg",
  frame(1200, 1500, shade(PALETTE.terracotta, -0.16), (id) =>
    `${miswak(id, 470, 820, 1000, 116, -17)}
     ${miswak(id, 730, 790, 980, 116, 15)}`));

/* ---------- Ritual bundle — clay ---------- */
add("placeholder-ritual-bundle.jpg",
  frame(1200, 1500, PALETTE.clay, (id) =>
    `${netSponge(id, 470, 620, 300, { rotate: -18 })}
     ${miswak(id, 760, 1020, 620, 66, 14)}
     ${miswak(id, 860, 1040, 580, 62, 23)}`));

add("placeholder-ritual-bundle-alt.jpg",
  frame(1200, 1500, shade(PALETTE.clay, -0.16), (id) =>
    `<g>
       ${castShadow(id, 620, 830, 400, 330, 0.3)}
       <rect x="215" y="455" width="770" height="660" rx="14" fill="${shade(PALETTE.sand, 0.14)}"/>
       <rect x="215" y="455" width="770" height="660" rx="14" fill="none" stroke="${BONE_DEEP}" stroke-opacity="0.5" stroke-width="5"/>
       <rect x="215" y="455" width="770" height="66" fill="${PALETTE.charcoal}" opacity="0.12"/>
     </g>
     ${netSponge(id, 450, 760, 190, { rotate: -12 })}
     ${miswak(id, 790, 780, 470, 54, 3)}`));

/* ---------- Texture studies ---------- */
add("placeholder-texture-fiber.jpg",
  frame(1200, 1500, PALETTE.terracotta, (id) =>
    `<g clip-path="none">${fibreField(1200, 1500, PALETTE.clay, { count: 20, wobble: 46 })}</g>
     ${netSponge(id, 600, 780, 640, { rotate: 30, squash: 1 })}`));

add("placeholder-texture-bark.jpg",
  frame(1200, 1500, PALETTE.clay, () =>
    fibreField(1200, 1500, shade(PALETTE.clay, -0.3), { count: 15, wobble: 58, light: BONE })));

/* ---------- Lifestyle scenes ---------- */
add("placeholder-lifestyle-bath.jpg",
  frame(1600, 1200, PALETTE.creamDeep, (id) =>
    `<rect x="0" y="700" width="1600" height="500" fill="${PALETTE.sand}"/>
     <rect x="0" y="694" width="1600" height="12" fill="${shade(PALETTE.sand, -0.2)}"/>
     <g filter="url(#blur-${id})" opacity="0.55">
       <rect x="1050" y="180" width="300" height="520" rx="150" fill="${PALETTE.olive}"/>
       <rect x="1330" y="330" width="200" height="370" rx="100" fill="${PALETTE.terracotta}"/>
     </g>
     ${netSponge(id, 470, 560, 250, { rotate: -8 })}
     ${miswak(id, 830, 560, 420, 52, 6)}
     <rect x="0" y="0" width="1600" height="1200" fill="${PALETTE.charcoal}" opacity="0.06"/>`));

add("placeholder-lifestyle-counter.jpg",
  frame(1600, 1200, PALETTE.sand, (id) =>
    `<rect x="0" y="760" width="1600" height="440" fill="${shade(PALETTE.creamDeep, 0.05)}"/>
     <g filter="url(#blur-${id})" opacity="0.5">
       <circle cx="1240" cy="400" r="290" fill="${PALETTE.terracotta}"/>
     </g>
     <g>
       ${castShadow(id, 660, 880, 220, 60, 0.26)}
       <path d="M 545 520 h 210 l -22 330 h -166 Z" fill="${shade(PALETTE.cream, -0.04)}"/>
       <ellipse cx="650" cy="520" rx="105" ry="26" fill="${PALETTE.cream}"/>
       <ellipse cx="650" cy="520" rx="105" ry="26" fill="none" stroke="${BONE_DEEP}" stroke-opacity="0.4" stroke-width="4"/>
     </g>
     ${miswak(id, 615, 430, 430, 46, -8, { shadow: false })}
     ${miswak(id, 685, 445, 400, 44, 9, { shadow: false })}`));

/* ---------- Wide editorial bands + hero poster ---------- */
add("placeholder-hero-poster.jpg",
  frame(1920, 1080, PALETTE.clay, (id) =>
    `<g filter="url(#blur-${id})" opacity="0.5">
       <circle cx="1420" cy="360" r="440" fill="${shade(PALETTE.terracotta, 0.1)}"/>
       <circle cx="380" cy="820" r="330" fill="${shade(PALETTE.olive, -0.1)}"/>
     </g>
     ${netSponge(id, 1330, 420, 330, { rotate: -14 })}
     ${miswak(id, 1240, 810, 480, 62, 14)}
     ${miswak(id, 1370, 830, 440, 58, 24)}`));

add("placeholder-editorial-sourcing.jpg",
  frame(1600, 1100, shade(PALETTE.olive, -0.1), (id) =>
    `<g opacity="0.9">${fibreField(1600, 1100, shade(PALETTE.olive, -0.42), { count: 9, wobble: 96, light: PALETTE.sand })}</g>
     <rect x="0" y="0" width="1600" height="1100" fill="${PALETTE.charcoal}" opacity="0.1"/>
     ${miswak(id, 560, 560, 820, 116, -7)}
     ${netSponge(id, 1140, 600, 300, { rotate: 16 })}`));

add("placeholder-editorial-ritual.jpg",
  frame(1920, 1000, shade(PALETTE.clay, -0.22), (id) =>
    `<g filter="url(#blur-${id})" opacity="0.5">
       <circle cx="1430" cy="440" r="440" fill="${PALETTE.terracotta}"/>
       <circle cx="560" cy="720" r="340" fill="${shade(PALETTE.olive, -0.2)}"/>
     </g>
     ${netSponge(id, 1450, 430, 300, { rotate: 16 })}
     ${miswak(id, 1290, 780, 420, 54, -12)}`));

add("placeholder-about-portrait.jpg",
  frame(1600, 900, PALETTE.terracotta, (id) =>
    `<rect x="0" y="600" width="1600" height="300" fill="${shade(PALETTE.terracotta, -0.24)}"/>
     <g filter="url(#blur-${id})" opacity="0.42">
       <circle cx="1300" cy="300" r="300" fill="${PALETTE.sand}"/>
     </g>
     ${netSponge(id, 560, 520, 270, { rotate: -20 })}
     ${miswak(id, 1010, 520, 480, 58, 8)}`));

add("placeholder-sourcing-map.jpg",
  frame(1600, 1100, PALETTE.creamDeep, () =>
    `<g stroke="${PALETTE.charcoal}" stroke-opacity="0.14" fill="none" stroke-width="2">
       ${Array.from({ length: 11 }, (_, i) => `<line x1="0" y1="${i * 110}" x2="1600" y2="${i * 110}"/>`).join("")}
       ${Array.from({ length: 15 }, (_, i) => `<line x1="${i * 110}" y1="0" x2="${i * 110}" y2="1100"/>`).join("")}
     </g>
     <path d="M 470 560 Q 745 300 1020 470" fill="none" stroke="${PALETTE.charcoal}" stroke-opacity="0.4" stroke-width="4" stroke-dasharray="12 14"/>
     <circle cx="470" cy="560" r="118" fill="${PALETTE.terracotta}"/>
     <circle cx="470" cy="560" r="182" fill="none" stroke="${PALETTE.terracotta}" stroke-opacity="0.6" stroke-width="4"/>
     <circle cx="1020" cy="470" r="98" fill="${PALETTE.clay}"/>
     <circle cx="1020" cy="470" r="158" fill="none" stroke="${PALETTE.clay}" stroke-opacity="0.6" stroke-width="4"/>`));

/* Rasterise every composition to a .jpg. */
await Promise.all(
  files.map(async ([name, contents]) => {
    await sharp(Buffer.from(contents.trim()), { density: 150 })
      .flatten({ background: PALETTE.cream })
      .jpeg({ quality: 86, mozjpeg: true })
      .toFile(join(OUT, name));
    // Clear any .svg left by an earlier revision of this script.
    rmSync(join(OUT, name.replace(/\.jpg$/, ".svg")), { force: true });
  })
);
console.log(`Wrote ${files.length} placeholder JPGs to public/images`);
