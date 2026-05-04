import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import type { Stop } from "@/lib/journey";

export function JourneyStop({ stop, idx }: { stop: Stop; idx: number }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.05, 1, 1.05]);
  const rotate = useTransform(
    scrollYProgress,
    [0, 1],
    [idx % 2 === 0 ? -1.2 : 1.2, idx % 2 === 0 ? 1.2 : -1.2]
  );
  const textY = useTransform(scrollYProgress, [0, 1], ["20%", "-20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0, 1, 1, 0]);

  const flip = idx % 2 === 1;

  return (
    <section
      ref={ref}
      className="relative min-h-[110vh] grid grid-cols-12 gap-4 md:gap-8 px-6 md:px-12 py-32 items-center"
    >
      {/* Image column */}
      <motion.div
        style={{ y, rotate }}
        className={`col-span-12 md:col-span-7 ${flip ? "md:order-2" : ""}`}
      >
        <div className="relative">
          <div className="absolute -top-6 left-0 font-mono text-[10px] tracking-widest text-clay uppercase">
            FIG. {stop.index} — {stop.place}
          </div>
          <motion.div
            style={{ scale }}
            className="relative aspect-[4/5] md:aspect-[3/4] overflow-hidden border border-ink/15 shadow-[0_30px_60px_-30px_rgba(45,45,42,0.35)]"
          >
            <img
              src={stop.image}
              alt={stop.place}
              loading={idx < 2 ? "eager" : "lazy"}
              width={1600}
              height={1024}
              className="w-full h-full object-cover mix-blend-multiply opacity-95"
            />
            <div className="absolute inset-0 paper-grain opacity-30 pointer-events-none" />
          </motion.div>
          <div className="mt-3 flex justify-between font-mono text-[10px] uppercase tracking-widest text-clay">
            <span>Plate {stop.index}</span>
            <span>{stop.coords}</span>
          </div>
        </div>
      </motion.div>

      {/* Text column */}
      <motion.div
        style={{ y: textY, opacity }}
        className={`col-span-12 md:col-span-5 ${flip ? "md:order-1" : ""} space-y-6`}
      >
        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.25em] text-clay">
          <span className="px-2 py-0.5 bg-ink text-vellum">STA. {stop.index}</span>
          <span>{stop.date}</span>
        </div>
        <h2 className="font-serif text-5xl md:text-6xl leading-[0.95] tracking-tighter text-balance">
          {stop.place}
        </h2>
        <div className="font-serif italic text-xl text-clay">
          {stop.role} <span className="text-ink/60">— {stop.org}</span>
        </div>
        <p className="text-base md:text-lg leading-relaxed text-pretty max-w-[44ch]">
          {stop.body}
        </p>
        <div className="flex items-center gap-3 pt-2">
          <div className="h-px w-12 bg-ink/30" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-clay">
            Coord {stop.coords}
          </span>
        </div>
      </motion.div>
    </section>
  );
}
