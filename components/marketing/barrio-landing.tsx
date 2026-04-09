import Link from 'next/link';
import { ArrowRight, MapPin, Building2, Wrench } from 'lucide-react';
import { Divider } from './divider';
import { Testimonios } from './testimonios';

export interface BarrioLandingData {
  slug: string;
  nombre: string;
  /** Adjetivo en femenino (la zona "noble", "burguesa", "tranquila"…) */
  caracter: string;
  /** Tipología de finca dominante */
  tipologia: string;
  /** Particularidades técnicas que un constructor experto SABE del barrio */
  particularidades: string[];
  /** Lo que normalmente busca el cliente de este barrio */
  objetivos: string[];
  /** Rango de precio orientativo en €/m² */
  precioRango: { min: number; max: number };
}

export function BarrioLanding({ data }: { data: BarrioLandingData }) {
  return (
    <main className="relative overflow-hidden bg-background text-foreground">
        {/* Decorative grid background, same as /sobre-cota for consistency */}
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
          <div
            className="absolute -top-32 right-[-10%] size-[42rem] rounded-full opacity-[0.10] blur-3xl"
            style={{ background: 'oklch(0.78 0.14 80)' }}
          />
        </div>

        {/* HERO */}
        <section className="relative z-[1] px-6 pt-40 pb-16 md:pt-48 md:pb-24">
          <div className="mx-auto max-w-5xl">
            <div className="mb-6 flex items-center gap-3">
              <MapPin className="size-4 text-accent" />
              <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">
                Reformas en {data.nombre} · Madrid
              </span>
            </div>
            <h1 className="font-serif text-[2.4rem] leading-[1.04] tracking-[-0.025em] md:text-[4.5rem] lg:text-[5rem] text-balance">
              Reformar tu piso en{' '}
              <span className="italic text-accent">{data.nombre}</span> con
              quien conoce el barrio.
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-foreground/75 md:text-xl">
              {data.caracter} y con un parque de {data.tipologia.toLowerCase()},{' '}
              {data.nombre} tiene particularidades técnicas que conviene tener
              en cuenta antes de empezar. Las conocemos.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/5 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
                <span className="size-1.5 rounded-full bg-accent" />
                Rango orientativo: {data.precioRango.min}–{data.precioRango.max} €/m²
              </span>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/diagnostico"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-mono text-[11px] uppercase tracking-[0.22em] text-accent-foreground transition-transform hover:-translate-y-0.5"
              >
                Calcular mi reforma en {data.nombre}
                <ArrowRight className="size-3.5" />
              </Link>
              <Link
                href="/sobre-cota"
                className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent/80 hover:text-accent"
              >
                Cómo trabajamos →
              </Link>
            </div>
          </div>
        </section>

        <Divider variant="measure" label="El barrio · 01" />

        {/* PARTICULARIDADES */}
        <section className="relative z-[1] px-6 py-20 md:py-28">
          <div className="mx-auto max-w-6xl grid gap-12 md:grid-cols-12">
            <div className="md:col-span-5">
              <div className="mb-6 flex items-center gap-3">
                <Building2 className="size-4 text-accent" />
                <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">
                  Lo que nos encontramos en {data.nombre}
                </span>
              </div>
              <h2 className="font-serif text-[2rem] leading-[1.05] tracking-[-0.025em] md:text-[2.75rem] text-balance">
                No todos los pisos son iguales. Los de {data.nombre} menos.
              </h2>
            </div>
            <ul className="md:col-span-7 space-y-4">
              {data.particularidades.map((p, i) => (
                <li
                  key={i}
                  className="flex gap-4 rounded-md border border-border/60 bg-card/30 p-5"
                >
                  <span className="font-mono text-[10px] text-accent shrink-0 mt-0.5">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="text-base leading-relaxed text-foreground/85">{p}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <Divider variant="crosses" />

        {/* OBJETIVOS */}
        <section className="relative z-[1] px-6 py-20 md:py-28 bg-[var(--color-cream)]/85 text-[var(--color-cream-foreground)]">
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 max-w-2xl">
              <div className="mb-6 flex items-center gap-3">
                <Wrench className="size-4 text-[color:oklch(0.55_0.12_75)]" />
                <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-[color:oklch(0.55_0.12_75)]">
                  Lo que suelen pedirnos en {data.nombre}
                </span>
              </div>
              <h2 className="font-serif text-[2rem] leading-[1.05] tracking-[-0.025em] md:text-[2.75rem] text-balance">
                Las decisiones más comunes en una reforma del barrio.
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {data.objetivos.map((o, i) => (
                <div
                  key={i}
                  className="rounded-md border border-[var(--color-cream-border)] bg-white/70 p-5 shadow-editorial"
                >
                  <p className="text-base leading-relaxed">{o}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIOS reused */}
        <Testimonios />

        {/* CTA FINAL */}
        <section className="relative z-[1] px-6 py-24 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-serif text-[2.2rem] leading-[1.08] tracking-[-0.025em] md:text-[3rem] text-balance">
              ¿Reformas en {data.nombre}? Empieza por entenderlo bien.
            </h2>
            <p className="mt-6 text-lg text-foreground/75">
              Calcula el rango realista de tu reforma en menos de un minuto.
              Sin compromiso.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/diagnostico"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-mono text-[11px] uppercase tracking-[0.22em] text-accent-foreground transition-transform hover:-translate-y-0.5"
              >
                Empezar mi diagnóstico
                <ArrowRight className="size-3.5" />
              </Link>
              <Link
                href="/#agenda"
                className="inline-flex items-center gap-2 rounded-full border border-accent/40 px-6 py-3 font-mono text-[11px] uppercase tracking-[0.22em] text-accent hover:bg-accent/10"
              >
                Reservar una sesión
              </Link>
            </div>
          </div>
        </section>
      </main>
  );
}
