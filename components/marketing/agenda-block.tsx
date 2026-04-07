'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import Image from 'next/image';
import { Phone, Monitor, Home, Check } from 'lucide-react';
import { COPY } from '@/content/copy';
import { AgendaCalendar } from './agenda-calendar';

interface AgendaBlockProps {
  timeSlots?: string[];
  blockedDates?: string[];
  blockedWeekdays?: number[];
}

const ICONS: Record<string, typeof Phone> = { Phone, Monitor, Home };

export function AgendaBlock({
  timeSlots,
  blockedDates,
  blockedWeekdays,
}: AgendaBlockProps = {}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-120px' });
  const [selectedKind, setSelectedKind] = useState<string>(
    COPY.agenda.options[0].title
  );

  return (
    <section
      id="agenda"
      ref={ref}
      className="relative isolate overflow-hidden bg-background px-6 py-16 md:py-24"
    >
      {/* Solid opaque cover blocks the global blueprint */}
      <div aria-hidden className="absolute inset-0 z-0 bg-background" />
      {/* Textural background image */}
      <div aria-hidden className="absolute inset-0 z-[1]">
        <Image
          src={COPY.agenda.image}
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-[0.07]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/85 to-background" />
      </div>

      <div className="relative z-[2] mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 md:mb-12"
        >
          <div className="mb-6 flex items-center gap-4">
            <span className="h-px w-10 bg-border" />
            <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">
              {COPY.agenda.eyebrow}
            </span>
          </div>
          <h2 className="max-w-3xl font-serif text-[2.2rem] leading-[1.04] tracking-[-0.025em] md:text-5xl lg:text-[3.25rem] text-balance text-foreground">
            {COPY.agenda.title}
          </h2>
          <p className="mt-5 max-w-xl text-sm text-foreground/65 md:text-base">
            Elige el tipo de sesión, una fecha disponible y una hora. Te confirmamos por email.
          </p>
        </motion.div>

        {/* 2-col split: meeting types + calendar */}
        <div className="grid gap-10 md:grid-cols-2 md:gap-12">
          <div>
            {/* Step label */}
            <div className="mb-4 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.24em] text-foreground/60">
              <span className="inline-flex size-5 items-center justify-center rounded-full border border-accent/40 text-accent">1</span>
              Elige el tipo de sesión
            </div>

            <div className="space-y-3">
              {COPY.agenda.options.map((o, i) => (
                <MeetingOption
                  key={o.title}
                  num={String(i + 1).padStart(2, '0')}
                  title={o.title}
                  duration={o.duration}
                  body={o.body}
                  icon={o.icon}
                  delay={0.1 + i * 0.08}
                  inView={inView}
                  selected={selectedKind === o.title}
                  onSelect={() => setSelectedKind(o.title)}
                />
              ))}
            </div>

            {/* Scarcity microcopy */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-8 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-foreground/60"
            >
              <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
              Solo un número limitado de proyectos al mes
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Step label */}
            <div className="mb-4 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.24em] text-foreground/60">
              <span className="inline-flex size-5 items-center justify-center rounded-full border border-accent/40 text-accent">2</span>
              Reserva fecha y hora
            </div>
            <AgendaCalendar
              timeSlots={timeSlots}
              blockedDates={blockedDates}
              blockedWeekdays={blockedWeekdays}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function MeetingOption({
  num,
  title,
  duration,
  body,
  icon,
  delay,
  inView,
  selected,
  onSelect,
}: {
  num: string;
  title: string;
  duration: string;
  body: string;
  icon: string;
  delay: number;
  inView: boolean;
  selected: boolean;
  onSelect: () => void;
}) {
  const Icon = ICONS[icon] ?? Phone;
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      aria-pressed={selected}
      className={`group relative w-full text-left rounded-lg border transition-all duration-300 ${
        selected
          ? 'border-accent bg-accent/10 shadow-[0_8px_32px_-12px_oklch(0.78_0.12_80/0.4)]'
          : 'border-border/60 bg-card/40 hover:border-accent/50 hover:bg-card/70'
      }`}
    >
      <div className="flex items-start gap-4 p-5">
        {/* Icon badge */}
        <div
          className={`flex size-11 shrink-0 items-center justify-center rounded-md transition-colors ${
            selected
              ? 'bg-accent text-accent-foreground'
              : 'bg-card border border-border/60 text-accent/80'
          }`}
        >
          <Icon className="size-5" strokeWidth={1.75} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-serif text-xl tracking-tight text-foreground md:text-2xl">
              {title}
            </h3>
            <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/55">
              {duration}
            </span>
          </div>
          <p className="mt-1.5 text-sm text-foreground/70">{body}</p>
        </div>

        {/* Selected indicator */}
        <div
          className={`mt-1 flex size-5 shrink-0 items-center justify-center rounded-full transition-all ${
            selected
              ? 'bg-accent text-accent-foreground scale-100'
              : 'border border-border/60 bg-transparent scale-95'
          }`}
        >
          {selected && <Check className="size-3" strokeWidth={3} />}
        </div>
      </div>

      {/* Bottom hairline accent — gold when selected */}
      <span
        aria-hidden
        className={`absolute bottom-0 left-5 right-5 h-px transition-colors ${
          selected ? 'bg-accent/70' : 'bg-transparent'
        }`}
      />

      {/* Numero in bottom-right corner */}
      <span className="absolute bottom-2 right-3 font-mono text-[9px] uppercase tracking-[0.22em] text-foreground/35">
        {num}
      </span>
    </motion.button>
  );
}
