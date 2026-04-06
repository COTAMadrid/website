'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import { COPY } from '@/content/copy';
import { AgendaEmbed } from './agenda-embed';

export function AgendaBlock() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-120px' });

  return (
    <section
      id="agenda"
      ref={ref}
      className="relative overflow-hidden bg-background/92 px-6 py-16 md:py-24"
    >
      {/* Textural background image */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <Image
          src={COPY.agenda.image}
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-[0.10]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 md:mb-12"
        >
          <div className="mb-6 flex items-center gap-4">
            <span className="h-px w-10 bg-border" />
            <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
              {COPY.agenda.eyebrow}
            </span>
          </div>
          <h2 className="max-w-3xl font-serif text-4xl leading-[1.02] tracking-[-0.02em] md:text-6xl lg:text-7xl text-balance">
            {COPY.agenda.title}
          </h2>
        </motion.div>

        {/* Tasting menu list */}
        <div className="relative border-t border-border/60">
          {COPY.agenda.options.map((o, i) => (
            <MenuRow
              key={o.title}
              num={String(i + 1).padStart(2, '0')}
              title={o.title}
              duration={o.duration}
              body={o.body}
              delay={0.1 + i * 0.1}
              inView={inView}
            />
          ))}
        </div>

        {/* Scarcity microcopy */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-8 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground"
        >
          <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
          Solo un número limitado de proyectos al mes
        </motion.p>

        {/* Embed below */}
        <div className="mt-10 md:mt-12">
          <AgendaEmbed />
        </div>
      </div>
    </section>
  );
}

function MenuRow({
  num,
  title,
  duration,
  body,
  delay,
  inView,
}: {
  num: string;
  title: string;
  duration: string;
  body: string;
  delay: number;
  inView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className="group relative border-b border-border/60 transition-colors duration-500 hover:bg-card/40"
    >
      <div className="flex flex-col gap-3 px-2 py-6 md:grid md:grid-cols-[auto_1fr_auto_auto] md:items-baseline md:gap-6 md:px-4 md:py-8">
        {/* Number */}
        <span className="font-serif text-2xl text-accent/80 md:text-3xl">
          {num}
        </span>
        {/* Title */}
        <h3 className="font-serif text-3xl leading-tight tracking-tight md:text-4xl">
          {title}
        </h3>
        {/* Dotted leader (desktop) */}
        <span
          aria-hidden
          className="hidden flex-1 translate-y-[-6px] overflow-hidden text-border md:block"
        >
          <span className="block truncate tracking-[0.4em]">
            ··················································································································
          </span>
        </span>
        {/* Duration */}
        <span className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground md:text-right">
          {duration}
        </span>
      </div>
      <div className="px-2 pb-6 md:grid md:grid-cols-[auto_1fr_auto_auto] md:gap-6 md:px-4 md:pb-8">
        <span className="hidden md:block" />
        <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
          {body}
        </p>
      </div>
    </motion.div>
  );
}
