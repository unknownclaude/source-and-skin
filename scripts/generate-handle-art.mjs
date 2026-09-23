/**
 * Stand-in art for the handled net sponge, one per colourway.
 *
 * Written to replace five photographs that were another brand's — see
 * MEDIA.md and commit 1cf7424. Four of those five now have the owner's own
 * photography, so in practice this fills the one remaining gap:
 *
 *   node scripts/generate-handle-art.mjs white
 *
 * It is drawn, not photographed, so there is nothing in it belonging to
 * anybody else. It is also visibly a drawing sitting among four photographs,
 * which is the point — the gap should be obvious rather than papered over,
 * and it closes the moment a white frame arrives.
 *
 * Deliberately illustrative rather than photo-realistic. A drawing that is
 * obviously a drawing is honest about being a stand-in; a drawing pretending
 * to be a photograph is its own small misrepresentation, and it would look
 * worse beside the real photographs when they arrive.
 *
 * The sponge itself is the same coiled-mesh construction that
 * scripts/generate-placeholders.mjs draws, tinted to the colourway and given
 * the braided cords this version is named for. Reusing that construction
 * rather than inventing a second one is why these sit beside the existing
 * placeholder art instead of looking like a different site.
 *
 * Re-run: node scripts/generate-handle-art.mjs
 */

import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "images");
mkdirSync(OUT, { recursive: true });

const CREAM = "#F5F1EA";
const CREAM_DEEP = "#EBE4D8";
const CHARCOAL = "#1E1B16";
const SAND = "#D8CFC0";

/** Matches HANDLED_SPONGE_COLOURS in data/products.ts. */
const COLOURWAYS = [
  { name: "black", mesh: "#241F1E" },
  { name: "blue", mesh: "#1F4F86" },
  { name: "pink", mesh: "#F09099" },
  { name: "purple", mesh: "#8F5F90" },
  { name: "white", mesh: "#F2EDDB" },
];

const W = 1200;
const H = 1500;

function shade(hex, amount) {
  const clean = hex.replace("#", "");
  return `#${[0, 2, 4]
    .map((i) => {
      const v = parseInt(clean.slice(i, i + 2), 16);
      const target = amount > 0 ? 255 : 0;
      return Math.round(v + (target - v) * Math.abs(amount))
        .toString(16)
        .padStart(2, "0");
    })
    .join("")}`;
}

function luminance(hex) {
  const clean = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(clean.slice(i, i + 2), 16) / 255);
  const ch = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * ch(r) + 0.7152 * ch(g) + 0.0722 * ch(b);
}

/** A pale sponge needs a deeper ground, or it disappears into the page. */
const groundFor = (mesh) => (luminance(mesh) > 0.55 ? SAND : CREAM_DEEP);

/**
 * The coiled mesh tube seen from above: an opaque ring with a crosshatch weave
 * clipped inside it, plus loop lines running around it so it reads as a tube
 * rather than a disc. Lifted from generate-placeholders.mjs and given a colour.
 */
function netSponge(id, cx, cy, outerR, colour, { squash = 0.82, rotate = -12 } = {}) {
  const clip = `weave-${id}`;
  const outerRy = outerR * squash;
  const innerR = outerR * 0.34;
  const innerRy = innerR * squash;
  const deep = shade(colour, -0.3);
  const deeper = shade(colour, -0.46);

  const hatch = [];
  const span = outerR * 2.4;
  for (let offset = -span; offset <= span; offset += 26) {
    hatch.push(
      `<line x1="${(cx + offset).toFixed(0)}" y1="${(cy - span).toFixed(0)}" x2="${(cx + offset + span).toFixed(0)}" y2="${(cy + span).toFixed(0)}" stroke="${deep}" stroke-width="7"/>`,
      `<line x1="${(cx + offset).toFixed(0)}" y1="${(cy + span).toFixed(0)}" x2="${(cx + offset + span).toFixed(0)}" y2="${(cy - span).toFixed(0)}" stroke="${deep}" stroke-width="7"/>`
    );
  }

  const loops = [];
  for (let i = 0; i < 26; i++) {
    const a = (i / 26) * Math.PI * 2;
    loops.push(
      `<line x1="${(cx + Math.cos(a) * innerR * 1.05).toFixed(0)}" y1="${(cy + Math.sin(a) * innerRy * 1.05).toFixed(0)}" x2="${(cx + Math.cos(a) * outerR * 0.99).toFixed(0)}" y2="${(cy + Math.sin(a) * outerRy * 0.99).toFixed(0)}" stroke="${deeper}" stroke-opacity="0.5" stroke-width="5"/>`
    );
  }

  return `<g transform="translate(${cx} ${cy}) rotate(${rotate}) translate(${-cx} ${-cy})">
    <ellipse cx="${cx + outerR * 0.1}" cy="${cy + outerRy * 0.55}" rx="${outerR * 0.94}" ry="${outerRy * 0.6}" fill="${CHARCOAL}" opacity="0.3" filter="url(#blur-${id})"/>
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
      <rect x="${cx - outerR}" y="${cy - outerRy}" width="${outerR * 2}" height="${outerRy * 2}" fill="${colour}"/>
      ${hatch.join("")}
      ${loops.join("")}
      <ellipse cx="${cx - outerR * 0.28}" cy="${cy - outerRy * 0.4}" rx="${outerR * 0.7}" ry="${outerRy * 0.6}" fill="${CREAM}" opacity="0.3" filter="url(#softblur-${id})"/>
      <ellipse cx="${cx + outerR * 0.34}" cy="${cy + outerRy * 0.42}" rx="${outerR * 0.62}" ry="${outerRy * 0.5}" fill="${CHARCOAL}" opacity="0.2" filter="url(#softblur-${id})"/>
    </g>
    <ellipse cx="${cx}" cy="${cy}" rx="${outerR}" ry="${outerRy}" fill="none" stroke="${deeper}" stroke-opacity="0.55" stroke-width="4"/>
    <ellipse cx="${cx}" cy="${cy}" rx="${innerR}" ry="${innerRy}" fill="none" stroke="${deeper}" stroke-opacity="0.45" stroke-width="4"/>
  </g>`;
}

