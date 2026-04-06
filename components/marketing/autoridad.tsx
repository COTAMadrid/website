'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import { COPY } from '@/content/copy';

export function Autoridad() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-120px' });

  return (
    <section
      ref={ref}
      className="relative py-16 md:py-24 px-6 bg-[var(--color-cream)] text-[var(--color-cream-foreground)] overflow-hidden"
    >
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="relative float-none mb-8 w-full max-w-[280px] sm:max-w-[320px] md:float-right md:mb-4 md:ml-10 md:max-w-[340px] group"
        >
          <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
            <Image
              src={COPY.autoridad.image}
              alt={COPY.autoridad.imageAlt}
              fill
              sizes="(min-width: 768px) 340px, 320px"
              className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 ring-1 ring-black/5" />
          </div>
          <div className="absolute -bottom-3 -right-3 hidden md:block h-14 w-14 border-b border-r border-accent" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="text-xs uppercase tracking-[0.24em] text-[var(--color-cream-muted)]">
            {COPY.autoridad.eyebrow}
          </div>
          <div className="mt-3 h-px w-12 bg-accent" />
          <h2 className="mt-8 font-serif text-4xl md:text-5xl lg:text-[3.5rem] leading-[1.05] tracking-[-0.02em] text-balance">
            {COPY.autoridad.title}
          </h2>
          <p className="mt-8 text-base md:text-lg text-[var(--color-cream-muted)] max-w-xl leading-relaxed">
            {COPY.autoridad.body}
          </p>
          <p className="mt-8 font-serif text-xl md:text-2xl italic text-[var(--color-cream-foreground)]">
            {COPY.autoridad.closing}
          </p>
        </motion.div>
        <div className="clear-both" />
      </div>
    </section>
  );
}
