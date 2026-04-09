'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import { COPY } from '@/content/copy';

/**
 * Z-axis cascade — three editorial "case files" that overlap with
 * varying rotation, scale and offset. Each card has its image clipped
 * into a tall portrait, a numbered file tab, and a dotted-leader meta row.
 *
 * Mobile collapses to a clean stacked feed.
 */
export function Escenarios() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-120px' });

  return (
    <section
      ref={ref}
      id="escenarios"
      className="relative bg-[var(--color-cream)]/85 text-[var(--color-cream-foreground)] overflow-hidden"
    >
      {/* Section header */}
      <div className="relative mx-auto max-w-7xl px-6 pt-20 pb-12 md:pt-32 md:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-12 items-end gap-y-6"
        >
          <div className="col-span-12 md:col-span-8">
            <div className="mb-6 flex items-center gap-4">
              <span className="h-px w-10 bg-[var(--color-cream-border)]" />
              <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--color-cream-muted)]">
                {COPY.escenarios.eyebrow}
              </span>
            </div>
            <h2 className="font-serif text-[2.2rem] leading-[1.02] tracking-[-0.03em] md:text-[3rem] lg:text-[3.5rem] text-balance max-w-[18ch]">
              {COPY.escenarios.title}
            </h2>
          </div>
          <div className="col-span-12 md:col-span-4 md:text-right">
            <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--color-cream-muted)]">
              Archivo · 03 expedientes
            </div>
            <div className="ml-auto mt-3 hidden h-px w-24 bg-[color:oklch(0.55_0.12_75)] md:block md:ml-auto" />
          </div>
        </motion.div>
      </div>

      {/* Z-cascade canvas */}
      <div className="relative mx-auto max-w-6xl px-6 pb-24 md:pb-32">
        {/* Mobile: stacked. Desktop: overlapping z-cascade. */}
        <div className="relative md:h-[44rem]">
          {COPY.escenarios.cards.map((c, i) => (
            <CaseFile
              key={c.title}
              num={String(i + 1).padStart(2, '0')}
              title={c.title}
              body={c.body}
              closing={c.closing}
              image={c.image}
              imageAlt={c.imageAlt}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

const POSITIONS = [
  // Less overlap, wider spread — still cascaded but readable
  'md:absolute md:left-[0%] md:top-0 md:w-[38%] md:rotate-[-1.5deg] md:z-10',
  'md:absolute md:left-[32%] md:top-[8%] md:w-[38%] md:rotate-[0.8deg] md:z-20',
  'md:absolute md:right-[0%] md:top-[2%] md:w-[38%] md:rotate-[1.8deg] md:z-30',
];

function CaseFile({
  num,
  title,
  body,
  closing,
  image,
  imageAlt,
  index,
}: {
  num: string;
  title: string;
  body: string;
  closing: string;
  image: string;
  imageAlt: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-15%' });

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1, delay: 0.15 * index, ease: [0.22, 1, 0.36, 1] }}
      className={`mb-12 md:mb-0 ${POSITIONS[index]} group transition-transform duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:md:rotate-0 hover:md:scale-[1.02] hover:md:z-40`}
    >
      <div className="relative bg-white shadow-editorial">
        {/* File tab */}
        <div className="absolute -top-4 left-6 z-10 flex items-center gap-2 bg-[var(--color-cream)] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.24em] text-[color:oklch(0.45_0.12_75)] shadow-[0_2px_8px_-2px_rgba(0,0,0,0.15)]">
          <span className="cota-cross text-[color:oklch(0.55_0.12_75)]" />
          Caso · {num}
        </div>

        {/* Image */}
        <div className="relative aspect-[5/4] w-full overflow-hidden">
          <Image
            src={image}
            alt={imageAlt}
            fill
            sizes="(min-width: 768px) 480px, 100vw"
            className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
          />
          {/* Overlay gradient for text legibility on caption */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/55 to-transparent" />
          <div className="absolute inset-x-5 bottom-4 font-mono text-[10px] uppercase tracking-[0.24em] text-white/85">
            Fig. {num} · {imageAlt}
          </div>
        </div>

        {/* Body */}
        <div className="relative p-6 md:p-7">
          <h3 className="font-serif text-[1.5rem] leading-[1.1] tracking-[-0.01em] text-balance md:text-[1.85rem]">
            {title}
          </h3>
          <div className="mt-4 h-px w-10 bg-[color:oklch(0.55_0.12_75)]" />
          <p className="mt-4 text-sm leading-relaxed text-[var(--color-cream-muted)]">
            {body}
          </p>

          {/* Dotted-leader meta row */}
          <div className="mt-5 flex items-end font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-cream-muted)]">
            <span>Resultado</span>
            <span className="cota-leader cream" />
            <span className="text-[color:oklch(0.45_0.12_75)]">
              {closing.replace(/[—.\s]+$/, '')}
            </span>
          </div>

          {/* Bottom-right corner mark */}
          <div
            aria-hidden
            className="absolute -bottom-2 -right-2 h-10 w-10 border-b border-r border-[color:oklch(0.55_0.12_75)]/60"
          />
        </div>
      </div>
    </motion.article>
  );
}
