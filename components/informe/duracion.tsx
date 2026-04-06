import type { DurationEstimate } from '@/lib/pricing/types';

export function Duracion({ duration }: { duration: DurationEstimate }) {
  return (
    <div className="text-center md:text-left">
      <p className="text-sm text-muted-foreground uppercase tracking-wider">Duración estimada</p>
      <p className="font-serif text-4xl md:text-5xl mt-2">
        {duration.weeksMin}–{duration.weeksMax} <span className="text-muted-foreground text-2xl">semanas</span>
      </p>
    </div>
  );
}