/**
 * A braided cord, drawn as a loop with twist marks along it so it reads as
 * rope rather than as a moulded plastic handle.
 */
function cord(x1, y1, x2, y2, bow) {
  const rope = shade(SAND, -0.42);
  const highlight = shade(SAND, 0.12);
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  // Control point pushed perpendicular to the chord, which is what bows it.
  const cxp = mx + (-dy / len) * bow;
  const cyp = my + (dx / len) * bow;
  const path = `M ${x1} ${y1} Q ${cxp.toFixed(0)} ${cyp.toFixed(0)} ${x2} ${y2}`;

  const twists = [];
  for (let i = 1; i < 12; i++) {
    const t = i / 12;
    const u = 1 - t;
    const px = u * u * x1 + 2 * u * t * cxp + t * t * x2;
    const py = u * u * y1 + 2 * u * t * cyp + t * t * y2;
    // Tangent, so each twist sits square across the rope.
    const tx = 2 * u * (cxp - x1) + 2 * t * (x2 - cxp);
    const ty = 2 * u * (cyp - y1) + 2 * t * (y2 - cyp);
    const tl = Math.hypot(tx, ty) || 1;
    const nx = (-ty / tl) * 11;
    const ny = (tx / tl) * 11;
    twists.push(
      `<path d="M ${(px - nx).toFixed(1)} ${(py - ny).toFixed(1)} q ${(nx * 0.55).toFixed(1)} ${(ny * 0.55).toFixed(1)} ${(nx * 2).toFixed(1)} ${(ny * 2).toFixed(1)}" fill="none" stroke="${rope}" stroke-width="6" stroke-linecap="round" stroke-opacity="0.9"/>`
    );
  }

  return `<g>
    <path d="${path}" fill="none" stroke="${rope}" stroke-width="24" stroke-linecap="round"/>
    <path d="${path}" fill="none" stroke="${highlight}" stroke-width="10" stroke-linecap="round" stroke-opacity="0.4"/>
    ${twists.join("")}
  </g>`;
}

function compose(colour, index) {
  const id = `h${index}`;
  const ground = groundFor(colour.mesh);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img">
  <defs>
    <radialGradient id="light-${id}" cx="0.38" cy="0.28" r="0.92">
      <stop offset="0%" stop-color="${shade(ground, 0.12)}"/>
      <stop offset="62%" stop-color="${ground}"/>
      <stop offset="100%" stop-color="${shade(ground, -0.1)}"/>
    </radialGradient>
    <filter id="blur-${id}" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="30"/>
    </filter>
    <filter id="softblur-${id}" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="42"/>
    </filter>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#light-${id})"/>

  ${netSponge(id, 600, 760, 306, colour.mesh)}

  <!-- Drawn after the sponge and sitting outside it, so the cords read as
       handles you could take hold of rather than as something tucked behind. -->
  ${cord(318, 846, 352, 648, -196)}
  ${cord(872, 742, 898, 556, 196)}
</svg>`;
}

// Optional colour names limit what is generated, so this can fill a single
// gap without overwriting colourways that now have real photographs:
//   node scripts/generate-handle-art.mjs white
const only = process.argv.slice(2).map((name) => name.toLowerCase());
const wanted = only.length ? COLOURWAYS.filter((c) => only.includes(c.name)) : COLOURWAYS;

for (const [index, colour] of wanted.entries()) {
  const name = `sponge-handle-${colour.name}.jpg`;
  await sharp(Buffer.from(compose(colour, index)))
    .jpeg({ quality: 90, chromaSubsampling: "4:4:4" })
    .toFile(join(OUT, name));
  console.log(`wrote ${name}`);
}
