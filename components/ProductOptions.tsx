"use client";

import {
  getLiveOptions,
  pruneSelection,
  type OptionSelection,
  type Product,
  type ProductOptionValue,
} from "@/data/products";
import { formatPrice } from "@/lib/format";

/**
 * The choices a customer has to make before a product can go in the bag.
 *
 * Nothing is pre-selected. A default colour looks helpful and is not: the
 * customer never actively chose it, so roughly the rate at which people skim
 * past a control is the rate at which the wrong sponge gets packed. An
 * unanswered question is visible; a wrong answer is not.
 *
 * Values with a hex render as a swatch, values without render as a labelled
 * pill. Both are real radio groups — `role="radiogroup"` with `aria-checked`
 * on each child — so a screen reader announces the group name, the number of
 * choices, and which one is live, and arrow keys behave the way a radio group
 * is expected to behave.
 */
export default function ProductOptions({
  product,
  selection,
  onChange,
  /** Options still unanswered after a blocked submit, highlighted in place. */
  highlight = [],
}: {
  product: Product;
  selection: OptionSelection;
  onChange: (next: OptionSelection) => void;
  highlight?: string[];
}) {
  const live = getLiveOptions(product, selection);
  if (!live.length) return null;

  function choose(optionId: string, value: ProductOptionValue) {
    // Prune after applying, so changing a parent option drops any child
    // selection that is no longer offered rather than carrying it silently.
    onChange(pruneSelection(product, { ...selection, [optionId]: value.value }));
  }

  return (
    <div className="mt-10 space-y-8">
      {live.map((option) => {
        const chosen = selection[option.id];
        const needsAnswer = highlight.includes(option.id);
        const labelId = `option-${option.id}-label`;

        return (
          <fieldset key={option.id} className="border-0 p-0">
            <legend id={labelId} className="eyebrow">
              {option.label}
              {chosen ? (
                <span className="text-charcoal/80"> — {chosen}</span>
              ) : (
                <span className={needsAnswer ? "text-clay" : "text-charcoal/40"}> — choose one</span>
              )}
            </legend>

            {option.help && (
              <p className="mt-2 max-w-sm text-[0.82rem] leading-relaxed text-charcoal/55">
                {option.help}
              </p>
            )}

            <div
              role="radiogroup"
              aria-labelledby={labelId}
              className={`mt-4 flex flex-wrap items-center gap-3 ${
                needsAnswer ? "rounded-lg outline outline-1 outline-offset-8 outline-clay/60" : ""
              }`}
            >
              {option.values.map((value) => {
                const isChosen = value.value === chosen;
                const delta = value.priceDelta ?? 0;

                // A swatch is a colour dot; anything else is a worded pill,
                // because "With handles" cannot be communicated by a colour.
                if (value.swatch) {
                  return (
                    <button
                      key={value.value}
                      type="button"
                      role="radio"
                      aria-checked={isChosen}
                      onClick={() => choose(option.id, value)}
                      title={value.value}
                      className={`relative h-9 w-9 rounded-full transition-transform duration-300 ease-editorial hover:scale-110 ${
                        isChosen ? "ring-1 ring-charcoal ring-offset-4 ring-offset-cream" : ""
                      }`}
                      style={{ backgroundColor: value.swatch }}
                    >
                      <span className="sr-only">
                        {value.value}
                        {delta ? `, plus ${formatPrice(delta)}` : ""}
                      </span>
                      {/* A pale swatch needs an outline or it vanishes on cream. */}
                      <span
                        aria-hidden
                        className="absolute inset-0 rounded-full border border-charcoal/15"
                      />
                    </button>
                  );
                }

                return (
                  <button
                    key={value.value}
                    type="button"
                    role="radio"
                    aria-checked={isChosen}
                    onClick={() => choose(option.id, value)}
                    className={`rounded-full border px-5 py-2.5 text-[0.72rem] uppercase tracking-[0.14em] transition-colors duration-300 ${
                      isChosen
                        ? "border-charcoal bg-charcoal text-cream"
                        : "border-charcoal/25 text-charcoal/70 hover:border-charcoal/60"
                    }`}
                  >
                    {value.value}
                    {delta > 0 && (
                      <span className={isChosen ? "text-cream/70" : "text-charcoal/45"}>
                        {" "}
                        +{formatPrice(delta)}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </fieldset>
        );
      })}
    </div>
  );
}
