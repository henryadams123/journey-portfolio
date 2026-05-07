import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * Surveyor crosshair cursor. Hides on touch devices and reduced-motion.
 * Grows when hovering elements with [data-cursor="hover"] or interactive tags.
 */
export function Cursor() {
  const reduce = usePrefersReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [hover, setHover] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });

  useEffect(() => {
    if (reduce) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;
    setEnabled(true);
    document.documentElement.style.cursor = "none";

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const t = e.target as HTMLElement | null;
      const interactive = !!t?.closest('a, button, [data-cursor="hover"], input, textarea, select, label');
      setHover(interactive);
    };
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.style.cursor = "";
    };
  }, [reduce, x, y]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        style={{ x: sx, y: sy }}
        className="pointer-events-none fixed left-0 top-0 z-[90] -translate-x-1/2 -translate-y-1/2 mix-blend-multiply"
      >
        <motion.div
          animate={{
            scale: hover ? 1.8 : 1,
            opacity: 1,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="relative size-10 flex items-center justify-center"
        >
          <div className="absolute inset-0 rounded-full border border-ink/60" />
          <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-ink/60" />
          <div className="absolute top-1/2 left-0 right-0 h-px -translate-y-1/2 bg-ink/60" />
        </motion.div>
      </motion.div>
      <motion.div
        style={{ x, y }}
        className="pointer-events-none fixed left-0 top-0 z-[91] -translate-x-1/2 -translate-y-1/2"
      >
        <div className="size-1 rounded-full bg-rust" />
      </motion.div>
    </>
  );
}
