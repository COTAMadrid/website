import { Check } from 'lucide-react';
import { COPY } from '@/content/copy';

export function PropuestaValor() {
  return (
    <section className="relative py-32 md:py-40 px-6 bg-card overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:radial-gradient(oklch(1_0_0)_1px,transparent_1px)] [background-size:24px_24px]"
      />
      <div className="relative mx-auto max-w-4xl">
        <div className="text-xs uppercase tracking-[0.22em] text-accent mb-5">
          02 · Método
        </div>
        <h2 className="font-serif text-4xl md:text-6xl leading-[1.05] tracking-[-0.02em] mb-14 text-balance">
          {COPY.propuesta.title}
        </h2>
        <ul className="grid sm:grid-cols-2 gap-px bg-border/60 rounded-2xl overflow-hidden border border-border/60">
          {COPY.propuesta.bullets.map((b) => (
            <li
              key={b}
              className="group flex items-start gap-4 p-7 bg-card text-lg transition-colors duration-300 hover:bg-background"
            >
              <span className="mt-1 flex size-7 shrink-0 items-center justify-center rounded-full border border-accent/40 bg-accent/10 text-accent transition-all duration-300 group-hover:scale-110 group-hover:border-accent group-hover:bg-accent/20">
                <Check className="size-4" strokeWidth={2.5} />
              </span>
              <span className="leading-snug">{b}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
