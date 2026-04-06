'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Check } from 'lucide-react';
import { COPY } from '@/content/copy';

export function PropuestaValor() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-120px' });

  return (
    <section
      ref={ref}
      className="relative py-32 md:py-40 px-6 bg-background overflow-hidden"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:radial-gradient(oklch(1_0_0)_1px,transparent_1px)] [background-size:28px_28px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,oklch(0.78_0.12_80/0.08),transparent_70%)] blur-3xl"
      />

      <div className="relative mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="text-xs uppercase tracking-[0.24em] text-accent mb-5">
            {COPY.propuesta.eyebrow}
          </div>
          <h2 className="font-serif text-4xl md:text-6xl leading-[1.05] tracking-[-0.02em] mb-16 text-balance max-w-4xl">
            {COPY.propuesta.title}
          </h2>
        </motion.div>

        <ul className="grid sm:grid-cols-2 gap-px bg-border/60 rounded-2xl overflow-hidden border border-border/60">
          {COPY.propuesta.bullets.map((b, i) => (
            <motion.li
              key={b}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.15 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="group flex items-start gap-4 p-8 bg-card text-lg transition-all duration-500 hover:bg-background hover:-translate-y-0.5"
            >
              <span className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-full border border-accent/40 bg-accent/10 text-accent transition-all duration-500 group-hover:scale-110 group-hover:border-accent group-hover:bg-accent/25 group-hover:shadow-[0_0_30px_oklch(0.78_0.12_80/0.4)]">
                <Check className="size-4" strokeWidth={2.5} />
              </span>
              <span className="leading-snug">{b}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
