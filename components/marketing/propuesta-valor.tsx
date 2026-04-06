'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { COPY } from '@/content/copy';

export function PropuestaValor() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-120px' });

  const bullets = COPY.propuesta.bullets;
  const accents = COPY.propuesta.accents;

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-background/92 px-6 py-16 md:py-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:radial-gradient(oklch(1_0_0)_1px,transparent_1px)] [background-size:32px_32px]"
      />

      <div className="relative mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14 max-w-3xl md:mb-20"
        >
          <div className="mb-6 flex items-center gap-4">
            <span className="h-px w-10 bg-border" />
            <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
              {COPY.propuesta.eyebrow}
            </span>
          </div>
          <h2 className="font-serif text-4xl leading-[1.02] tracking-[-0.02em] md:text-6xl lg:text-7xl text-balance">
            {COPY.propuesta.title}
          </h2>
        </motion.div>

        {/* Manifesto */}
        <ol className="relative">
          {bullets.map((b, i) => (
            <Statement
              key={b}
              num={String(i + 1).padStart(2, '0')}
              text={b}
              accentWord={accents[i]}
              isLast={i === bullets.length - 1}
              delay={0.1 + i * 0.12}
            />
          ))}
        </ol>
      </div>
    </section>
  );
}

function Statement({
  num,
  text,
  accentWord,
  isLast,
  delay,
}: {
  num: string;
  text: string;
  accentWord?: string;
  isLast: boolean;
  delay: number;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { once: true, margin: '-15%' });

  // Split text around the accent word (first match, case-insensitive).
  let before = text;
  let match = '';
  let after = '';
  if (accentWord) {
    const idx = text.toLowerCase().indexOf(accentWord.toLowerCase());
    if (idx >= 0) {
      before = text.slice(0, idx);
      match = text.slice(idx, idx + accentWord.length);
      after = text.slice(idx + accentWord.length);
    }
  }

  return (
    <motion.li
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      className="group relative grid grid-cols-12 items-baseline gap-y-4 py-8 md:py-10"
    >
      {/* Number */}
      <div className="col-span-12 md:col-span-2">
        <span className="font-serif text-xl text-accent/90 md:text-2xl">
          {num}
          <span className="text-border">.</span>
        </span>
      </div>
      {/* Statement */}
      <p className="col-span-12 font-serif text-3xl leading-[1.15] tracking-[-0.01em] md:col-span-10 md:text-5xl lg:text-[3.5rem] text-balance">
        {before}
        {match && (
          <span className="italic text-accent">{match}</span>
        )}
        {after}
      </p>
      {!isLast && (
        <div
          aria-hidden
          className="col-span-12 mt-6 h-px bg-border/50 md:mt-8"
        />
      )}
    </motion.li>
  );
}
