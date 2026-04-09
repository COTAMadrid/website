'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Ruler, TriangleAlert } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const BULLETS = [
  'Rango de precio realista',
  'Sin compromiso',
  'Detección de riesgos',
  'Análisis 100% gratuito',
];

export function BudgetShowcase() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      ref={ref}
      aria-labelledby="budget-showcase-title"
      className="relative bg-background overflow-hidden"
    >
      {/* Subtle grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_85%)]"
      />

      <div className="relative mx-auto max-w-7xl px-6 py-20 md:py-32">
        {/* Asymmetric grid: 7/5 split, copy gets the wider column */}
        <div className="grid md:grid-cols-12 gap-12 items-center">
          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="md:col-span-7 md:border-l md:border-border/40 md:pl-10"
          >
            <div className="inline-flex items-center gap-3 font-mono text-[0.65rem] uppercase tracking-[0.26em] text-accent">
              <Ruler className="size-3" strokeWidth={1.5} />
              Calculadora · Gratis · 60 s
            </div>

            <h2
              id="budget-showcase-title"
              className="mt-6 font-serif text-[2.4rem] md:text-5xl leading-[1.02] tracking-[-0.025em] text-balance text-foreground max-w-[16ch]"
            >
              Descubre cuánto puede costar tu reforma en 60 segundos
            </h2>

            <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed">
              Sin llamadas, sin formularios eternos. Responde unas preguntas y
              recibe un rango de precio realista, plazos y posibles riesgos.
            </p>

            <ul className="mt-8 space-y-3">
              {BULLETS.map((b) => (
                <li
                  key={b}
                  className="flex items-center gap-3 text-foreground/90"
                >
                  <span className="inline-flex size-6 items-center justify-center rounded-full bg-accent/15 text-accent">
                    <Check className="size-3.5" strokeWidth={3} />
                  </span>
                  <span className="text-base">{b}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-wrap items-center gap-5">
              <Link
                href="/diagnostico"
                aria-label="Empezar mi cálculo gratuito"
                className="cota-numlink"
              >
                <span className="idx">01</span>
                <span>Empezar mi cálculo</span>
                <ArrowRight className="arrow size-3.5" strokeWidth={1.5} />
              </Link>
              <span className="font-mono text-[0.65rem] uppercase tracking-[0.22em] text-muted-foreground">
                Sin compromiso
              </span>
            </div>
          </motion.div>

          {/* RIGHT — Preview card */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{
              duration: 0.9,
              delay: 0.15,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative md:col-span-5 md:rotate-[1.6deg] md:translate-x-4 md:translate-y-2 will-change-transform"
          >
            <div className="relative rounded-2xl border border-white/10 bg-[oklch(0.2_0.016_168/0.75)] backdrop-blur-md p-8 shadow-editorial">
              <div className="font-mono text-[0.65rem] uppercase tracking-[0.22em] text-muted-foreground">
                Ejemplo real
              </div>
              <div className="mt-3 h-px w-full bg-border" />

              <div className="mt-5 text-sm text-card-foreground/90">
                Piso 80 m² · Salamanca · 1920 · medio-bueno
              </div>

              <div className="mt-5 h-px w-full bg-border" />

              <div className="mt-6">
                <div className="font-mono text-[0.6rem] uppercase tracking-[0.22em] text-muted-foreground">
                  Rango estimado
                </div>
                <motion.div
                  animate={{ opacity: [0.85, 1, 0.85] }}
                  transition={{
                    duration: 2.6,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="nums mt-2 font-serif text-3xl md:text-[2.25rem] text-accent leading-tight"
                >
                  96.000 € – 130.000 €
                </motion.div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <div>
                  <div className="font-mono text-[0.6rem] uppercase tracking-[0.22em] text-muted-foreground">
                    Duración
                  </div>
                  <div className="mt-1 text-sm text-card-foreground">
                    8 – 10 semanas
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[0.7rem] text-emerald-400">
                  <span className="size-1.5 rounded-full bg-emerald-400" />
                  Viable
                </span>
              </div>

              <div className="mt-8 h-px w-full bg-border" />

              {/* Disclaimer block */}
              <div className="mt-4 rounded-md border border-amber-500/25 bg-amber-500/5 p-3 text-[0.7rem] leading-relaxed text-amber-200/90">
                <span className="inline-flex items-center gap-1.5 font-mono uppercase tracking-[0.16em] text-amber-300/90">
                  <TriangleAlert className="size-3" strokeWidth={1.75} />
                  Precio indicativo
                </span>
                <p className="mt-1 text-amber-100/80">
                  Rango orientativo basado en datos del mercado. El precio
                  cerrado se entrega tras una visita técnica al inmueble.
                </p>
              </div>

              <div className="mt-4 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-muted-foreground">
                Cálculo en tiempo real · Cota
              </div>

              {/* Decorative corner */}
              <div
                aria-hidden
                className="absolute -bottom-2 -right-2 h-12 w-12 border-b border-r border-accent"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
