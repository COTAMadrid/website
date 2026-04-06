import type { Viability } from '@/lib/pricing/types';

const STYLE = {
  alta: { dot: 'bg-success', text: 'text-success', label: 'Viabilidad alta' },
  media: { dot: 'bg-warning', text: 'text-warning', label: 'Viabilidad media' },
  baja: { dot: 'bg-danger', text: 'text-danger', label: 'No es la mejor opción' },
} as const;

export function Semaforo({ viability }: { viability: Viability }) {
  const s = STYLE[viability.level];
  return (
    <div className="flex items-start gap-4 p-6 rounded-xl border border-border bg-card">
      <div className={`h-4 w-4 rounded-full ${s.dot} mt-1.5 shrink-0`} />
      <div>
        <div className={`font-medium ${s.text}`}>{s.label}</div>
        <p className="text-muted-foreground mt-2">{viability.microcopy}</p>
      </div>
    </div>
  );
}
