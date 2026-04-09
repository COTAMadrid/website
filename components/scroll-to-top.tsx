'use client';

import { AnimatePresence, motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { useState } from 'react';

/**
 * Minimal scroll-to-top button. Appears after scrolling 120vh.
 */
export function ScrollToTop() {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setVisible(latest > window.innerHeight * 1.2);
  });

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Volver arriba"
          className="fixed bottom-24 right-6 z-30 size-10 rounded-full border border-white/10 bg-[oklch(0.18_0.016_168/0.9)] backdrop-blur-xl text-foreground/60 hover:text-accent hover:border-accent/30 flex items-center justify-center transition-colors duration-300 shadow-lg"
        >
          <ArrowUp className="size-4" strokeWidth={1.5} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
