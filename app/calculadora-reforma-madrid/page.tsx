import type { Metadata } from 'next';
import { CalculadoraLite } from './calculadora-lite';

export const metadata: Metadata = {
  title: 'Calculadora de reforma de piso en Madrid · Cota',
  description:
    'Calcula el precio orientativo de reformar tu piso en Madrid con 3 preguntas. Sin email, sin formularios largos. Resultado instantáneo y honesto.',
  alternates: {
    canonical: 'https://cotamadrid.es/calculadora-reforma-madrid',
  },
};

export default function Page() {
  return (
    <main className="relative overflow-hidden bg-background text-foreground">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-0">
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                'linear-gradient(to right, oklch(0.78 0.12 80) 1px, transparent 1px), linear-gradient(to bottom, oklch(0.78 0.12 80) 1px, transparent 1px)',
              backgroundSize: '64px 64px',
              maskImage:
                'radial-gradient(ellipse at center, black 30%, transparent 85%)',
              WebkitMaskImage:
                'radial-gradient(ellipse at center, black 30%, transparent 85%)',
            }}
          />
        </div>

        <section className="relative z-[1] px-6 pt-40 pb-12 md:pt-48">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-3">
              <span className="h-px w-10 bg-accent" />
              <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">
                Calculadora rápida · Reformas en Madrid
              </span>
              <span className="h-px w-10 bg-accent" />
            </div>
            <h1 className="font-serif text-[2.4rem] leading-[1.05] tracking-[-0.025em] md:text-[3.5rem] text-balance">
              ¿Cuánto cuesta reformar un piso en Madrid?
            </h1>
            <p className="mt-6 text-lg text-foreground/75 md:text-xl">
              Tres preguntas. Diez segundos. Un rango de precio orientativo
              honesto. Sin email, sin formularios.
            </p>
          </div>
        </section>

        <section className="relative z-[1] px-6 pb-24 md:pb-32">
          <CalculadoraLite />
        </section>
      </main>
  );
}
