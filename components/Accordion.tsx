"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useId, useState } from "react";

export type AccordionItem = { title: string; content: string };

/**
 * Disclosure list.
 *
 * Native buttons with `aria-expanded` / `aria-controls`, so it is keyboard
 * operable for free. `defaultOpenIndex` opens one panel on first paint —
 * the PDP uses it to surface the description without a click.
 */
export default function Accordion({
  items,
  defaultOpenIndex = null,
}: {
  items: AccordionItem[];
  defaultOpenIndex?: number | null;
}) {
  const baseId = useId();
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex);

  return (
    <div className="divide-y divide-charcoal/12 border-y border-charcoal/12">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const panelId = `${baseId}-panel-${index}`;
        const buttonId = `${baseId}-button-${index}`;

        return (
          <div key={item.title}>
            <h3>
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full items-center justify-between gap-6 py-5 text-left"
              >
                <span className="text-[0.78rem] uppercase tracking-[0.16em]">{item.title}</span>
                <motion.span
                  aria-hidden
                  className="relative block h-3 w-3 shrink-0"
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span className="absolute left-1/2 top-0 h-3 w-px -translate-x-1/2 bg-charcoal" />
                  <span className="absolute left-0 top-1/2 h-px w-3 -translate-y-1/2 bg-charcoal" />
                </motion.span>
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="max-w-editorial pb-6 text-sm leading-relaxed text-charcoal/70">
                    {item.content}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
