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

### Generated — replaced another brand's photography

These five filenames previously held another seller's product photographs.
`scripts/clean-handle-shots.mjs` existed to remove that seller's printed card
from underneath the product, and the commit that added it (`1cf7424`) said so
in as many words: *"The five handled-sponge photographs had another brand's
printed card lying under the product."* Using the photographs was the
infringement; editing out the mark identifying their owner is the part that
goes to flagrancy under section 115(4).

They now hold drawn art produced by `scripts/generate-handle-art.mjs` — the
same coiled-mesh construction the other placeholders use, tinted per
colourway and given the braided cords this version is named for. Nothing in
them belongs to anybody else.

The originals (`source-photos/handle-shots/`) and the card-removal script have
been deleted from the working tree, along with the photograph that accompanied
the removed testimonial.

**Still to do: they remain in this repository's git history.** Deleting a file
does not remove earlier commits, so if the repository is public the originals
are still reachable. Clearing them needs a history rewrite
(`git filter-repo --path source-photos/handle-shots --invert-paths`) and a
force push, which rewrites every commit hash. Worth doing before the
repository is made public or shared, and not worth doing casually while it
is not.

| File | Status | Used on |
| --- | --- | --- |
| `sponge-handle-black.jpg` | GENERATED | Net Sponge with Handle, bundles |
| `sponge-handle-blue.jpg` | GENERATED | Net Sponge with Handle, bundles |
| `sponge-handle-pink.jpg` | GENERATED | Net Sponge with Handle, bundles |
| `sponge-handle-purple.jpg` | GENERATED | Net Sponge with Handle, bundles |
| `sponge-handle-white.jpg` | GENERATED | Net Sponge with Handle, bundles |

### Unverified — provenance not established

Derived from files in `source-photos/`. Nothing in this repository records who
took them or under what permission. Several are on-model shots of an
identifiable person, which raises a second question beyond copyright: a
photograph of somebody used to sell a product needs that person's agreement,
and using it to imply they endorse the product engages section 18 of the
Australian Consumer Law independently of who owns the file.

Until each line below is resolved to `OWNED` or `LICENSED`, the honest
assumption is that it belongs to someone else.

| File | Used on | Source original |
| --- | --- | --- |
| `editorial-ritual-in-use.jpg` | Home hero | `source-photos/net-sponge-in-use.png` |
| `hero-poster.jpg` | Home hero poster | `source-photos/model-shots/` |
| `lifestyle-counter.jpg` | Editorial band | `source-photos/model-shots/` |
| `miswak-single.jpg` | Miswak — Single | `source-photos/model-shots/15-miswak-original.png` |
| `miswak-3-pack.jpg` | Miswak — 3-Pack | `source-photos/bundle-shots/` |
| `ritual-bundle.jpg` | The Ritual Bundle | `source-photos/model-shots/14-bundle-original.png` |
| `the-season.jpg` | The Season | `source-photos/bundle-shots/16-season-original.png` |
| `the-full-ritual.jpg` | The Full Ritual | `source-photos/bundle-shots/17-full-ritual-original.png` |
| `sponge-white.jpg` | Net Sponge — Regular | `source-photos/model-shots/` |
| `sponge-red.jpg` | Net Sponge — Regular | `source-photos/model-shots/` |
| `sponge-blue.jpg` | Net Sponge — Regular | `source-photos/model-shots/` |
| `sponge-pink.jpg` | Net Sponge — Regular | `source-photos/model-shots/` |
| `sponge-yellow.jpg` | Net Sponge — Regular | `source-photos/model-shots/` |
| `sponge-purple.jpg` | Net Sponge — Regular | `source-photos/model-shots/` |
| `sponge-white-roll.jpg` | Net Sponge — Regular gallery | `source-photos/model-shots/` |

### Removed

| File | Why |
| --- | --- |
| `review-lily.jpg` | Photograph of a person published beside a testimonial that the store could not have received — it had taken no orders. Removed with the review. See `data/reviews.ts`. |

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
