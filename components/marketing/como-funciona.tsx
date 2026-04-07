'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { COPY } from '@/content/copy';

/**
 * Bento + timeline rail. Editorial split header (massive type left,
 * meta-marker right). Steps presented as a vertical rail with offset
 * cards alternating sides, connected by a dashed SVG path.
 */
export function ComoFunciona() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-120px' });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-transparent px-6 py-20 md:py-32"
    >
      <div className="relative mx-auto max-w-7xl">
        {/* Editorial split header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-20 grid grid-cols-12 items-end gap-y-8 md:mb-28"
        >
          <div className="col-span-12 md:col-span-8">
            <div className="mb-6 flex items-center gap-4">
              <span className="h-px w-10 bg-border" />
              <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
                {COPY.comoFunciona.eyebrow}
              </span>
            </div>
            <h2 className="font-serif text-[2.4rem] leading-[1.0] tracking-[-0.035em] md:text-[3.5rem] lg:text-[4.25rem] text-balance max-w-[12ch]">
              {COPY.comoFunciona.title}
            </h2>
          </div>
          <div className="col-span-12 md:col-span-4 md:text-right">
            <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
              03 fases · ~5 días
            </div>
            <div className="ml-auto mt-3 hidden h-px w-24 bg-accent/60 md:block" />
          </div>
        </motion.div>

        {/* Timeline rail */}
        <div className="relative">
          {/* center rail */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-6 top-0 bottom-0 hidden text-border md:block md:left-1/2 md:-translate-x-1/2"
          >
            <div className="cota-rail h-full" />
          </div>

          <ol className="relative space-y-16 md:space-y-24">
            {COPY.comoFunciona.steps.map((s, i) => (
              <Step
                key={s.n}
                n={s.n}
                title={s.title}
                body={s.body}
                align={i % 2 === 0 ? 'left' : 'right'}
              />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function Step({
  n,
  title,
  body,
  align,
}: {
  n: string;
  title: string;
  body: string;
  align: 'left' | 'right';
}) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { once: true, margin: '-20%' });

  return (
    <li ref={ref} className="relative grid grid-cols-12 items-center gap-y-6">
      {/* node dot on the rail */}
      <span
        aria-hidden
        className="absolute left-6 z-10 hidden size-3 -translate-x-[5px] rounded-full bg-background ring-2 ring-accent md:block md:left-1/2 md:-translate-x-1/2"
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className={`col-span-12 pl-14 md:col-span-5 md:pl-0 ${
          align === 'left' ? 'md:col-start-1 md:pr-12 md:text-right' : 'md:col-start-8 md:pl-12'
        }`}
      >
        <div className={`mb-4 inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.24em] text-accent ${align === 'left' ? 'md:flex-row-reverse' : ''}`}>
          <span>Fase {n}</span>
          <span className="h-px w-8 bg-accent/50" />
        </div>
        <h3 className="font-serif text-[1.85rem] leading-[1.05] tracking-[-0.015em] md:text-[2.4rem] text-balance">
          {title}
        </h3>
        <div className={`mt-5 h-px w-12 bg-border ${align === 'left' ? 'md:ml-auto' : ''}`} />
        <p className="mt-5 max-w-[42ch] text-base leading-relaxed text-muted-foreground md:text-lg">
          {body}
        </p>
      </motion.div>

      {/* Big ghost numeral on the opposite side */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0, scale: 0.95 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        className={`hidden md:col-span-5 md:flex md:items-center ${
          align === 'left' ? 'md:col-start-8 md:pl-12' : 'md:col-start-1 md:pr-12 md:justify-end'
        }`}
      >
        <span
          className="select-none font-serif leading-[0.82] tracking-[-0.05em] text-foreground/[0.07]"
          style={{ fontSize: 'clamp(8rem, 14vw, 14rem)' }}
        >
          {n}
        </span>
      </motion.div>
    </li>
  );
}
