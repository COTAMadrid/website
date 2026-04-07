'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
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

      <div className="relative mx-auto max-w-7xl px-6 py-20 md:py-28">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="font-mono text-[0.7rem] uppercase tracking-[0.22em] text-accent">
              📐 Calculadora · Gratis · 60 segundos
            </div>

            <h2
              id="budget-showcase-title"
              className="mt-6 font-serif text-5xl md:text-6xl leading-[1.02] tracking-[-0.025em] text-balance text-foreground"
            >
              Sabe cuánto puede costar tu reforma en 60 segundos
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

            <div className="mt-10 relative inline-block">
              <span
                aria-hidden
                className="absolute inset-0 rounded-lg bg-accent/40 blur-xl animate-pulse"
              />
              <Link
                href="/diagnostico"
                aria-label="Empezar mi cálculo gratuito"
                className={cn(
                  buttonVariants({ size: 'lg' }),
                  'relative h-16 px-12 text-base gap-3 bg-accent text-accent-foreground hover:bg-accent/90 transition-transform duration-300 hover:scale-[1.03] shadow-[0_20px_60px_-20px_oklch(0.78_0.12_80/0.6)]'
                )}
              >
                Empezar mi cálculo
                <ArrowRight className="size-5" />
              </Link>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              Análisis gratuito · 60 segundos
            </p>
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
            className="relative"
          >
            <div className="relative rounded-xl border border-border bg-card p-8 shadow-2xl">
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
                  className="mt-2 font-serif text-3xl md:text-4xl text-accent leading-tight"
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
                <span className="font-mono uppercase tracking-[0.14em] text-amber-300/90">
                  ⚠ Precio indicativo
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
