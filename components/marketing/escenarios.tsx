'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import { COPY } from '@/content/copy';

export function Escenarios() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-120px' });

  return (
    <section
      ref={ref}
      className="relative bg-[var(--color-cream)]/92 text-[var(--color-cream-foreground)] overflow-hidden"
    >
      {/* Section header */}
      <div className="relative mx-auto max-w-7xl px-6 pt-16 pb-10 md:pt-24 md:pb-14">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <div className="mb-6 flex items-center gap-4">
            <span className="h-px w-10 bg-[var(--color-cream-border)]" />
            <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--color-cream-muted)]">
              {COPY.escenarios.eyebrow}
            </span>
          </div>
          <h2 className="font-serif text-4xl leading-[1.02] tracking-[-0.02em] md:text-6xl lg:text-7xl text-balance">
            {COPY.escenarios.title}
          </h2>
        </motion.div>
      </div>

      {/* Editorial pages — alternating layouts */}
      <div className="relative">
        {COPY.escenarios.cards.map((c, i) => {
          const num = String(i + 1).padStart(2, '0');
          const isReverse = i % 2 === 1;
          return (
            <EditorialPage
              key={c.title}
              num={num}
              title={c.title}
              body={c.body}
              closing={c.closing}
              image={c.image}
              imageAlt={c.imageAlt}
              reverse={isReverse}
              index={i}
            />
          );
        })}
      </div>
      <div className="h-12 md:h-16" />
    </section>
  );
}

function EditorialPage({
  num,
  title,
  body,
  closing,
  image,
  imageAlt,
  reverse,
  index,
}: {
  num: string;
  title: string;
  body: string;
  closing: string;
  image: string;
  imageAlt: string;
  reverse: boolean;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-20%' });

  return (
    <div
      ref={ref}
      className="relative mx-auto grid max-w-5xl grid-cols-12 items-center gap-y-6 px-6 py-10 md:py-14"
    >
      {/* Image — small inset */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className={`relative col-span-12 md:col-span-4 md:row-start-1 ${
          reverse ? 'md:col-start-9' : 'md:col-start-1'
        }`}
      >
        <div className="relative aspect-[4/3] w-full max-w-[300px] overflow-hidden">
          <Image
            src={image}
            alt={imageAlt}
            fill
            sizes="(min-width: 768px) 300px, 100vw"
            className="object-cover"
          />
        </div>
        {/* Figure caption */}
        <div className="mt-2 flex max-w-[300px] items-center gap-3 font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--color-cream-muted)]">
          <span>Fig. {num}</span>
          <span className="h-px w-6 bg-[var(--color-cream-border)]" />
          <span className="truncate">{imageAlt}</span>
        </div>
      </motion.div>

      {/* Text column */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className={`relative col-span-12 flex flex-col justify-center md:col-span-8 md:row-start-1 ${
          reverse ? 'md:col-start-1 md:pr-10' : 'md:col-start-5 md:pl-10'
        }`}
      >
        {/* Smaller ghost number */}
        <div
          aria-hidden
          className="pointer-events-none relative mb-3 select-none font-serif leading-none text-[var(--color-cream-foreground)]/10"
          style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)' }}
        >
          {num}
        </div>
        <div className="relative -mt-3 md:-mt-5">
          <h3 className="mb-5 font-serif text-2xl leading-[1.05] tracking-[-0.01em] md:text-4xl text-balance">
            {title}
          </h3>
          <div className="mb-6 h-px w-12 bg-[color:oklch(0.55_0.12_75)]" />
          <p className="max-w-md text-base leading-relaxed text-[var(--color-cream-muted)]">
            {body}
          </p>
          <p className="mt-6 font-serif text-lg italic text-[color:oklch(0.45_0.12_75)]">
            — {closing}
          </p>
        </div>
      </motion.div>

      {/* Between-rows hairline (except last) */}
      {index < 2 && (
        <div
          aria-hidden
          className="col-span-12 mt-4 h-px bg-[var(--color-cream-border)] md:mt-8"
        />
      )}
    </div>
  );
}
