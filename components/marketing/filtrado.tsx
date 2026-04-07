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
      className="relative py-16 md:py-24 px-6 bg-[var(--color-cream)]/85 text-[var(--color-cream-foreground)] overflow-hidden"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-12 gap-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="col-span-12 md:col-span-7 md:col-start-2"
        >
          <div className="text-xs uppercase tracking-[0.24em] text-[var(--color-cream-muted)]">
            {COPY.filtrado.eyebrow}
          </div>
          <div className="mt-3 h-px w-12 bg-accent" />
          <h2 className="mt-8 font-serif text-[2.2rem] md:text-[2.75rem] lg:text-[3.25rem] leading-[1.05] tracking-[-0.02em] text-balance max-w-[16ch]">
            {COPY.filtrado.title}
          </h2>
          <p className="mt-8 text-base text-[var(--color-cream-muted)] max-w-[58ch] leading-relaxed font-medium">
            {COPY.filtrado.body}
          </p>
          <p className="mt-8 font-serif text-xl md:text-2xl italic">
            {COPY.filtrado.closing}
          </p>
        </motion.div>
        <motion.aside
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="hidden md:block col-span-3 col-start-10 self-start mt-24 rotate-[-1.5deg]"
        >
          <div className="relative border border-[var(--color-cream-border)] bg-white/60 p-5 shadow-editorial">
            <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--color-cream-muted)]">
              Criterio · Ficha
            </div>
            <div className="mt-3 h-px w-full bg-[var(--color-cream-border)]" />
            <ul className="mt-4 space-y-2 font-mono text-[11px] text-[var(--color-cream-foreground)]">
              <li className="flex justify-between gap-3"><span>Alcance</span><span className="text-[color:oklch(0.45_0.12_75)]">Integral</span></li>
              <li className="flex justify-between gap-3"><span>Ubicación</span><span className="text-[color:oklch(0.45_0.12_75)]">Madrid</span></li>
              <li className="flex justify-between gap-3"><span>Plazo</span><span className="text-[color:oklch(0.45_0.12_75)]">8–14 sem</span></li>
              <li className="flex justify-between gap-3"><span>Ajuste</span><span className="text-[color:oklch(0.45_0.12_75)]">Alto</span></li>
            </ul>
            <div className="absolute -bottom-2 -right-2 h-10 w-10 border-b border-r border-accent" />
          </div>
        </motion.aside>
      </div>
    </section>
  );
}
