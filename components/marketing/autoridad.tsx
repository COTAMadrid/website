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
      className="relative py-20 md:py-32 px-6 bg-[var(--color-cream)]/85 text-[var(--color-cream-foreground)] overflow-hidden"
    >
      <div className="relative mx-auto grid max-w-6xl grid-cols-12 items-center gap-y-12 md:gap-x-12">
        {/* Image — bigger, asymmetric, lower-left */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="relative col-span-12 md:col-span-5 md:col-start-1 md:row-start-1 group md:translate-y-6"
        >
          <div className="relative aspect-[4/5] w-full max-w-[460px] overflow-hidden rounded-sm shadow-editorial md:rotate-[-1.5deg] md:transition-transform md:duration-[700ms] md:ease-[cubic-bezier(0.22,1,0.36,1)] md:group-hover:rotate-0">
            <Image
              src={COPY.autoridad.image}
              alt={COPY.autoridad.imageAlt}
              fill
              sizes="(min-width: 768px) 460px, 100vw"
              className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 ring-1 ring-black/5" />

            {/* Annotation tag */}
            <div className="absolute left-3 top-3 bg-white/90 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-[color:oklch(0.45_0.12_75)] backdrop-blur-sm">
              Cocina · ref. 01
            </div>
          </div>
          {/* Caption with dimension marker */}
          <div className="mt-3 flex max-w-[460px] items-center gap-3 font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--color-cream-muted)]">
            <span className="cota-cross text-[color:oklch(0.55_0.12_75)]" />
            <span>Fig. 01 · {COPY.autoridad.imageAlt}</span>
          </div>
        </motion.div>

        {/* Copy column */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative col-span-12 md:col-span-7 md:col-start-6 md:row-start-1"
        >
          <div className="text-xs uppercase tracking-[0.24em] text-[var(--color-cream-muted)]">
            {COPY.autoridad.eyebrow}
          </div>
          <div className="mt-3 h-px w-12 bg-accent" />

          {/* Ghost numeral */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-12 right-0 select-none font-serif leading-none text-[color:oklch(0.18_0_0)]/[0.06]"
            style={{ fontSize: 'clamp(8rem, 16vw, 14rem)' }}
          >
            I
          </div>

          <h2 className="relative mt-8 font-serif text-[2.2rem] md:text-[3rem] lg:text-[3.5rem] leading-[1.0] tracking-[-0.03em] text-balance max-w-[18ch]">
            {COPY.autoridad.title}
          </h2>
          <p className="relative mt-8 max-w-[55ch] text-base leading-relaxed text-[var(--color-cream-muted)] md:text-lg">
            {COPY.autoridad.body}
          </p>
          <p className="relative mt-8 font-serif text-xl italic text-[var(--color-cream-foreground)] md:text-2xl">
            {COPY.autoridad.closing}
          </p>
        </motion.div>
      </div>

      {/* Problemas — 3-card grid */}
      <div className="relative mx-auto mt-16 max-w-6xl md:mt-24">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          {COPY.autoridad.problemas.map((p, i) => (
            <ProblemaCard
              key={p.n}
              n={p.n}
              title={p.title}
              body={p.body}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

const CARD_ROTATIONS = ['md:-rotate-[1deg]', 'md:rotate-0', 'md:rotate-[1deg]'];

function ProblemaCard({
  n,
  title,
  body,
  index,
}: {
  n: string;
  title: string;
  body: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-15%' });

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay: 0.15 * index, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative border border-[var(--color-cream-border)] bg-white/70 p-6 shadow-editorial backdrop-blur-[1px] md:p-7 transition-all duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-2xl hover:md:rotate-0 ${CARD_ROTATIONS[index]}`}
    >
      <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-[color:oklch(0.55_0.12_75)]">
        {n}
      </div>
      <div className="mt-4 h-px w-10 bg-[color:oklch(0.55_0.12_75)]/60" />
      <h3 className="mt-4 font-serif text-xl leading-[1.15] tracking-[-0.01em] text-balance md:text-2xl">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-[var(--color-cream-muted)]">
        {body}
      </p>
      <div
        aria-hidden
        className="absolute -bottom-2 -right-2 h-10 w-10 border-b border-r border-[color:oklch(0.55_0.12_75)]/60"
      />
    </motion.article>
  );
}
