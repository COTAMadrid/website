import { COPY } from '@/content/copy';

export function Autoridad() {
  return (
    <section className="py-24 px-6">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-3xl md:text-5xl">{COPY.autoridad.title}</h2>
        <p className="mt-8 text-lg text-muted-foreground">{COPY.autoridad.body}</p>
        <p className="mt-6 text-xl">{COPY.autoridad.closing}</p>
      </div>
    </section>
  );
}
