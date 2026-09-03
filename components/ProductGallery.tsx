"use client";

import Image from "next/image";
import { useRef, useState } from "react";

type ProductGalleryProps = {
  images: string[];
  productName: string;
  accentColor: string;
};

/**
 * Main image plus thumbnail strip, with pointer-tracked zoom on the main shot.
 *
 * Zoom is a pointer affordance only — it is skipped on touch (no hover) and it
 * carries no information, so nothing is lost without it. Thumbnails are real
 * buttons in a tablist so the gallery is fully keyboard operable.
 */
export default function ProductGallery({ images, productName, accentColor }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zooming, setZooming] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });
  const frameRef = useRef<HTMLDivElement>(null);

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") return;
    const bounds = frameRef.current?.getBoundingClientRect();
    if (!bounds) return;
    setOrigin({
      x: ((event.clientX - bounds.left) / bounds.width) * 100,
      y: ((event.clientY - bounds.top) / bounds.height) * 100,
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div
        ref={frameRef}
        className="relative aspect-[4/5] w-full overflow-hidden"
        style={{ backgroundColor: accentColor }}
        onPointerEnter={(event) => event.pointerType === "mouse" && setZooming(true)}
        onPointerLeave={() => setZooming(false)}
        onPointerMove={onPointerMove}
      >
        <Image
          key={images[activeIndex]}
          src={images[activeIndex]}
          alt={`${productName} — view ${activeIndex + 1} of ${images.length}`}
          fill
          priority
          sizes="(min-width: 1024px) 52vw, 92vw"
          className="object-cover transition-transform duration-700 ease-editorial"
          style={{
            transform: zooming ? "scale(1.7)" : "scale(1)",
            transformOrigin: `${origin.x}% ${origin.y}%`,
          }}
        />
      </div>

      <div role="tablist" aria-label={`${productName} images`} className="grid grid-cols-4 gap-3">
        {images.map((image, index) => (
          <button
            key={image + index}
            type="button"
            role="tab"
            aria-selected={index === activeIndex}
            aria-label={`Show view ${index + 1}`}
            onClick={() => setActiveIndex(index)}
            className={`relative aspect-square overflow-hidden transition-opacity duration-300 ${
              index === activeIndex ? "opacity-100 ring-1 ring-charcoal" : "opacity-60 hover:opacity-90"
            }`}
            style={{ backgroundColor: accentColor }}
          >
            <Image
              src={image}
              alt=""
              aria-hidden
              fill
              sizes="120px"
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
