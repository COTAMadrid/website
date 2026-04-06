import type { Risk } from '@/lib/pricing/types';

const SEVERITY = {
  info: 'border-muted-foreground/30',
  warning: 'border-warning/60',
  critical: 'border-danger/60',
} as const;

export function Riesgos({ risks }: { risks: Risk[] }) {
  if (risks.length === 0) return null;
  return (
    <div>
      <h2 className="text-2xl mb-4">Riesgos detectados</h2>
      <div className="space-y-3">
        {risks.map((r) => (
          <div key={r.id} className={`p-4 rounded-lg border-l-4 bg-card ${SEVERITY[r.severity]}`}>
            <div className="font-medium">{r.title}</div>
            <p className="text-sm text-muted-foreground mt-1">{r.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
