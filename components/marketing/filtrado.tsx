import { COPY } from '@/content/copy';

export function Filtrado() {
  return (
    <section className="py-24 px-6">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl md:text-5xl">{COPY.filtrado.title}</h2>
        <p className="mt-8 text-lg text-muted-foreground">{COPY.filtrado.body}</p>
        <p className="mt-6 text-xl">{COPY.filtrado.closing}</p>
      </div>
    </section>
  );
}
