"use client";

import type { Colorway } from "@/data/products";

/**
 * Colour swatches for a product.
 *
 * Selecting a colour swaps the gallery image where one exists; colourways
 * without photography yet still render a swatch, because the customer needs to
 * know the colour is stocked either way.
 */
export default function ColorwayPicker({
  colorways,
  selected,
  onSelect,
}: {
  colorways: Colorway[];
  selected: string;
  onSelect: (colorway: Colorway) => void;
}) {
  return (
    <div className="mt-8">
      <p className="eyebrow">
        Colour — <span className="text-charcoal/80">{selected}</span>
      </p>
      <div className="mt-4 flex flex-wrap gap-3" role="radiogroup" aria-label="Choose a colour">
        {colorways.map((colorway) => {
          const isSelected = colorway.name === selected;
          return (
            <button
              key={colorway.name}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onSelect(colorway)}
              title={colorway.name}
              className={`relative h-9 w-9 rounded-full transition-transform duration-300 ease-editorial hover:scale-110 ${
                isSelected ? "ring-1 ring-charcoal ring-offset-4 ring-offset-cream" : ""
              }`}
              style={{ backgroundColor: colorway.swatch }}
            >
              <span className="sr-only">{colorway.name}</span>
              {/* A pale swatch needs an outline or it vanishes on cream. */}
              <span
                aria-hidden
                className="absolute inset-0 rounded-full border border-charcoal/15"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
