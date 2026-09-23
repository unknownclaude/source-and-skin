# Image provenance

Every image this site serves, and where it came from.

This file exists because a storefront's photography is the easiest thing to
take and the most expensive thing to be caught taking. Under the Copyright Act
1968 (Cth) a rights holder can seek damages or an account of profits, and
**section 115(4) allows additional damages where the infringement is flagrant**
— removing a rights holder's identifying mark from an image is close to the
textbook example. There is no safe harbour for this: the US DMCA agent
registration protects a service from liability for *what its users upload*, and
this site has no user uploads. It would do nothing here.

`npm run check:media` cross-references this table against every image
referenced in `data/`, `components/` and `app/`. It fails if the site serves an
image with no record. `npm run check:media -- --strict` also fails on anything
still marked UNVERIFIED or INFRINGING, which is what should be green before the
domain goes live.

## Status meanings

| Status | Means |
| --- | --- |
| `GENERATED` | Produced by a script in this repo from nothing. Ours outright. |
| `OWNED` | Shot or commissioned by the business, with rights to use it commercially. Record who took it and when. |
| `LICENSED` | Someone else's, used under a licence. Record the source and licence terms. |
| `UNVERIFIED` | Nobody has established where it came from. Treat as someone else's until proven otherwise. |
| `INFRINGING` | Known to be someone else's, without permission. Must not be served. |

## The record

### Generated — ours outright

Produced by `scripts/generate-placeholders.mjs` as flat vector compositions.
No photographic source, no third-party rights.

| File | Used on |
| --- | --- |
| `placeholder-about-portrait.jpg` | About |
| `placeholder-lifestyle-bath.jpg` | About |
| `placeholder-sourcing-map.jpg` | Sourcing |
| `placeholder-texture-bark.jpg` | Sourcing |
| `placeholder-texture-fiber.jpg` | Sourcing |

### Replaced — the handled sponge colourways

These five filenames previously held another seller's product photographs,
with that seller's printed card edited out from under the product. The commit
that did it (`1cf7424`) said so in as many words. Using the photographs was the
infringement; removing the mark identifying their owner is the part section
115(4) of the Copyright Act treats as flagrant.

All five are now the owner's own photography, supplied 23 September 2026.
Nothing another party owns is served from this site any more.

| File | Status | Source |
| --- | --- | --- |
| `sponge-handle-black.jpg` | OWNED | `source-photos/handled-sponge-colourways/black.png` |
| `sponge-handle-blue.jpg` | OWNED | `source-photos/handled-sponge-colourways/blue.png` |
| `sponge-handle-pink.jpg` | OWNED | `source-photos/handled-sponge-colourways/pink.png` |
| `sponge-handle-purple.jpg` | OWNED | `source-photos/handled-sponge-colourways/purple.png` |
| `sponge-handle-white.jpg` | OWNED | `source-photos/handled-sponge-colourways/white.png` |

The white frame arrived last and closed the one gap, so the drawn stand-in is
no longer served. `scripts/generate-handle-art.mjs` stays in the tree: it
regenerates any colourway in one command if a photograph ever has to come down
in a hurry.

The originals of the replaced photographs and the card-removal script were
deleted earlier. They remain in git history — see the note at the end.

### Owned — the net sponge colourway shoot

Six on-model frames, one per colourway, supplied by the owner on 23 September
2026 with the statement that they are original. Recorded on that basis.

Two details worth having on the record rather than in someone's memory: they
arrived as screen captures (`Screenshot 2026-09-23 …`) rather than camera
files, and they are small — 355 to 887 pixels wide against the 1200×1500 the
layout wants, so every one is upscaled between 2.6× and 2.8×. Camera originals
would be sharper, and `node scripts/import-sponge-shots.mjs` re-runs the whole
import in one command if they turn up.

They are on-model, which carries a question beyond copyright: a photograph of
an identifiable person used to sell something needs that person's agreement,
and using it in a way that implies they endorse the product engages section 18
of the Australian Consumer Law separately from who owns the file.

