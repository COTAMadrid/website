'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const STATS = [
  { value: '120+', label: 'Reformas ejecutadas' },
  { value: '10', label: 'Años de oficio' },
  { value: '98%', label: 'Satisfacción' },
  { value: 'Madrid', label: 'Capital y alrededores' },
];

/**
 * Trust strip — animated stats bar between Hero and BudgetShowcase.
 * Animated counters + subtle marquee of district names for social proof.
 */
export function TrustStrip() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section
      ref={ref}
      aria-label="Datos de confianza"
      className="relative border-y border-white/[0.06] bg-[oklch(0.14_0.018_168/0.6)] backdrop-blur-md overflow-hidden"
    >
      {/* Subtle golden gradient line at top */}
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 py-8 md:py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 * i, ease: [0.22, 1, 0.36, 1] }}
              className={`text-center ${i > 0 ? 'md:border-l md:border-white/[0.08]' : ''}`}
            >
              <div className="font-serif text-3xl md:text-4xl text-accent tracking-[-0.02em]">
                {stat.value}
              </div>
              <div className="mt-2 font-mono text-[0.6rem] uppercase tracking-[0.22em] text-foreground/50">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Marquee of neighborhoods */}
      <div className="relative border-t border-white/[0.04] overflow-hidden">
        <div className="cota-marquee whitespace-nowrap py-3 font-mono text-[0.55rem] uppercase tracking-[0.3em] text-foreground/25">
          {Array.from({ length: 2 }).map((_, i) => (
            <span key={i} className="inline-block">
              Salamanca · Chamberí · Retiro · Chamartín · Moncloa · Centro · Arganzuela · Malasaña · La Latina · Chueca · Pozuelo · Las Rozas · Majadahonda · Boadilla&emsp;&emsp;&emsp;
            </span>
          ))}
        </div>
      </div>

      {/* Subtle golden gradient line at bottom */}
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
    </section>
  );
}
