#!/usr/bin/env node
/**
 * Every image the site serves must be accounted for in MEDIA.md.
 *
 * Two failure modes, deliberately separated:
 *
 *   - **An unrecorded image.** Something was added to the site without anybody
 *     writing down where it came from. Always fails — this is the drift that
 *     lets an unlicensed file arrive unnoticed.
 *   - **An unresolved image.** Recorded, but still UNVERIFIED or INFRINGING.
 *     Fails only under `--strict`, which is the gate to run before pointing a
 *     domain at this. Failing by default would mean a check that is red every
 *     day, and a check that is always red is a check nobody reads.
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const STRICT = process.argv.includes("--strict");
const SOURCE_DIRS = ["data", "components", "app"];

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (/\.(tsx?|mdx?)$/.test(entry)) out.push(full);
  }
  return out;
}

// What the site actually asks a browser for.
const referenced = new Set();
for (const dir of SOURCE_DIRS) {
  for (const file of walk(join(ROOT, dir))) {
    const text = readFileSync(file, "utf8");
    for (const match of text.matchAll(/\/images\/([a-z0-9._-]+\.(?:jpg|jpeg|png|webp|avif))/gi)) {
      referenced.add(match[1]);
    }
  }
}

// What MEDIA.md accounts for, and under what status.
//
// A row may state its own status in a column, which wins — a section can hold
// a mix, as the handled sponge one does now that four of its five are the
// owner's photographs and the fifth is drawn. Otherwise the status comes from
// the section heading.
const STATUSES = ["AI-GENERATED", "GENERATED", "OWNED", "LICENSED", "UNVERIFIED", "INFRINGING"];
const media = readFileSync(join(ROOT, "MEDIA.md"), "utf8");
const recorded = new Map();
let heading = null;
for (const line of media.split("\n")) {
  const section = /^###\s+([\w-]+)/.exec(line);
  if (section) heading = section[1].toUpperCase();
  const explicit = STATUSES.find((s) => new RegExp(`\\|\\s*${s}\\s*\\|`).test(line));
  for (const match of line.matchAll(/`([a-z0-9._-]+\.(?:jpg|jpeg|png|webp|avif))`/gi)) {
    // A file named more than once keeps the first mention, which is the
    // strongest claim made about it.
    if (!recorded.has(match[1])) recorded.set(match[1], explicit ?? heading);
  }
}

const unrecorded = [...referenced].filter((file) => !recorded.has(file)).sort();
const unresolved = [...referenced]
  .filter((file) => ["UNVERIFIED", "INFRINGING"].includes(recorded.get(file)))
  .sort();

console.log(`${referenced.size} images referenced by the site.`);

const byStatus = {};
for (const file of referenced) {
  const s = recorded.get(file) ?? "UNRECORDED";
  byStatus[s] = (byStatus[s] ?? 0) + 1;
}
for (const [s, count] of Object.entries(byStatus).sort()) console.log(`  ${s}: ${count}`);

if (unrecorded.length) {
  console.error(`\nNot recorded in MEDIA.md — add them before this can pass:`);
  for (const file of unrecorded) console.error(`  ${file}`);
  process.exit(1);
}

if (unresolved.length) {
  const message = `\n${unresolved.length} image(s) are still served without established rights:`;
  if (STRICT) {
    console.error(message);
    for (const file of unresolved) console.error(`  ${file} (${recorded.get(file)})`);
    console.error("\nResolve each one in MEDIA.md, or stop serving it.");
    process.exit(1);
  }
  console.warn(message);
  for (const file of unresolved) console.warn(`  ${file} (${recorded.get(file)})`);
  console.warn("\nRun with --strict to make this a failure. See MEDIA.md.");
}

console.log("\nEvery image the site serves is accounted for.");
