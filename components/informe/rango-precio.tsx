import { formatEUR } from '@/lib/utils';
import type { PriceEstimate } from '@/lib/pricing/types';

export function RangoPrecio({ estimate }: { estimate: PriceEstimate }) {
  return (
    <div className="text-center md:text-left">
      <p className="text-sm text-muted-foreground uppercase tracking-wider">Rango estimado</p>
      <p className="font-serif text-4xl md:text-5xl mt-2">
        {formatEUR(estimate.min)} <span className="text-muted-foreground">–</span> {formatEUR(estimate.max)}
      </p>
    </div>
  );
}
