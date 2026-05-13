import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * Surveyor crosshair cursor with snap-to-target magnetism.
 *
 * - Idle: thin crosshair ring with center mark.
 * - Hover [data-cursor="hover"] / a / button: ring grows, snaps to element center,
 *   gains a subtle tick-mark rotation.
 * - Press: ring contracts (mousedown/up).
 * - Text targets [data-cursor="text"]: morphs into a vertical I-beam bar.
 */
export function Cursor() {
  const reduce = usePrefersReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [variant, setVariant] = useState<"idle" | "hover" | "text">("idle");
  const [pressed, setPressed] = useState(false);

  // Raw pointer
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  // Outer ring — softer spring, snappy enough to feel alive
  const sx = useSpring(x, { stiffness: 600, damping: 42, mass: 0.35 });
  const sy = useSpring(y, { stiffness: 600, damping: 42, mass: 0.35 });
  // Inner dot — almost 1:1 with pointer
  const dx = useSpring(x, { stiffness: 1200, damping: 50, mass: 0.2 });
  const dy = useSpring(y, { stiffness: 1200, damping: 50, mass: 0.2 });

  // Slow continuous tick rotation while hovering
  const rot = useMotionValue(0);
  useEffect(() => {
    if (variant !== "hover") return;
    let raf = 0;
    const tick = () => {
      rot.set(rot.get() + 0.25);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [variant, rot]);

  useEffect(() => {
    if (reduce) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;
    setEnabled(true);
    document.documentElement.style.cursor = "none";

    const onMove = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      const target = t?.closest<HTMLElement>(
        'a, button, [data-cursor="hover"], [data-cursor="text"], input, textarea, select, label'
      );

      if (target) {
        const isText = target.matches('[data-cursor="text"], input, textarea, p, h1, h2, h3, label');
        if (isText) {
          setVariant("text");
          x.set(e.clientX);
          y.set(e.clientY);
        } else {
          // Snap ring to element center for a magnetic "lock-on"
          const r = target.getBoundingClientRect();
          // Limit snap to reasonably small targets so giant hero buttons still feel natural
          const snap = r.width < 320 && r.height < 160;
          x.set(snap ? r.left + r.width / 2 : e.clientX);
          y.set(snap ? r.top + r.height / 2 : e.clientY);
          setVariant("hover");
        }
      } else {
        setVariant("idle");
        x.set(e.clientX);
        y.set(e.clientY);
      }
    };
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);
    const onLeave = () => {
      x.set(-100);
      y.set(-100);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseleave", onLeave);
      document.documentElement.style.cursor = "";
    };
  }, [reduce, x, y]);

  const ringScale = useTransform(() => {
    if (pressed) return 0.7;
    if (variant === "hover") return 2.0;
    if (variant === "text") return 0.4;
    return 1;
  });

  if (!enabled) return null;

  return (
    <>
      {/* Outer surveyor ring */}
      <motion.div
        style={{ x: sx, y: sy, rotate: rot }}
        className="pointer-events-none fixed left-0 top-0 z-[90] -translate-x-1/2 -translate-y-1/2 mix-blend-multiply"
      >
        <motion.div
          style={{ scale: ringScale }}
          transition={{ type: "spring", stiffness: 350, damping: 26 }}
          className="relative size-10 flex items-center justify-center"
        >
          {/* ring */}
          <div
            className="absolute inset-0 rounded-full border border-ink/60 transition-colors duration-200"
            style={{
              borderColor: variant === "hover" ? "var(--rust)" : undefined,
              opacity: variant === "text" ? 0 : 1,
            }}
          />
          {/* crosshair lines */}
          <div
            className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-ink/60 transition-opacity"
            style={{ opacity: variant === "text" ? 0 : 1 }}
          />
          <div
            className="absolute top-1/2 left-0 right-0 h-px -translate-y-1/2 bg-ink/60 transition-opacity"
            style={{ opacity: variant === "text" ? 0 : 1 }}
          />
          {/* tick marks at NSEW */}
          <div
            className="absolute -top-1 left-1/2 -translate-x-1/2 w-px h-1.5 bg-rust transition-opacity"
            style={{ opacity: variant === "hover" ? 1 : 0 }}
          />
          <div
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-px h-1.5 bg-rust transition-opacity"
            style={{ opacity: variant === "hover" ? 1 : 0 }}
          />
          <div
            className="absolute -left-1 top-1/2 -translate-y-1/2 h-px w-1.5 bg-rust transition-opacity"
            style={{ opacity: variant === "hover" ? 1 : 0 }}
          />
          <div
            className="absolute -right-1 top-1/2 -translate-y-1/2 h-px w-1.5 bg-rust transition-opacity"
            style={{ opacity: variant === "hover" ? 1 : 0 }}
          />
        </motion.div>
      </motion.div>

      {/* I-beam (text mode) */}
      <motion.div
        style={{ x: dx, y: dy }}
        className="pointer-events-none fixed left-0 top-0 z-[90] -translate-x-1/2 -translate-y-1/2"
      >
        <motion.div
          animate={{ opacity: variant === "text" ? 1 : 0, scaleY: variant === "text" ? 1 : 0.4 }}
          transition={{ duration: 0.18 }}
          className="w-px h-5 bg-ink"
        />
      </motion.div>

      {/* Inner dot — tracks the real pointer */}
      <motion.div
        style={{ x: dx, y: dy }}
        className="pointer-events-none fixed left-0 top-0 z-[91] -translate-x-1/2 -translate-y-1/2"
      >
        <motion.div
          animate={{
            scale: pressed ? 2.4 : variant === "hover" ? 0 : 1,
            opacity: variant === "text" ? 0 : 1,
          }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
          className="size-1 rounded-full bg-rust"
        />
      </motion.div>
    </>
  );
}
