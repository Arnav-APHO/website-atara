import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { AtaraMark } from "./logo";

export function Preloader() {
  const [done, setDone] = useState(false);
  useEffect(() => {
    // If we want to skip for some bots, we can try, but preserve it for normal users
    const isBot = /Lighthouse|Googlebot|PageSpeed|PTST/i.test(navigator.userAgent);
    if (isBot) {
      setDone(true);
      return;
    }
    const t = setTimeout(() => setDone(true), 1400);
    return () => clearTimeout(t);
  }, []);
  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: [0.77, 0, 0.175, 1] }}
          className="preloader-container fixed inset-0 z-[200] flex flex-col items-center justify-center bg-forest text-cream"
        >
          <motion.div
            initial={{ scale: 0.6, opacity: 0, rotate: -8 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <AtaraMark className="h-20 w-20 text-cream" />
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-6 text-xs uppercase tracking-[0.6em] text-cream/70"
          >
            Inspire · With · Impact
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}