import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

type Pursuit = {
  category: "Ride" | "Run" | "Build" | "Read" | "Climb";
  title: string;
  meta: string;
  /** aspect: tall / wide / square */
  aspect: "tall" | "wide" | "square";
};

const PURSUITS: Pursuit[] = [
  { category: "Ride", title: "Bear Creek loop", meta: "32 mi · 2,400 ft", aspect: "tall" },
  { category: "Run", title: "Sunrise on South Table", meta: "6 mi · golden hour", aspect: "square" },
  { category: "Build", title: "Phase-gate template v3", meta: "ops toolkit", aspect: "wide" },
  { category: "Read", title: "How Big Things Get Done", meta: "Flyvbjerg · 2023", aspect: "tall" },
  { category: "Climb", title: "Eldorado dawn lap", meta: "5.10a · trad", aspect: "square" },
  { category: "Ride", title: "Lookout Mountain ascent", meta: "rolling, dry", aspect: "wide" },
  { category: "Build", title: "Salesforce pipeline rebuild", meta: "+30% engagement", aspect: "square" },
  { category: "Run", title: "Marshall Mesa intervals", meta: "track work", aspect: "tall" },
  { category: "Read", title: "The Prize", meta: "Yergin · oil & power", aspect: "wide" },
  { category: "Climb", title: "Boulder Canyon multipitch", meta: "alpine start", aspect: "tall" },
];

const FILTERS = ["All", "Ride", "Run", "Build", "Read", "Climb"] as const;

export function Pursuits() {
  const [active, setActive] = useState<(typeof FILTERS)[number]>("All");
  const items = active === "All" ? PURSUITS : PURSUITS.filter((p) => p.category === active);

  return (
    <section className="relative z-10 px-6 md:px-12 py-32 border-t border-ink/10">
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-10">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-clay mb-3">Sub-survey 04</div>
            <h2 className="font-serif text-5xl md:text-7xl tracking-tighter">Pursuits</h2>
            <p className="mt-4 font-serif italic text-clay max-w-md">
              The other half of the survey — what fills the hours between stations.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setActive(f)}
                data-cursor="hover"
                className={`px-4 py-1.5 rounded-full font-mono text-[10px] uppercase tracking-widest border transition-all ${
                  active === f
                    ? "bg-ink text-vellum border-ink"
                    : "border-ink/30 text-clay hover:text-ink hover:border-ink"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 [grid-auto-flow:dense]">
          <AnimatePresence mode="popLayout">
            {items.map((p, i) => {
              const cls =
                p.aspect === "tall"
                  ? "row-span-2 aspect-[3/5]"
                  : p.aspect === "wide"
                    ? "col-span-2 aspect-[16/9]"
                    : "aspect-square";
              return (
                <motion.div
                  key={`${p.category}-${p.title}`}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35, delay: i * 0.03 }}
                  className={`relative ${cls} border border-ink/15 bg-vellum-deep paper-grain overflow-hidden group`}
                >
                  {/* placeholder: replaced with real image later */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="font-serif italic text-3xl md:text-5xl text-ink/15 select-none">
                      {p.category}
                    </div>
                  </div>
                  <div className="absolute top-3 left-3 font-mono text-[9px] uppercase tracking-widest text-clay">
                    {p.category} · {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-vellum to-transparent">
                    <div className="font-serif text-base leading-tight text-ink">{p.title}</div>
                    <div className="font-mono text-[9px] uppercase tracking-widest text-clay mt-1">
                      {p.meta}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <div className="mt-6 font-mono text-[10px] uppercase tracking-widest text-clay">
          Image plates pending — placeholders shown.
        </div>
      </div>
    </section>
  );
}
