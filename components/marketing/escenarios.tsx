import { COPY } from '@/content/copy';

export function Escenarios() {
  return (
    <section className="py-32 md:py-40 px-6">
      <div className="mx-auto max-w-6xl">
        <div className="text-xs uppercase tracking-[0.22em] text-accent mb-5">
          03 · Casos reales
        </div>
        <h2 className="font-serif text-4xl md:text-6xl leading-[1.05] tracking-[-0.02em] mb-16 max-w-3xl text-balance">
          {COPY.escenarios.title}
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {COPY.escenarios.cards.map((c, i) => (
            <article
              key={c.title}
              className="group relative flex flex-col p-8 rounded-2xl border border-border bg-card/60 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:border-accent/40 hover:bg-card hover:shadow-[0_30px_60px_-30px_oklch(0.78_0.12_80/0.25)]"
            >
              <div className="absolute -top-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-accent/0 to-transparent transition-all duration-500 group-hover:via-accent/60" />
              <div className="font-serif text-sm text-accent/70 tracking-widest mb-6">
                {String(i + 1).padStart(2, '0')}
              </div>
              <h3 className="font-serif text-2xl leading-snug mb-5 tracking-tight">
                {c.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed flex-1">{c.body}</p>
              <div className="mt-8 pt-6 border-t border-border/60">
                <p className="text-accent text-sm tracking-wide">{c.closing}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