| File | Used on |
| --- | --- |
| `sponge-white.jpg` | Net Sponge — Regular (White), gallery, Ritual Bundle gallery |
| `sponge-red.jpg` | Net Sponge — Regular (Red), lead image, bundle galleries |
| `sponge-blue.jpg` | Net Sponge — Regular (Blue), gallery |
| `sponge-pink.jpg` | Net Sponge — Regular (Pink), hover image |
| `sponge-yellow.jpg` | Net Sponge — Regular (Yellow), gallery |
| `sponge-purple.jpg` | Net Sponge — Regular (Purple) |

Originals: `source-photos/net-sponge-colourways/`.

### Owned — the handled sponge and miswak shoots

Supplied by the owner on 23 September 2026 with the statement that they are
original. Recorded on that basis, with the same two caveats as the set above:
they arrived as screen captures rather than camera files, and they are small.
The handled sponge frames are 394–412px wide and upscale 3.6× to 3.7×, which
is the softest anything on this site runs at.

| File | Used on |
| --- | --- |
| `miswak-3-pack.jpg` | Miswak Stick — 3-Pack |
| `miswak-single.jpg` | Miswak Stick — Single, bundle galleries |
| `ritual-bundle.jpg` | The Ritual Bundle |
| `the-season.jpg` | The Season |
| `the-full-ritual.jpg` | The Full Ritual |

The single miswak and the three bundle shots were confirmed as original by the
owner on 23 September 2026, and moved here from Unverified on that basis.

The four handled sponge frames are listed under "Replaced" above, because what
they replaced is the part worth keeping a record of.

### Unverified — provenance not established

Three left. Nothing in this repository records who took them or under what
permission, and the owner has not yet said. Until a line is resolved to
`OWNED` or `LICENSED`, the honest assumption is that it belongs to someone
else.

`editorial-ritual-in-use.jpg` is the odd one out of everything on this site: a
different model, and a pink-to-white ombre sponge that is not one of the six
colourways sold. Whatever it is, it is not a photograph of a product in the
catalogue, which is its own problem — a hero image should show what is for
sale.

`hero-poster.jpg` and `lifestyle-counter.jpg` are two crops of the same
still life, a rolled white sponge beside a miswak stick on pale marble.

| File | Used on | Source original |
| --- | --- | --- |
| `editorial-ritual-in-use.jpg` | Home hero | `source-photos/net-sponge-in-use.png` |
| `hero-poster.jpg` | Home hero poster | `source-photos/model-shots/` |
| `lifestyle-counter.jpg` | Editorial band | `source-photos/model-shots/` |

### Removed

| File | Why |
| --- | --- |
| `review-lily.jpg` | Photograph of a person published beside a testimonial that the store could not have received — it had taken no orders. Removed with the review. See `data/reviews.ts`. |
| `sponge-white-roll.jpg` | Unverified, and made redundant by the new white frame from the owner's own shoot. Dropped from both galleries that used it rather than carried forward. |

## Resolving a line

For each file still marked UNVERIFIED, one of these is true, and you are the
only person who knows which:

1. **You took it, or paid someone to take it.** Change the status to `OWNED`
   and record who and when. If you paid a photographer, check the invoice
   actually assigns copyright — commissioning a photograph does not
   automatically transfer it under section 35 of the Copyright Act.
2. **You licensed it.** Change to `LICENSED`, record the source and whether
   the licence covers commercial use. A supplier saying "use our photos" is a
   licence worth getting in writing.
3. **It came from a marketplace listing, a search result, or a supplier you
   have no agreement with.** It is someone else's. Replace it.

Replacing is not as bad as it sounds: the products are small, the palette is
two colours and a window, and `scripts/process-photo.mjs` grades a phone
photograph into the site's palette. A plain sponge on a plain ground is the
shot the site actually wants.
