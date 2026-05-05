import { useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useReducedMotion,
  type MotionValue,
} from "motion/react";
import type { Stop } from "@/lib/journey";

function useSmooth(value: MotionValue<number>, reduce: boolean) {
  return useSpring(value, reduce ? { duration: 0 } : { stiffness: 90, damping: 28, mass: 0.7 });
}

/**
 * 3D camera-style scroll stage.
 * - Sticky viewport keeps the "scene" pinned while scroll drives the camera dolly (z), pan (y), and tilt (rotateX/Y).
 * - Three depth planes (background plate, midground photo, foreground caption) move at different rates for true parallax depth.
 * - Mouse parallax adds a subtle live "camera" wobble on hover.
 * - Fully no-ops under prefers-reduced-motion.
 */
export function JourneyStop({ stop, idx }: { stop: Stop; idx: number }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion() ?? false;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const p = useSmooth(scrollYProgress, reduce);

  // --- Camera dolly (the whole scene) ---
  const camZ = useTransform(p, [0, 0.5, 1], reduce ? [0, 0, 0] : [-600, 0, -400]);
  const camRotX = useTransform(p, [0, 0.5, 1], reduce ? [0, 0, 0] : [12, 0, -10]);
  const camRotY = useTransform(p, [0, 0.5, 1], reduce ? [0, 0, 0] : [idx % 2 === 0 ? -10 : 10, 0, idx % 2 === 0 ? 8 : -8]);
  const sceneOpacity = useTransform(p, [0, 0.18, 0.82, 1], reduce ? [1, 1, 1, 1] : [0, 1, 1, 0]);

  // --- Parallax planes ---
  // Background plate (slowest, deepest)
  const bgY = useTransform(p, [0, 1], reduce ? ["0%", "0%"] : ["-15%", "15%"]);
  const bgScale = useTransform(p, [0, 0.5, 1], reduce ? [1, 1, 1] : [1.25, 1.15, 1.25]);
  // Midground photo
  const midY = useTransform(p, [0, 1], reduce ? ["0%", "0%"] : ["20%", "-20%"]);
  const midRot = useTransform(p, [0, 1], reduce ? [0, 0] : [idx % 2 === 0 ? -2.5 : 2.5, idx % 2 === 0 ? 2.5 : -2.5]);
  // Foreground caption (fastest)
  const fgY = useTransform(p, [0, 1], reduce ? ["0%", "0%"] : ["50%", "-50%"]);
  const fgOpacity = useTransform(p, [0, 0.25, 0.75, 1], reduce ? [1, 1, 1, 1] : [0, 1, 1, 0]);

  // Big serif label (background type, biggest parallax)
  const labelY = useTransform(p, [0, 1], reduce ? ["0%", "0%"] : ["80%", "-80%"]);
  const labelOpacity = useTransform(p, [0, 0.3, 0.7, 1], reduce ? [0.08, 0.08, 0.08, 0.08] : [0, 0.08, 0.08, 0]);

  // --- Mouse parallax (subtle live camera) ---
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 60, damping: 20, mass: 0.5 });
  const smy = useSpring(my, { stiffness: 60, damping: 20, mass: 0.5 });
  const mouseRotY = useTransform(smx, [-0.5, 0.5], reduce ? [0, 0] : [-4, 4]);
  const mouseRotX = useTransform(smy, [-0.5, 0.5], reduce ? [0, 0] : [3, -3]);

  useEffect(() => {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      mx.set((e.clientX - r.left) / r.width - 0.5);
      my.set((e.clientY - r.top) / r.height - 0.5);
    };
    const onLeave = () => { mx.set(0); my.set(0); };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [mx, my, reduce]);

  // Combine camera + mouse rotations (hooks must be unconditional)
  const totalRotX = useTransform<number, number>(
    [camRotX, mouseRotX],
    ([a, b]) => (reduce ? 0 : a + b)
  );
  const totalRotY = useTransform<number, number>(
    [camRotY, mouseRotY],
    ([a, b]) => (reduce ? 0 : a + b)
  );

  const flip = idx % 2 === 1;

  return (
    <section
      ref={ref}
      className="relative h-[220vh]"
      aria-label={`Station ${stop.index} — ${stop.place}`}
    >
      {/* Sticky 3D stage */}
      <div
        className="sticky top-0 h-screen w-full overflow-hidden flex items-center"
        style={{ perspective: reduce ? undefined : 1600, perspectiveOrigin: "50% 50%" }}
      >
        {/* Camera (whole scene) */}
        <motion.div
          style={{
            opacity: sceneOpacity,
            rotateX: totalRotX,
            rotateY: totalRotY,
            z: camZ,
            transformStyle: reduce ? undefined : "preserve-3d",
            willChange: reduce ? undefined : "transform, opacity",
          }}
          className="relative w-full h-full grid grid-cols-12 gap-4 md:gap-8 px-6 md:px-12 items-center"
        >
          {/* Plane 1 — background giant serif label */}
          <motion.div
            style={{ y: labelY, opacity: labelOpacity, z: reduce ? 0 : -300 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
          >
            <div className="font-serif italic text-[28vw] leading-none text-ink whitespace-nowrap">
              {stop.place.split(",")[0]}
            </div>
          </motion.div>

          {/* Plane 2 — background coordinate plate */}
          <motion.div
            style={{ y: bgY, scale: bgScale, z: reduce ? 0 : -180 }}
            className={`hidden md:block absolute ${flip ? "right-12" : "left-12"} top-12 w-[28%] aspect-square border border-ink/20 paper-grain opacity-50 pointer-events-none`}
          >
            <div className="absolute top-2 left-2 font-mono text-[9px] uppercase tracking-widest text-clay">
              Plate {stop.index} · ref
            </div>
            <div className="absolute bottom-2 right-2 font-mono text-[9px] uppercase tracking-widest text-clay">
              {stop.coords}
            </div>
          </motion.div>

          {/* Plane 3 — midground photo */}
          <motion.div
            style={{
              y: midY,
              rotateZ: midRot,
              z: reduce ? 0 : 60,
              transformStyle: reduce ? undefined : "preserve-3d",
            }}
            className={`col-span-12 md:col-span-7 ${flip ? "md:col-start-6" : "md:col-start-1"} relative z-10`}
          >
            <div className="absolute -top-6 left-0 font-mono text-[10px] tracking-widest text-clay uppercase">
              FIG. {stop.index} — {stop.place}
            </div>
            <div className="relative aspect-[4/5] md:aspect-[3/4] overflow-hidden border border-ink/15 shadow-[0_40px_80px_-30px_rgba(45,45,42,0.55)]">
              <img
                src={stop.image}
                alt={stop.place}
                loading={idx < 2 ? "eager" : "lazy"}
                width={1600}
                height={1024}
                className="w-full h-full object-cover mix-blend-multiply opacity-95"
              />
              <div className="absolute inset-0 paper-grain opacity-30 pointer-events-none" />
            </div>
            <div className="mt-3 flex justify-between font-mono text-[10px] uppercase tracking-widest text-clay">
              <span>Plate {stop.index}</span>
              <span>{stop.coords}</span>
            </div>
          </motion.div>

          {/* Plane 4 — foreground caption */}
          <motion.div
            style={{ y: fgY, opacity: fgOpacity, z: reduce ? 0 : 180 }}
            className={`col-span-12 md:col-span-5 ${flip ? "md:col-start-1 md:row-start-1" : "md:col-start-8"} space-y-5 relative z-20`}
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
        </motion.div>
      </div>
    </section>
  );
}
