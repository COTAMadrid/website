import { COPY } from '@/content/copy';

export function Escenarios() {
  return (
    <section className="py-24 px-6">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-3xl md:text-5xl mb-12 max-w-3xl">{COPY.escenarios.title}</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {COPY.escenarios.cards.map((c) => (
            <article key={c.title} className="p-8 rounded-xl border border-border bg-card">
              <h3 className="text-xl mb-4">{c.title}</h3>
              <p className="text-muted-foreground">{c.body}</p>
              <p className="mt-6 text-accent">{c.closing}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
