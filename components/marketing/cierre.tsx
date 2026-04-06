import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { COPY } from '@/content/copy';

export function Cierre() {
  return (
    <section className="relative py-40 md:py-56 px-6 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute left-1/2 top-1/2 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,oklch(0.78_0.12_80/0.16),transparent_70%)] blur-2xl" />
      </div>
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl leading-[1.05] tracking-[-0.025em] text-balance mb-14">
          {COPY.cierre.title}
        </h2>
        <Link
          href="/diagnostico"
          className={cn(
            buttonVariants({ size: 'lg' }),
            'h-16 text-base px-9 gap-2 group/cta shadow-[0_20px_60px_-20px_oklch(0.78_0.12_80/0.5)]'
          )}
        >
          {COPY.cierre.cta}
          <ArrowRight className="size-4 transition-transform duration-300 group-hover/cta:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}
