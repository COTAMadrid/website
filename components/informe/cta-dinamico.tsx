import { buttonVariants } from '@/components/ui/button';
import type { Viability } from '@/lib/pricing/types';

export function CtaDinamico({ viability }: { viability: Viability }) {
  return (
    <div className="text-center mt-12">
      <a
        href={viability.cta.href}
        className={buttonVariants({ size: 'lg' }) + ' text-lg h-14 px-8'}
      >
        {viability.cta.label}
      </a>
    </div>
  );
}
