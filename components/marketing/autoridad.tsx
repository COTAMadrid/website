import { COPY } from '@/content/copy';

export function Autoridad() {
  return (
    <section className="py-32 md:py-40 px-6">
      <div className="mx-auto max-w-6xl grid md:grid-cols-12 gap-10 items-start">
        <div className="md:col-span-3">
          <div className="text-xs uppercase tracking-[0.22em] text-accent">
            01 · Diagnóstico
          </div>
          <div className="mt-3 hidden md:block h-px w-12 bg-accent/60" />
        </div>
        <div className="md:col-span-9">
          <h2 className="font-serif text-4xl md:text-6xl leading-[1.05] tracking-[-0.02em] text-balance">
            {COPY.autoridad.title}
          </h2>
          <p className="mt-10 text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
            {COPY.autoridad.body}
          </p>
          <p className="mt-8 font-serif text-2xl md:text-3xl text-accent italic">
            {COPY.autoridad.closing}
          </p>
        </div>
      </div>
    </section>
  );
}
