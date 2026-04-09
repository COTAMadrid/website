import type { PriceEstimate } from '@/lib/pricing/types';

const fmt = (n: number) =>
  new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(n);

interface Props {
  estimate: PriceEstimate;
}

export function EstructuraCoste({ estimate }: Props) {
  const cs = estimate.costStructure;
  if (!cs) return null;

  const total = cs.manoObra + cs.materiales + cs.mediosAuxiliares + cs.estructuraMargen;

  const rows = [
    {
      label: 'Mano de obra',
      detail: 'Equipos en obra y oficios coordinados',
      amount: cs.manoObra,
      pct: total > 0 ? (cs.manoObra / total) * 100 : 0,
      color: 'oklch(0.78 0.12 80)',
    },
    {
      label: 'Materiales',
      detail: 'Acabados, sanitarios, instalaciones',
      amount: cs.materiales,
      pct: total > 0 ? (cs.materiales / total) * 100 : 0,
      color: 'oklch(0.65 0.15 75)',
    },
    {
      label: 'Medios auxiliares',
      detail: 'Logística, residuos, seguridad y vía pública',
      amount: cs.mediosAuxiliares,
      pct: total > 0 ? (cs.mediosAuxiliares / total) * 100 : 0,
      color: 'oklch(0.55 0.12 75)',
    },
    {
      label: 'Coordinación y margen',
      detail: 'Estructura, jefe de obra, imprevistos previstos',
      amount: cs.estructuraMargen,
      pct: total > 0 ? (cs.estructuraMargen / total) * 100 : 0,
      color: 'oklch(0.45 0.10 75)',
    },
  ];

  return (
    <section className="rounded-lg border border-border bg-card/30 p-6 md:p-8">
      <header className="mb-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
          Cómo se estructura el coste
        </p>
        <h2 className="mt-2 font-serif text-2xl tracking-[-0.01em]">
          Dónde va cada euro de la obra
        </h2>
        <p className="mt-2 text-sm text-foreground/70 max-w-prose">
          Sobre el presupuesto de ejecución material (sin contar el ICIO ni el
          margen comercial), un proyecto residencial sano se reparte
          aproximadamente así.
        </p>
      </header>

      <ul className="space-y-3">
        {rows.map((r) => (
          <li key={r.label}>
            <div className="flex items-baseline justify-between gap-3 text-sm mb-1.5">
              <div>
                <span className="font-medium">{r.label}</span>
                <span className="ml-2 text-xs text-foreground/55">{r.detail}</span>
              </div>
              <span className="tabular-nums whitespace-nowrap font-mono text-xs">
                {fmt(r.amount)} · {r.pct.toFixed(0)}%
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-foreground/5 overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${r.pct}%`,
                  backgroundColor: r.color,
                }}
              />
            </div>
          </li>
        ))}
      </ul>

      {estimate.icio !== undefined && estimate.subtotalPem !== undefined && (
        <div className="mt-6 pt-5 border-t border-dashed border-border space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-foreground/65">PEM (sin impuestos)</span>
            <span className="tabular-nums">{fmt(estimate.subtotalPem)}</span>
          </div>
          <div className="flex justify-between text-foreground/65">
            <span>+ ICIO Madrid 3,75%</span>
            <span className="tabular-nums">{fmt(estimate.icio)}</span>
          </div>
          <div className="flex justify-between font-medium pt-2 border-t border-border">
            <span>Total estimación central</span>
            <span className="tabular-nums">{fmt(estimate.central)}</span>
          </div>
        </div>
      )}

      <p className="mt-6 text-xs text-foreground/55 leading-relaxed">
        Esta estructura es orientativa y puede variar según el alcance real
        de tu proyecto. Los cambios decididos en obra (modificaciones de
        proyecto, mejoras durante la ejecución) suelen afectar entre un 20 y
        un 40% sobre las partidas afectadas — por eso siempre te lo
        explicamos antes de avanzar.
      </p>
    </section>
  );
}
