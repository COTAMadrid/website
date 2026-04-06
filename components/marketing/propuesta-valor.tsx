import { Check } from 'lucide-react';
import { COPY } from '@/content/copy';

export function PropuestaValor() {
  return (
    <section className="py-24 px-6 bg-card">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-3xl md:text-5xl mb-12">{COPY.propuesta.title}</h2>
        <ul className="space-y-4">
          {COPY.propuesta.bullets.map((b) => (
            <li key={b} className="flex items-start gap-3 text-lg">
              <Check className="text-accent mt-1.5 shrink-0" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
