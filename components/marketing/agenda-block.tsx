import { COPY } from '@/content/copy';
import { AgendaEmbed } from './agenda-embed';

export function AgendaBlock() {
  return (
    <section id="agenda" className="relative py-32 md:py-40 px-6 bg-card overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent"
      />
      <div className="relative mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <div className="text-xs uppercase tracking-[0.22em] text-accent mb-5">
            06 · Agenda
          </div>
          <h2 className="font-serif text-4xl md:text-6xl leading-[1.05] tracking-[-0.02em] text-balance">
            {COPY.agenda.title}
          </h2>
          <p className="mt-6 inline-flex items-center gap-2 text-sm text-muted-foreground">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
            Solo trabajamos con un número limitado de proyectos al mes
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {COPY.agenda.options.map((o) => (
            <article
              key={o.title}
              className="group relative flex flex-col items-center text-center p-10 rounded-2xl border border-border bg-background/40 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_30px_60px_-30px_oklch(0.78_0.12_80/0.25)]"
            >
              <div className="text-4xl mb-5 transition-transform duration-500 group-hover:scale-110">
                {o.icon}
              </div>
              <h3 className="font-serif text-2xl tracking-tight">{o.title}</h3>
              <p className="mt-2 text-xs uppercase tracking-[0.18em] text-accent">
                {o.duration}
              </p>
              <div className="my-5 h-px w-10 bg-border" />
              <p className="text-muted-foreground leading-relaxed">{o.body}</p>
            </article>
          ))}
        </div>
        <AgendaEmbed />
      </div>
    </section>
  );
}
