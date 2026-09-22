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

### Infringing — another brand's photography, still being served

`scripts/clean-handle-shots.mjs` existed to remove another brand's printed card
from underneath the product in these five frames. The commit that added it
(`1cf7424`) said so in as many words: *"The five handled-sponge photographs had
another brand's printed card lying under the product."* Using the photographs
is the infringement; removing the mark identifying their owner is the part
section 115(4) of the Copyright Act treats as flagrant, and it is why these
are listed separately from the merely unverified ones below.

| File | Used on |
| --- | --- |
| `sponge-handle-black.jpg` | Net Sponge with Handle, bundles |
| `sponge-handle-blue.jpg` | Net Sponge with Handle, bundles |
| `sponge-handle-pink.jpg` | Net Sponge with Handle, bundles |
| `sponge-handle-purple.jpg` | Net Sponge with Handle, bundles |
| `sponge-handle-white.jpg` | Net Sponge with Handle, bundles |

**Current state, and why.** These were replaced with drawn art and then put
back at the owner's direction, who is producing photographs to replace them
properly. This is a sequencing decision, not a disagreement about what the
files are — the site is not live, has no domain and has taken no orders, so
nothing is being shown to a customer while it stands.

It stops being a sequencing decision the moment a domain points at this. The
replacement art still exists and is one command away if the photographs are not
ready in time:

```bash
node scripts/generate-handle-art.mjs
```

That regenerates all five from `scripts/generate-handle-art.mjs`, tinted per
colourway, in the same construction the other placeholder art uses. Nothing in
it belongs to anybody else.

`npm run check:media -- --strict` fails while these are in place, which is the
intended behaviour and the reason to run it before launch.

**Removed alongside them:** the originals (`source-photos/handle-shots/`) and
the card-removal script, neither of which is needed to serve the site and
neither of which has been restored. They remain in git history — see the note
at the end of this file.

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
