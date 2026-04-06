'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import { COPY } from '@/content/copy';

export function Filtrado() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-120px' });

  return (
    <section
      ref={ref}
      className="relative py-32 md:py-40 px-6 bg-[var(--color-cream)] text-[var(--color-cream-foreground)] overflow-hidden"
    >
      <div className="mx-auto max-w-7xl grid md:grid-cols-12 gap-12 lg:gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="md:col-span-5 relative group order-1"
        >
          <div className="relative aspect-[4/5] overflow-hidden rounded-sm shadow-[0_40px_80px_-30px_oklch(0_0_0/0.35)]">
            <Image
              src={COPY.filtrado.image}
              alt={COPY.filtrado.imageAlt}
              fill
              sizes="(min-width: 768px) 42vw, 100vw"
              className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 ring-1 ring-black/5" />
          </div>
          <div className="absolute -top-4 -left-4 hidden md:block h-24 w-24 border-t border-l border-accent" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="md:col-span-7 order-2"
        >
          <div className="text-xs uppercase tracking-[0.24em] text-[var(--color-cream-muted)]">
            {COPY.filtrado.eyebrow}
          </div>
          <div className="mt-3 h-px w-12 bg-accent" />
          <h2 className="mt-8 font-serif text-4xl md:text-5xl lg:text-[3.75rem] leading-[1.05] tracking-[-0.02em] text-balance">
            {COPY.filtrado.title}
          </h2>
          <p className="mt-8 text-lg md:text-xl text-[var(--color-cream-muted)] max-w-xl leading-relaxed">
            {COPY.filtrado.body}
          </p>
          <p className="mt-8 font-serif text-2xl md:text-3xl italic">
            {COPY.filtrado.closing}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
