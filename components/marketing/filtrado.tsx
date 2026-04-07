'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Check, X } from 'lucide-react';
import { COPY } from '@/content/copy';

const ACCEPT = [
  'Reformas integrales en Madrid',
  'Pisos previa visita técnica',
  'Presupuesto realista declarado',
  'Tiempos respetados por ambas partes',
];
const REJECT = [
  'Obras menores tipo "manitas"',
  'Proyectos sin acceso al inmueble',
  'Búsquedas de "el más barato"',
  'Plazos imposibles negociables',
];

export function Filtrado() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-120px' });

  return (
    <section
      ref={ref}
      id="filtrado"
      className="relative py-20 md:py-32 px-6 bg-[var(--color-cream)]/85 text-[var(--color-cream-foreground)] overflow-hidden"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-12 gap-y-12 md:gap-x-12">
        {/* Left — title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="col-span-12 md:col-span-5"
        >
          <div className="mb-6 flex items-center gap-4">
            <span className="h-px w-10 bg-[var(--color-cream-border)]" />
            <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--color-cream-muted)]">
              {COPY.filtrado.eyebrow}
            </span>
          </div>
          <h2 className="font-serif text-[2.2rem] leading-[1.02] tracking-[-0.03em] md:text-[2.8rem] lg:text-[3.25rem] text-balance max-w-[14ch]">
            {COPY.filtrado.title}
          </h2>
          <p className="mt-8 max-w-[44ch] text-base leading-relaxed text-[var(--color-cream-muted)]">
            {COPY.filtrado.body}
          </p>
          <p className="mt-6 font-serif text-xl italic md:text-2xl">
            {COPY.filtrado.closing}
          </p>

          {/* Stamped seal */}
          <div className="mt-10 inline-flex">
            <span className="cota-seal text-[color:oklch(0.45_0.12_75)]">
              Selección<br />Cota · 2026
            </span>
          </div>
        </motion.div>

        {/* Right — accept / reject criteria with dotted leaders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="col-span-12 md:col-span-7"
        >
          <div className="grid grid-cols-1 gap-y-12 md:grid-cols-2 md:gap-x-10">
            {/* SI */}
            <div>
              <div className="mb-6 flex items-center gap-3 font-mono text-[12px] uppercase tracking-[0.22em] text-[color:oklch(0.42_0.12_140)]">
                <span className="inline-flex size-6 items-center justify-center rounded-full border border-[color:oklch(0.42_0.12_140)]/40">
                  <Check className="size-3.5" strokeWidth={2} />
                </span>
                Sí trabajamos
              </div>
              <ul className="space-y-5">
                {ACCEPT.map((a) => (
                  <li key={a} className="flex items-end font-mono text-[14px] uppercase tracking-[0.12em] text-[var(--color-cream-foreground)]">
                    <span className="max-w-[24ch]">{a}</span>
                    <span className="cota-leader cream" />
                    <span className="text-[color:oklch(0.42_0.12_140)] font-semibold">SÍ</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* NO */}
            <div>
              <div className="mb-6 flex items-center gap-3 font-mono text-[12px] uppercase tracking-[0.22em] text-[color:oklch(0.45_0.18_25)]">
                <span className="inline-flex size-6 items-center justify-center rounded-full border border-[color:oklch(0.45_0.18_25)]/40">
                  <X className="size-3.5" strokeWidth={2} />
                </span>
                No trabajamos
              </div>
              <ul className="space-y-5">
                {REJECT.map((r) => (
                  <li key={r} className="flex items-end font-mono text-[14px] uppercase tracking-[0.12em] text-[var(--color-cream-foreground)]/80">
                    <span className="max-w-[24ch]">{r}</span>
                    <span className="cota-leader cream" />
                    <span className="text-[color:oklch(0.45_0.18_25)] font-semibold">NO</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
