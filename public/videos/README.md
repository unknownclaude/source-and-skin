# Hero video

`Hero.tsx` looks for `/videos/hero.mp4` and renders it over the poster image
once it can play. Nothing here yet — the poster
(`/public/images/placeholder-hero-poster.jpg`) carries the hero on its own until
a file is dropped in.

Drop in a file named exactly `hero.mp4` and it will be picked up with no code
change. What works:

- 6–10 seconds, seamlessly looping, **no audio track** (the element is muted and
  `playsInline`, which is what lets iOS autoplay it).
- H.264 / AAC-free MP4, 1920×1080, under about 4 MB. Anything heavier delays the
  first paint on mobile.
- Shot subject: water over the net sponge, or a miswak being trimmed — slow,
  close, and legible when 60% of the frame is covered by the headline scrim.

Optionally add `hero.webm` alongside it and a second `<source>` in `Hero.tsx`
for slightly smaller transfers in Firefox and Chrome.

Viewers with `prefers-reduced-motion: reduce` never load the video at all —
they get the poster. Keep the poster genuinely representative for that reason.
