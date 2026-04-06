import { COPY } from '@/content/copy';

export function ComoFunciona() {
  return (
    <section className="py-24 px-6 bg-card">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-3xl md:text-5xl mb-16 text-center">{COPY.comoFunciona.title}</h2>
        <div className="grid md:grid-cols-3 gap-12">
          {COPY.comoFunciona.steps.map((s) => (
            <div key={s.n}>
              <div className="font-serif text-5xl text-accent mb-4">{s.n}</div>
              <h3 className="text-2xl mb-2">{s.title}</h3>
              <p className="text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
