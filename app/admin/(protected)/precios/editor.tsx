'use client';

import { useState } from 'react';
import type { PricingConfig } from '@/lib/db/repositories/pricing';
import { PRICING_DEFAULTS } from '@/lib/db/repositories/pricing';

export function PreciosEditor({ initial }: { initial: PricingConfig }) {
  const [config, setConfig] = useState<PricingConfig>(initial);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);

  async function save() {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/admin/pricing', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config }),
      });
      const data = await res.json();
      if (!res.ok) setMessage({ kind: 'error', text: data.error || 'Error al guardar' });
      else setMessage({ kind: 'ok', text: 'Guardado correctamente' });
    } catch {
      setMessage({ kind: 'error', text: 'Error de red' });
    } finally {
      setSaving(false);
    }
  }

  function num(v: string): number {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }

  return (
    <div className="space-y-10">
      {/* Price per m² */}
      <section>
        <h2 className="text-lg font-semibold mb-3">€/m² por nivel de calidad</h2>
        <div className="space-y-2">
          {Object.entries(config.price_per_m2).map(([k, range]) => (
            <div key={k} className="flex items-center gap-3">
              <span className="w-24 text-sm font-mono">{k}</span>
              <input
                type="number"
                value={range.min}
                onChange={(e) =>
                  setConfig((c) => ({
                    ...c,
                    price_per_m2: {
                      ...c.price_per_m2,
                      [k]: { ...range, min: num(e.target.value) },
                    },
                  }))
                }
                className="h-9 px-2 w-28 rounded-md border border-border bg-background text-sm"
              />
              <span className="text-muted-foreground">—</span>
              <input
                type="number"
                value={range.max}
                onChange={(e) =>
                  setConfig((c) => ({
                    ...c,
                    price_per_m2: {
                      ...c.price_per_m2,
                      [k]: { ...range, max: num(e.target.value) },
                    },
                  }))
                }
                className="h-9 px-2 w-28 rounded-md border border-border bg-background text-sm"
              />
              <span className="text-xs text-muted-foreground">€/m²</span>
            </div>
          ))}
        </div>
      </section>

      <FactorTable
        title="Factor por barrio"
        record={config.barrio_factor}
        onChange={(r) => setConfig((c) => ({ ...c, barrio_factor: r }))}
      />
      <FactorTable
        title="Factor por antigüedad"
        record={config.antiguedad_factor}
        onChange={(r) => setConfig((c) => ({ ...c, antiguedad_factor: r }))}
      />
      <FactorTable
        title="Factor por plazo"
        record={config.plazo_factor}
        onChange={(r) => setConfig((c) => ({ ...c, plazo_factor: r }))}
      />
      <FactorTable
        title="Factor por estado"
        record={config.estado_factor}
        onChange={(r) => setConfig((c) => ({ ...c, estado_factor: r }))}
      />

      <section>
        <h2 className="text-lg font-semibold mb-3">Factores extra</h2>
        <div className="space-y-2">
          {(['sinAscensor', 'edificioProtegido', 'zonaBajasEmisiones'] as const).map((k) => (
            <div key={k} className="flex items-center gap-3">
              <span className="w-48 text-sm font-mono">{k}</span>
              <input
                type="number"
                step="0.01"
                value={config.extra_factor[k]}
                onChange={(e) =>
                  setConfig((c) => ({
                    ...c,
                    extra_factor: { ...c.extra_factor, [k]: num(e.target.value) },
                  }))
                }
                className="h-9 px-2 w-28 rounded-md border border-border bg-background text-sm"
              />
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-1">ICIO Madrid</h2>
        <p className="text-xs text-muted-foreground mb-3">
          Impuesto sobre Construcciones, Instalaciones y Obras del Ayuntamiento
          de Madrid. Se aplica sobre el PEM y aparece como línea visible al
          cliente. Tipo oficial actual: 3,75 % (= 0.0375).
        </p>
        <div className="flex items-center gap-3">
          <input
            type="number"
            step="0.0001"
            value={config.icio_rate}
            onChange={(e) =>
              setConfig((c) => ({ ...c, icio_rate: num(e.target.value) }))
            }
            className="h-9 px-2 w-32 rounded-md border border-border bg-background text-sm"
          />
          <span className="text-xs text-muted-foreground">
            ({(config.icio_rate * 100).toFixed(2)} %)
          </span>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-1">Estructura de coste</h2>
        <p className="text-xs text-muted-foreground mb-3">
          Reparto orientativo que se muestra al cliente en el informe (no
          afecta al cálculo del rango). La suma debería estar cerca de 1.0.
        </p>
        <div className="space-y-2">
          {(['manoObra', 'materiales', 'mediosAuxiliares', 'estructuraMargen'] as const).map(
            (k) => (
              <div key={k} className="flex items-center gap-3">
                <span className="w-44 text-sm font-mono">{k}</span>
                <input
                  type="number"
                  step="0.01"
                  value={config.cost_structure[k]}
                  onChange={(e) =>
                    setConfig((c) => ({
                      ...c,
                      cost_structure: {
                        ...c.cost_structure,
                        [k]: num(e.target.value),
                      },
                    }))
                  }
                  className="h-9 px-2 w-28 rounded-md border border-border bg-background text-sm"
                />
                <span className="text-xs text-muted-foreground">
                  ({(config.cost_structure[k] * 100).toFixed(0)} %)
                </span>
              </div>
            )
          )}
          <p className="text-xs text-muted-foreground pt-1">
            Suma actual:{' '}
            <span className="font-mono">
              {(
                config.cost_structure.manoObra +
                config.cost_structure.materiales +
                config.cost_structure.mediosAuxiliares +
                config.cost_structure.estructuraMargen
              ).toFixed(2)}
            </span>
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">Range spread (±)</h2>
        <div className="flex items-center gap-3">
          <label className="text-sm flex items-center gap-2">
            Inferior
            <input
              type="number"
              step="0.01"
              value={config.range_spread.lower}
              onChange={(e) =>
                setConfig((c) => ({
                  ...c,
                  range_spread: { ...c.range_spread, lower: num(e.target.value) },
                }))
              }
              className="h-9 px-2 w-28 rounded-md border border-border bg-background text-sm"
            />
          </label>
          <label className="text-sm flex items-center gap-2">
            Superior
            <input
              type="number"
              step="0.01"
              value={config.range_spread.upper}
              onChange={(e) =>
                setConfig((c) => ({
                  ...c,
                  range_spread: { ...c.range_spread, upper: num(e.target.value) },
                }))
              }
              className="h-9 px-2 w-28 rounded-md border border-border bg-background text-sm"
            />
          </label>
        </div>
      </section>

      <div className="flex items-center gap-3 sticky bottom-0 bg-background py-3 border-t border-border">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="h-10 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/80 disabled:opacity-50"
        >
          {saving ? 'Guardando...' : 'Guardar cambios'}
        </button>
        <button
          type="button"
          onClick={() => {
            if (
              confirm(
                'Restaurar todos los valores a los del comité comercial 2026? (Tendrás que pulsar Guardar después.)'
              )
            ) {
              setConfig(PRICING_DEFAULTS);
            }
          }}
          className="h-10 px-4 rounded-md border border-border text-sm hover:bg-muted"
        >
          Restaurar valores comité 2026
        </button>
        {message && (
          <p
            role="status"
            className={
              message.kind === 'ok' ? 'text-sm text-emerald-600' : 'text-sm text-destructive'
            }
          >
            {message.text}
          </p>
        )}
      </div>
    </div>
  );
}

function FactorTable<K extends string>({
  title,
  record,
  onChange,
}: {
  title: string;
  record: Record<K, number>;
  onChange: (r: Record<K, number>) => void;
}) {
  return (
    <section>
      <h2 className="text-lg font-semibold mb-3">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {Object.entries(record).map(([k, v]) => (
          <div key={k} className="flex items-center gap-3">
            <span className="flex-1 text-sm font-mono truncate">{k}</span>
            <input
              type="number"
              step="0.01"
              value={v as number}
              onChange={(e) => {
                const n = Number(e.target.value);
                onChange({ ...record, [k]: Number.isFinite(n) ? n : 0 } as Record<K, number>);
              }}
              className="h-9 px-2 w-24 rounded-md border border-border bg-background text-sm"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
