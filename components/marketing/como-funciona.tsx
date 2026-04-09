'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Search, BarChart3, Handshake } from 'lucide-react';
import { COPY } from '@/content/copy';

const STEP_ICONS = [Search, BarChart3, Handshake];
const STEP_DETAILS = [
  'Evaluamos el inmueble, tu presupuesto disponible y tus expectativas. Identificamos posibles problemas ocultos antes de comprometerte.',
  'Recibes un informe con rango de precio realista, duración estimada y riesgos detectados. Sin letra pequeña.',
  'Si el proyecto tiene sentido, diseñamos el plan de obra juntos. Si no, te lo decimos con transparencia.',
];

/**
 * Enhanced 3-column horizontal layout with icons and richer descriptions.
 */
export function ComoFunciona() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-120px' });

  return (
    <section
      ref={ref}
      id="como-funciona"
      className="relative isolate overflow-hidden bg-background px-6 py-20 md:py-28"
    >
      <div aria-hidden className="absolute inset-0 z-0 bg-background" />

      <div className="relative z-[1] mx-auto max-w-6xl">
        {/* Editorial header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14 grid grid-cols-12 items-end gap-y-6 md:mb-16"
        >
          <div className="col-span-12 md:col-span-8">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-8 bg-border" />
              <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
                {COPY.comoFunciona.eyebrow}
              </span>
            </div>
            <h2 className="font-serif text-[2rem] leading-[1.02] tracking-[-0.03em] md:text-[2.6rem] lg:text-[3rem] text-balance max-w-[16ch] text-foreground">
              {COPY.comoFunciona.title}
            </h2>
          </div>
          <div className="col-span-12 md:col-span-4 md:text-right">
            <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-foreground/70">
              03 fases · ~5 días
            </div>
            <div className="ml-auto mt-3 hidden h-px w-20 bg-accent/60 md:block" />
          </div>
        </motion.div>

        {/* 3-station horizontal rail */}
        <div className="relative">
          {/* Horizontal connecting rail (desktop only) */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-[16.6%] right-[16.6%] top-[2.5rem] hidden h-px md:block"
          >
            <div className="h-full w-full bg-[repeating-linear-gradient(to_right,oklch(0.78_0.12_80/0.55)_0_6px,transparent_6px_12px)]" />
          </div>

          <ol className="grid grid-cols-1 gap-14 md:grid-cols-3 md:gap-8">
            {COPY.comoFunciona.steps.map((s, i) => (
              <Step
                key={s.n}
                n={s.n}
                title={s.title}
                body={s.body}
                detail={STEP_DETAILS[i]}
                Icon={STEP_ICONS[i]}
                index={i}
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
  detail,
  Icon,
  index,
}: {
  n: string;
  title: string;
  body: string;
  detail: string;
  Icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  index: number;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { once: true, margin: '-15%' });

  return (
    <motion.li
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.7,
        delay: 0.1 + index * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="relative flex flex-col items-center text-center md:items-center"
    >
      {/* Circle node on the rail */}
      <span
        aria-hidden
        className="relative z-10 flex size-16 items-center justify-center rounded-full border border-accent/40 bg-background shadow-[0_0_0_4px_var(--color-background),0_0_24px_-4px_oklch(0.76_0.11_78/0.2)]"
      >
        <Icon className="size-6 text-accent" strokeWidth={1.5} />
      </span>

      {/* Step number */}
      <span className="mt-4 font-mono text-[0.6rem] uppercase tracking-[0.22em] text-accent/60">
        Paso {n}
      </span>

      {/* Title */}
      <h3 className="mt-2 font-serif text-2xl leading-tight tracking-tight text-foreground md:text-[1.6rem]">
        {title}
      </h3>

      {/* Hairline */}
      <div className="mt-3 h-px w-10 bg-accent/50" />

      {/* Short description */}
      <p className="mt-3 font-medium text-sm leading-relaxed text-foreground/80 md:text-base">
        {body}
      </p>

      {/* Extended detail */}
      <p className="mt-2 max-w-[34ch] text-[0.8rem] leading-relaxed text-foreground/50">
        {detail}
      </p>
    </motion.li>
  );
}
