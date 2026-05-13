import { useRef, type ReactNode, type ElementType } from "react";
import { motion, useInView } from "motion/react";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * Surveyor-style section reveal. Children mark + measure into place when
 * scrolled into view. Pair with [data-reveal-child] to stagger inner items.
 *
 * <Reveal as="section">
 *   <h2 data-reveal-child>Heading</h2>
 *   <p data-reveal-child>Body…</p>
 * </Reveal>
 */
export function Reveal({
  children,
  as,
  className,
  delay = 0,
  y = 24,
  once = true,
  amount = 0.25,
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
  amount?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();
  const inView = useInView(ref, { once, amount });

  if (reduce) {
    const Comp = (as ?? "div") as ElementType;
    return (
      <Comp ref={ref} className={className}>
        {children}
      </Comp>
    );
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      variants={{
        hidden: { opacity: 0, y },
        show: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
            delay,
            staggerChildren: 0.08,
            delayChildren: delay + 0.05,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
