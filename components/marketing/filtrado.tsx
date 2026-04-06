'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { COPY } from '@/content/copy';

export function Filtrado() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-120px' });

  return (
    <section
      ref={ref}
      className="relative py-16 md:py-24 px-6 bg-[var(--color-cream)]/92 text-[var(--color-cream-foreground)] overflow-hidden"
    >
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="text-xs uppercase tracking-[0.24em] text-[var(--color-cream-muted)]">
            {COPY.filtrado.eyebrow}
          </div>
          <div className="mt-3 h-px w-12 bg-accent" />
          <h2 className="mt-8 font-serif text-4xl md:text-5xl lg:text-[3.5rem] leading-[1.05] tracking-[-0.02em] text-balance">
            {COPY.filtrado.title}
          </h2>
          <p className="mt-8 text-base md:text-lg text-[var(--color-cream-muted)] max-w-xl leading-relaxed">
            {COPY.filtrado.body}
          </p>
          <p className="mt-8 font-serif text-xl md:text-2xl italic">
            {COPY.filtrado.closing}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
