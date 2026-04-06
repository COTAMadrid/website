import { COPY } from '@/content/copy';

export function AgendaBlock() {
  return (
    <section id="agenda" className="py-24 px-6 bg-card">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-3xl md:text-5xl mb-12 text-center">{COPY.agenda.title}</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {COPY.agenda.options.map((o) => (
            <article key={o.title} className="p-8 rounded-xl border border-border text-center">
              <div className="text-4xl mb-4">{o.icon}</div>
              <h3 className="text-xl">{o.title}</h3>
              <p className="text-sm text-accent mt-1">{o.duration}</p>
              <p className="mt-4 text-muted-foreground">{o.body}</p>
            </article>
          ))}
        </div>
        <p className="mt-12 text-center text-sm text-muted-foreground">
          Solo trabajamos con un número limitado de proyectos al mes.
        </p>
      </div>
    </section>
  );
}
