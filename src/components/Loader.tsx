import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * Surveyor's-mark intro sequence.
 * Shows once per session — crosshair calibrates and "locks" before revealing the site.
 */
export function Loader() {
  const reduce = usePrefersReducedMotion();
  // Always start "done" on the server + first client render to avoid hydration mismatch.
  // Then in an effect, decide whether to actually show the loader.
  const [done, setDone] = useState(true);

  useEffect(() => {
    const seen = sessionStorage.getItem("survey-loaded") === "1";
    if (seen) return;
    setDone(false);
    if (reduce) {
      setDone(true);
      sessionStorage.setItem("survey-loaded", "1");
      document.body.style.overflow = "";
      return;
    }
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => {
      setDone(true);
      sessionStorage.setItem("survey-loaded", "1");
      document.body.style.overflow = "";
    }, 2200);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = "";
    };
  }, [done, reduce]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: "easeInOut" } }}
          className="fixed inset-0 z-[100] bg-vellum flex items-center justify-center overflow-hidden"
        >
          <div className="absolute inset-0 survey-grid opacity-60" />
          <div className="absolute inset-0 paper-grain opacity-40" />

          {/* Top-left coords */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.1 } }}
            className="absolute top-6 left-6 font-mono text-[10px] uppercase tracking-widest text-clay"
          >
            Calibrating instrument…
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.1 } }}
            className="absolute top-6 right-6 font-mono text-[10px] uppercase tracking-widest text-clay text-right"
          >
            Lat 39.8028° N<br />Long 105.0875° W
          </motion.div>

          {/* Crosshair */}
          <div className="relative w-[60vmin] h-[60vmin] flex items-center justify-center">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1, transition: { duration: 1.0, ease: [0.7, 0, 0.2, 1] } }}
              className="absolute left-0 right-0 h-px bg-ink origin-left"
            />
            <motion.div
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1, transition: { duration: 1.0, ease: [0.7, 0, 0.2, 1], delay: 0.1 } }}
              className="absolute top-0 bottom-0 w-px bg-ink origin-top"
            />
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, transition: { duration: 0.8, delay: 0.9 } }}
              className="size-32 rounded-full border border-ink/40"
            />
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, transition: { duration: 0.6, delay: 1.2 } }}
              className="absolute size-16 rounded-full border border-rust"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 1.5 } }}
              className="absolute size-1.5 rounded-full bg-rust"
            />
          </div>

          {/* Bottom mark */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 1.7, duration: 0.5 } }}
            className="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-2"
          >
            <div className="font-serif italic text-2xl tracking-tight">Surveying…</div>
            <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-clay">
              Henry Adams · Portfolio · MMXXVI
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
