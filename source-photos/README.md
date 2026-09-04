# Original photography

Unprocessed originals, kept so any shot can be re-graded without going back to
the photographer. Nothing in here is served to the browser — the web-ready
derivatives live in `public/images/`.

| File                      | Used for                                     |
| ------------------------- | -------------------------------------------- |
| `net-sponge-in-use.png`   | `public/images/editorial-ritual-in-use.jpg`  |

Regenerate that derivative with:

```bash
node scripts/process-photo.mjs source-photos/net-sponge-in-use.png \
  --out editorial-ritual-in-use --preset portrait \
  --bg cream --mattelow 234 --mattehigh 253 \
  --sat 0.74 --warm 0.45 --veil 0.05 --fade 0.22 --quality 94
```

`--sat` is the dial to reach for if the pink reads too hot: 0.74 keeps it a
confident rose, 0.6 pulls it toward the clay end of the palette.
