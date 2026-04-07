'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import { Phone, Monitor, Home } from 'lucide-react';
import { COPY } from '@/content/copy';
import { AgendaEmbed } from './agenda-embed';

const ICONS: Record<string, typeof Phone> = { Phone, Monitor, Home };

export function AgendaBlock() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-120px' });

  return (
    <section
      id="agenda"
      ref={ref}
      className="relative overflow-hidden bg-transparent px-6 py-16 md:py-24"
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
          <h2 className="max-w-3xl font-serif text-[2.2rem] leading-[1.04] tracking-[-0.025em] md:text-5xl lg:text-[3.25rem] text-balance">
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
              icon={o.icon}
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
  icon,
  delay,
  inView,
}: {
  num: string;
  title: string;
  duration: string;
  body: string;
  icon: string;
  delay: number;
  inView: boolean;
}) {
  const Icon = ICONS[icon] ?? Phone;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className="cota-row group relative border-b border-border/60 transition-colors duration-500 hover:bg-card/40"
    >
      <div className="flex items-end gap-4 px-2 py-7 md:px-4 md:py-9">
        <span className="nums shrink-0 self-start pt-3 font-mono text-[11px] uppercase tracking-[0.22em] text-accent/80">
          {num}
        </span>
        <div className="flex-1">
          <h3 className="inline-flex items-center gap-4 font-serif text-2xl leading-tight tracking-tight md:text-[2rem]">
            <Icon className="size-5 text-accent/70 shrink-0" strokeWidth={1.5} />
            {title}
          </h3>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
            {body}
          </p>
        </div>
        <span aria-hidden className="cota-leader hidden md:block" />
        <span className="shrink-0 self-end pb-1 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          {duration}
        </span>
      </div>
    </motion.div>
  );
}
