import { useRef, useState, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * Magnetic wrapper — element subtly chases the pointer while hovered, with
 * an inner content layer that pulls a bit further than its border for parallax.
 *
 * Usage:
 *   <Magnetic><Link to="/projects">All eight ↗</Link></Magnetic>
 *   <Magnetic strength={0.5} radius={140}><Button /></Magnetic>
 */
export function Magnetic({
  children,
  strength = 0.35,
  radius,
  className,
}: {
  children: ReactNode;
  /** 0 = no pull, 1 = element fully follows the pointer */
  strength?: number;
  /** Optional activation radius in px (defaults to element diagonal) */
  radius?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = usePrefersReducedMotion();
  const [hover, setHover] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.5 });

  // Inner content moves ~1.4x further for a soft parallax pop
  const innerX = useTransform(sx, (v) => v * 1.4);
  const innerY = useTransform(sy, (v) => v * 1.4);

  const onMove = (e: React.MouseEvent) => {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const reach = radius ?? Math.hypot(r.width, r.height) / 1.2;
    const dist = Math.hypot(dx, dy);
    // Falloff so the pull eases out near the edge of activation
    const falloff = Math.max(0, 1 - dist / reach);
    x.set(dx * strength * (0.5 + 0.5 * falloff));
    y.set(dy * strength * (0.5 + 0.5 * falloff));
  };
  const onEnter = () => setHover(true);
  const onLeave = () => {
    setHover(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{ x: sx, y: sy, display: "inline-block" }}
      animate={{ scale: hover && !reduce ? 1.04 : 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className={className}
    >
      <motion.span style={{ x: innerX, y: innerY, display: "inline-block" }}>
        {children}
      </motion.span>
    </motion.span>
  );
}
