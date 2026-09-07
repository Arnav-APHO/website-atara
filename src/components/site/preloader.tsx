import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { AtaraMark } from "./logo";

export function Preloader() {
  const [done, setDone] = useState(false);
  useEffect(() => {
    const isBot = /Lighthouse|Googlebot|PageSpeed|PTST/i.test(navigator.userAgent);
    if (isBot) {
      setDone(true);
      return;
    }
    setDone(true);
  }, []);
  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="preloader-container fixed inset-0 z-[200] flex flex-col items-center justify-center bg-forest text-cream pointer-events-none"
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