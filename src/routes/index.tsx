import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { SiteNav, SiteFooter } from "@/components/SiteNav";
import { JourneyStop } from "@/components/JourneyStop";
import { HeroTopo } from "@/components/HeroTopo";
import { JourneyMap } from "@/components/JourneyMap";
import { Pursuits } from "@/components/Pursuits";
import { Magnetic } from "@/components/Magnetic";
import { STOPS, PROJECTS } from "@/lib/journey";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Henry Adams — Survey of a Career in Motion" },
      { name: "description", content: "A scroll-driven portfolio mapping Henry Adams' journey from the Colorado Front Range to Sydney and back. Economics, engineering management, and clean energy strategy." },
      { property: "og:title", content: "Henry Adams — Survey of a Career in Motion" },
      { property: "og:description", content: "A scroll-driven portfolio mapping Henry Adams' journey from the Colorado Front Range to Sydney and back." },
    ],
  }),
});

function Index() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroFade = useTransform(scrollYProgress, [0, 1], [1, 0]);

  const journeyRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: journeyProgress } = useScroll({ target: journeyRef });
  const railHeight = useTransform(journeyProgress, [0, 1], ["0%", "100%"]);

  return (
    <div className="min-h-screen bg-vellum text-ink relative">
      <SiteNav />

      {/* Persistent survey grid */}
      <div className="fixed inset-0 survey-grid opacity-40 pointer-events-none z-0" />

      {/* Hero */}
      <motion.section
        ref={heroRef}
        style={{ opacity: heroFade }}
        className="relative pt-32 md:pt-40 pb-20 px-6 md:px-12 z-10 overflow-hidden"
      >
        <HeroTopo />
        <div className="max-w-screen-2xl mx-auto relative">
          <div className="flex justify-between items-end mb-12 font-mono text-[10px] uppercase tracking-widest text-clay">
            <div>Station: Primary_Relief</div>
            <div className="text-right">
              Lat 39.8028° N<br />
              Long 105.0875° W<br />
              Elev 1,675 m
            </div>
          </div>
          <motion.div style={{ y: heroY }}>
            <div className="inline-block px-2 py-0.5 bg-ink text-vellum font-mono text-[10px] tracking-[0.25em] uppercase mb-8">
              Portfolio · MMXXVI
            </div>
            <h1 className="font-serif text-6xl sm:text-7xl md:text-[10rem] leading-[0.88] tracking-tighter text-balance">
              Surveying the <span className="italic text-clay">intersection</span> of finance, mountains & built systems.
            </h1>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl">
              <div className="space-y-2">
                <div className="font-mono text-[10px] uppercase tracking-widest text-clay">Subject</div>
                <div className="font-serif text-lg">Henry Adams — Economics graduate, incoming M.Eng. (CU Boulder · Lockheed Martin Program).</div>
              </div>
              <div className="space-y-2">
                <div className="font-mono text-[10px] uppercase tracking-widest text-clay">Method</div>
                <div className="font-serif text-lg">A topographic record of eight stations across two continents — built from work, weather, and altitude.</div>
              </div>
              <div className="space-y-2">
                <div className="font-mono text-[10px] uppercase tracking-widest text-clay">Instructions</div>
                <div className="font-serif text-lg italic">Scroll to descend through the survey. Each station marks a real place and a real chapter.</div>
              </div>
            </div>
          </motion.div>

          <div className="mt-24 flex items-end justify-between">
            <div className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-widest text-clay">
              <span className="size-2 rounded-full bg-rust animate-pulse" />
              Active survey · live link
            </div>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="flex flex-col items-end gap-2"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-clay">Descend</span>
              <div className="w-px h-16 bg-gradient-to-b from-ink/40 to-transparent" />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Journey rail */}
      <div ref={journeyRef} className="relative z-10">
        {/* Vertical progress rail */}
        <div className="hidden md:block fixed left-6 top-1/2 -translate-y-1/2 z-30 h-[60vh] pointer-events-none">
          <div className="relative w-px h-full bg-ink/15">
            <motion.div style={{ height: railHeight }} className="absolute top-0 left-0 w-px bg-rust" />
          </div>
          <div className="absolute -left-1 -top-2 size-3 border border-rust bg-vellum rounded-full" />
        </div>

        {STOPS.map((stop, i) => (
          <JourneyStop key={stop.id} stop={stop} idx={i} />
        ))}
      </div>

      {/* Archive preview */}
      <section className="relative z-10 px-6 md:px-12 py-32 border-t border-ink/10">
        <div className="max-w-screen-2xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-clay mb-3">Sub-survey 02</div>
              <h2 className="font-serif text-5xl md:text-7xl tracking-tighter">The Archive</h2>
            </div>
            <Link to="/projects" className="font-mono text-xs uppercase tracking-widest border border-ink rounded-full px-5 py-2 hover:bg-ink hover:text-vellum transition-all">
              All eight ↗
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROJECTS.slice(0, 4).map((p) => (
              <Link
                key={p.slug}
                to="/projects/$slug"
                params={{ slug: p.slug }}
                className="group block border border-ink/15 p-5 hover:bg-vellum-deep transition-colors"
              >
                <div className="font-mono text-[10px] uppercase tracking-widest text-clay mb-4">
                  Case {p.index} · {p.status}
                </div>
                <div className="font-serif text-xl leading-tight mb-3 group-hover:text-rust transition-colors">{p.title}</div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-clay">{p.category}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
