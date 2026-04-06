'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { COPY } from '@/content/copy';

export function ComoFunciona() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-120px' });

  return (
    <section
      ref={ref}
      className="relative py-32 md:py-40 px-6 bg-background overflow-hidden"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent"
      />
      <div className="relative mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-20"
        >
          <div className="text-xs uppercase tracking-[0.24em] text-accent mb-5">
            {COPY.comoFunciona.eyebrow}
          </div>
          <h2 className="font-serif text-4xl md:text-6xl leading-[1.05] tracking-[-0.02em] text-balance">
            {COPY.comoFunciona.title}
          </h2>
        </motion.div>

        <div className="relative grid md:grid-cols-3 gap-12 md:gap-8">
          <div
            aria-hidden
            className="hidden md:block absolute top-8 left-[16.66%] right-[16.66%] h-px bg-gradient-to-r from-accent/0 via-accent/40 to-accent/0"
          />
          {COPY.comoFunciona.steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.15 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="group relative"
            >
              <div className="relative flex md:justify-center mb-8">
                <div className="relative flex size-16 items-center justify-center rounded-full border border-accent/40 bg-background font-serif text-2xl text-accent transition-all duration-500 group-hover:border-accent group-hover:scale-105 group-hover:shadow-[0_0_50px_oklch(0.78_0.12_80/0.45)]">
                  {s.n}
                </div>
              </div>
              <div className="md:text-center">
                <h3 className="font-serif text-2xl md:text-3xl mb-3 tracking-tight">
                  {s.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed md:max-w-xs md:mx-auto">
                  {s.body}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
