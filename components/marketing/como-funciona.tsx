import { COPY } from '@/content/copy';

export function ComoFunciona() {
  return (
    <section className="relative py-32 md:py-40 px-6 bg-card overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent"
      />
      <div className="relative mx-auto max-w-6xl">
        <div className="text-center mb-20">
          <div className="text-xs uppercase tracking-[0.22em] text-accent mb-5">
            04 · Proceso
          </div>
          <h2 className="font-serif text-4xl md:text-6xl leading-[1.05] tracking-[-0.02em] text-balance">
            {COPY.comoFunciona.title}
          </h2>
        </div>

        <div className="relative grid md:grid-cols-3 gap-12 md:gap-8">
          {/* Connector line on desktop */}
          <div
            aria-hidden
            className="hidden md:block absolute top-8 left-[16.66%] right-[16.66%] h-px bg-gradient-to-r from-accent/0 via-accent/30 to-accent/0"
          />
          {COPY.comoFunciona.steps.map((s) => (
            <div key={s.n} className="group relative">
              <div className="relative flex md:justify-center mb-8">
                <div className="relative flex size-16 items-center justify-center rounded-full border border-accent/40 bg-card font-serif text-2xl text-accent transition-all duration-500 group-hover:border-accent group-hover:shadow-[0_0_40px_oklch(0.78_0.12_80/0.35)]">
                  {s.n}
                </div>
              </div>
              <div className="md:text-center">
                <h3 className="font-serif text-2xl md:text-3xl mb-3 tracking-tight">
                  {s.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed md:max-w-xs md:mx-auto">
                  {s.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
