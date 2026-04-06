import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { COPY } from '@/content/copy';

export function Cierre() {
  return (
    <section className="py-32 px-6">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl md:text-5xl mb-12">{COPY.cierre.title}</h2>
        <Link
          href="/diagnostico"
          className={cn(buttonVariants({ size: 'lg' }), 'h-14 text-lg px-8')}
        >
          {COPY.cierre.cta}
        </Link>
      </div>
    </section>
  );
}
