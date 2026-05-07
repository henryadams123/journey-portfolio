import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { STOPS, type Stop } from "@/lib/journey";

function Station({ stop, i, activeIdx }: { stop: Stop; i: number; activeIdx: MotionValue<number> }) {
  const p = POS[stop.id];
  const opacity = useTransform(activeIdx, (v) => (v >= i - 0.4 ? 1 : 0.25));
  const scale = useTransform(activeIdx, (v) => (Math.abs(v - i) < 0.6 ? 1.4 : 1));
  if (!p) return null;
  return (
    <g>
      <motion.circle cx={p.x} cy={p.y} r={3} fill="var(--rust)" style={{ opacity, scale, transformOrigin: `${p.x}px ${p.y}px` }} />
      <circle cx={p.x} cy={p.y} r={6} fill="none" stroke="var(--rust)" strokeOpacity="0.3" strokeWidth="0.5" />
      <text
        x={p.x + 10}
        y={p.y + 3}
        className="fill-current text-ink"
        style={{ font: "8px 'IBM Plex Mono', monospace", letterSpacing: "0.1em" }}
      >
        {stop.index} · {stop.place.split(",")[0].toUpperCase()}
      </text>
    </g>
  );
}

/**
 * Interactive topographic SVG map. Stylized — Colorado Front Range ↔ Sydney ↔ back.
 * The route line draws as the section scrolls; stations brighten when the page reaches them.
 */

// Hand-placed positions in a 1000x500 viewBox (stylized, not geographic).
const POS: Record<string, { x: number; y: number }> = {
  arvada: { x: 290, y: 215 },
  "central-park": { x: 305, y: 230 },
  copper: { x: 250, y: 245 },
  eugene: { x: 200, y: 195 },
  "turning-point": { x: 175, y: 215 },
  sydney: { x: 820, y: 380 },
  golden: { x: 285, y: 220 },
  boulder: { x: 295, y: 200 },
};

function pathFromStops() {
  const pts = STOPS.map((s) => POS[s.id]).filter(Boolean) as { x: number; y: number }[];
  if (pts.length === 0) return "";
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1];
    const b = pts[i];
    const mx = (a.x + b.x) / 2;
    const my = (a.y + b.y) / 2 - 30;
    d += ` Q ${mx} ${my} ${b.x} ${b.y}`;
  }
  return d;
}

export function JourneyMap() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const drawn = useTransform(scrollYProgress, [0.1, 0.85], [0, 1]);
  const dashOffset = useTransform(drawn, (v) => 1 - v);
  const path = pathFromStops();
  const activeIdx = useTransform(scrollYProgress, [0.1, 0.85], [0, STOPS.length - 1]);

  return (
    <section ref={ref} className="relative z-10 px-6 md:px-12 py-32 border-t border-ink/10">
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex justify-between items-end mb-10">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-clay mb-3">Sub-survey 03</div>
            <h2 className="font-serif text-5xl md:text-7xl tracking-tighter">The Map</h2>
            <p className="mt-4 font-serif italic text-clay max-w-md">
              Eight stations across two continents, plotted on a single sheet.
            </p>
          </div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-clay text-right hidden md:block">
            Scale 1:∞<br />Projection — Personal
          </div>
        </div>

        <div className="relative border border-ink/15 bg-vellum-deep/40 paper-grain rounded-sm overflow-hidden">
          <svg viewBox="0 0 1000 500" className="w-full h-auto block">
            {/* graticule */}
            <defs>
              <pattern id="grat" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeOpacity="0.08" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="1000" height="500" fill="url(#grat)" className="text-ink" />

            {/* stylized continents */}
            <g className="text-ink" fill="none" stroke="currentColor" strokeOpacity="0.25" strokeWidth="0.8">
              {/* North America silhouette */}
              <path d="M 80 120 Q 200 90 340 130 Q 420 160 410 240 Q 380 320 300 340 Q 200 350 140 300 Q 90 250 80 120 Z" />
              {/* Australia silhouette */}
              <path d="M 720 330 Q 800 310 880 340 Q 920 380 880 420 Q 800 440 740 420 Q 700 390 720 330 Z" />
            </g>

            {/* equator / tropic dashed */}
            <line x1="0" y1="290" x2="1000" y2="290" stroke="currentColor" strokeOpacity="0.15" strokeDasharray="4 6" className="text-ink" />

            {/* route */}
            <motion.path
              d={path}
              fill="none"
              stroke="var(--rust)"
              strokeWidth="1.4"
              strokeDasharray="1"
              pathLength={1}
              style={{ strokeDashoffset: dashOffset }}
            />
            {/* ghost route */}
            <path d={path} fill="none" stroke="currentColor" strokeOpacity="0.15" strokeWidth="0.6" strokeDasharray="2 4" className="text-ink" />

            {/* stations */}
            {STOPS.map((s, i) => (
              <Station key={s.id} stop={s} i={i} activeIdx={activeIdx} />
            ))}
          </svg>

          {/* corner annotations */}
          <div className="absolute top-3 left-4 font-mono text-[9px] uppercase tracking-widest text-clay">
            Plate · Journey 2021–2028
          </div>
          <div className="absolute bottom-3 right-4 font-mono text-[9px] uppercase tracking-widest text-clay">
            N ↑
          </div>
        </div>
      </div>
    </section>
  );
}
