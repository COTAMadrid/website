'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { COPY } from '@/content/copy';

export function ComoFunciona() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-120px' });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-transparent px-6 py-16 md:py-24"
    >
      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14 max-w-3xl md:mb-20"
        >
          <div className="mb-6 flex items-center gap-4">
            <span className="h-px w-10 bg-border" />
            <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
              {COPY.comoFunciona.eyebrow}
            </span>
          </div>
          <h2 className="font-serif text-4xl leading-[1.02] tracking-[-0.02em] md:text-6xl lg:text-7xl text-balance">
            {COPY.comoFunciona.title}
          </h2>
        </motion.div>

        <div className="flex flex-col">
          {COPY.comoFunciona.steps.map((s, i) => (
            <Step
              key={s.n}
              n={s.n}
              title={s.title}
              body={s.body}
              align={i % 2 === 0 ? 'left' : 'right'}
              isLast={i === COPY.comoFunciona.steps.length - 1}
            />
          ))}
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
  isLast,
}: {
  n: string;
  title: string;
  body: string;
  align: 'left' | 'right';
  isLast: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-20%' });

  return (
    <div ref={ref} className="relative">
      <div
        className={`grid grid-cols-12 items-center gap-y-6 py-12 md:py-16 ${
          align === 'right' ? 'md:[&>.num]:col-start-7' : ''
        }`}
      >
        {/* Huge number */}
        <motion.div
          initial={{ opacity: 0, x: align === 'left' ? -60 : 60 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className={`num col-span-12 md:col-span-6 ${
            align === 'right' ? 'md:order-2 md:text-right' : ''
          }`}
        >
          <div
            aria-hidden
            className="select-none font-serif leading-[0.82] tracking-[-0.04em] text-foreground"
            style={{ fontSize: 'clamp(7rem, 16vw, 14rem)' }}
          >
            {n}
          </div>
        </motion.div>

        {/* Title + body */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className={`col-span-12 md:col-span-6 ${
            align === 'right' ? 'md:order-1 md:pr-12' : 'md:pl-12'
          }`}
        >
          <h3 className="mb-6 font-serif text-3xl leading-[1.1] tracking-[-0.01em] md:text-5xl text-balance">
            {title}
          </h3>
          <div className="mb-6 h-px w-16 bg-accent/60" />
          <p className="max-w-[38ch] text-lg leading-relaxed text-muted-foreground">
            {body}
          </p>
        </motion.div>
      </div>
      {!isLast && (
        <div aria-hidden className="mx-auto h-px w-1/3 bg-border/60" />
      )}
    </div>
  );
}
