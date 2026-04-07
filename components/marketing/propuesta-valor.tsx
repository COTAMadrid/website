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
      className="relative overflow-hidden bg-transparent px-6 py-20 md:py-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:radial-gradient(oklch(1_0_0)_1px,transparent_1px)] [background-size:32px_32px]"
      />

      <div className="relative mx-auto grid max-w-7xl grid-cols-12 gap-y-12 md:gap-x-12">
        {/* Editorial split — sticky column with eyebrow + huge index */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="col-span-12 md:col-span-5 md:sticky md:top-24 md:self-start"
        >
          <div className="mb-6 flex items-center gap-4">
            <span className="h-px w-10 bg-border" />
            <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
              {COPY.propuesta.eyebrow}
            </span>
          </div>
          <h2 className="font-serif text-[2.2rem] leading-[1.02] tracking-[-0.03em] md:text-[3rem] lg:text-[3.5rem] text-balance max-w-[14ch]">
            {COPY.propuesta.title}
          </h2>

          {/* Drafted index marker */}
          <div className="mt-12 hidden items-center gap-3 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground md:flex">
            <span className="cota-cross text-accent/60" />
            <span>04 puntos · método propio</span>
          </div>
        </motion.div>

        {/* Manifesto rows */}
        <ol className="col-span-12 md:col-span-7 md:border-l md:border-border/40 md:pl-12">
          {bullets.map((b, i) => (
            <Statement
              key={b}
              num={String(i + 1).padStart(2, '0')}
              text={b}
              accentWord={accents[i]}
              isLast={i === bullets.length - 1}
              delay={0.1 + i * 0.1}
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
      className="cota-row group relative py-8 md:py-10"
    >
      <div className="flex items-start gap-5 md:gap-8">
        <span className="nums shrink-0 font-mono text-[11px] uppercase tracking-[0.22em] text-accent/80 pt-3">
          {num}
        </span>
        <p className="font-serif text-[1.55rem] leading-[1.18] tracking-[-0.015em] md:text-[2rem] lg:text-[2.35rem] text-balance">
          {before}
          {match && <span className="italic text-accent">{match}</span>}
          {after}
        </p>
      </div>
      {!isLast && (
        <div
          aria-hidden
          className="mt-8 h-px w-full bg-border/40 md:mt-10"
        />
      )}
    </motion.li>
  );
}
