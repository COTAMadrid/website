'use client';

import { AnimatePresence, motion, useMotionValue, animate } from 'framer-motion';
import { useEffect, useState } from 'react';
import {
  ANTIGUEDAD_FACTOR,
  BARRIO_FACTOR,
  ESTADO_FACTOR,
  EXTRA_FACTOR,
  PLAZO_FACTOR,
  PRICE_PER_M2,
  RANGE_SPREAD,
} from '@/config/pricing';
import {
  ANTIGUEDAD_OPTIONS,
  BARRIO_OPTIONS,
  CALIDAD_OPTIONS,
  ESTADO_OPTIONS,
  PLAZO_OPTIONS,
} from '@/config/wizard';
import type { PartialAnswers } from '@/lib/wizard-state';
import { isComplete } from '@/lib/wizard-state';
import { evaluateViability } from '@/config/viability';
import { calculate } from '@/lib/pricing/calculate';
import { isBudgetUnrealistic } from '@/lib/pricing/viability-budget';

export interface ReceiptLine {
  id: string;
  label: string;
  factor?: string;
  delta: number;
  cumulative: number;
}

function fmtEur(n: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(Math.round(n));
}

function fmtDelta(n: number): string {
  const rounded = Math.round(n);
  if (rounded === 0) return '±0 €';
  const sign = rounded > 0 ? '+' : '−';
  return `${sign}${fmtEur(Math.abs(rounded)).replace('−', '')}`;
}

function roundTo(n: number, step: number): number {
  return Math.round(n / step) * step;
}

function labelOf<T extends string>(
  options: ReadonlyArray<{ value: T; label: string }>,
  value: T | undefined
): string {
  if (!value) return '';
  return options.find((o) => o.value === value)?.label ?? value;
}

export function buildReceipt(answers: PartialAnswers): {
  lines: ReceiptLine[];
  total: number;
  rangeMin: number;
  rangeMax: number;
} {
  const lines: ReceiptLine[] = [];

  if (typeof answers.metros !== 'number' || !answers.calidad) {
    return { lines, total: 0, rangeMin: 0, rangeMax: 0 };
  }

  const range = PRICE_PER_M2[answers.calidad];
  const meanPerM2 = (range.min + range.max) / 2;
  let cumulative = answers.metros * meanPerM2;
  const calidadLabel = labelOf(CALIDAD_OPTIONS, answers.calidad);

  lines.push({
    id: 'base',
    label: `Base · ${answers.metros} m² · ${calidadLabel}`,
    factor: `${Math.round(meanPerM2)} €/m²`,
    delta: cumulative,
    cumulative,
  });

  if (answers.barrio) {
    const f = BARRIO_FACTOR[answers.barrio];
    const prev = cumulative;
    cumulative *= f;
    lines.push({
      id: 'barrio',
      label: `Barrio · ${labelOf(BARRIO_OPTIONS, answers.barrio)}`,
      factor: `×${f.toFixed(2)}`,
      delta: cumulative - prev,
      cumulative,
    });
  }

  if (answers.antiguedad) {
    const f = ANTIGUEDAD_FACTOR[answers.antiguedad];
    const prev = cumulative;
    cumulative *= f;
    lines.push({
      id: 'antiguedad',
      label: `Antigüedad · ${labelOf(ANTIGUEDAD_OPTIONS, answers.antiguedad)}`,
      factor: `×${f.toFixed(2)}`,
      delta: cumulative - prev,
      cumulative,
    });
  }

  if (answers.plazo) {
    const f = PLAZO_FACTOR[answers.plazo];
    const prev = cumulative;
    cumulative *= f;
    lines.push({
      id: 'plazo',
      label: `Plazo · ${labelOf(PLAZO_OPTIONS, answers.plazo)}`,
      factor: `×${f.toFixed(2)}`,
      delta: cumulative - prev,
      cumulative,
    });
  }

  if (answers.estado) {
    const f = ESTADO_FACTOR[answers.estado];
    const prev = cumulative;
    cumulative *= f;
    lines.push({
      id: 'estado',
      label: `Estado · ${labelOf(ESTADO_OPTIONS, answers.estado)}`,
      factor: `×${f.toFixed(2)}`,
      delta: cumulative - prev,
      cumulative,
    });
  }

  const extras = answers.extras;
  if (extras?.sinAscensor) {
    const prev = cumulative;
    cumulative *= EXTRA_FACTOR.sinAscensor;
    lines.push({
      id: 'extra-sin-ascensor',
      label: 'Sin ascensor',
      factor: `×${EXTRA_FACTOR.sinAscensor.toFixed(2)}`,
      delta: cumulative - prev,
      cumulative,
    });
  }
  if (extras?.edificioProtegido) {
    const prev = cumulative;
    cumulative *= EXTRA_FACTOR.edificioProtegido;
    lines.push({
      id: 'extra-protegido',
      label: 'Edificio protegido',
      factor: `×${EXTRA_FACTOR.edificioProtegido.toFixed(2)}`,
      delta: cumulative - prev,
      cumulative,
    });
  }
  if (extras?.zonaBajasEmisiones) {
    const prev = cumulative;
    cumulative *= EXTRA_FACTOR.zonaBajasEmisiones;
    lines.push({
      id: 'extra-zbe',
      label: 'Zona Bajas Emisiones',
      factor: `×${EXTRA_FACTOR.zonaBajasEmisiones.toFixed(2)}`,
      delta: cumulative - prev,
      cumulative,
    });
  }

  return {
    lines,
    total: Math.round(cumulative),
    rangeMin: roundTo(cumulative * RANGE_SPREAD.lower, 1000),
    rangeMax: roundTo(cumulative * RANGE_SPREAD.upper, 1000),
  };
}

function AnimatedNumber({ value }: { value: number }) {
  const mv = useMotionValue(value);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const controls = animate(mv, value, {
      duration: 0.6,
      ease: 'easeOut',
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [value, mv]);

  return <span>{fmtEur(display)}</span>;
}

const PLACEHOLDER_LINES = [
  'Barrio',
  'Antigüedad',
  'Plazo',
  'Estado',
];

export interface ReceiptPanelProps {
  answers: PartialAnswers;
  onComplete?: () => void;
  generating?: boolean;
}

export function ReceiptPanel({ answers, onComplete, generating }: ReceiptPanelProps) {
  const { lines, total, rangeMin, rangeMax } = buildReceipt(answers);
  const hasBase = lines.length > 0;
  const allFilled = isComplete(answers);
  const viability = allFilled ? evaluateViability(answers, calculate(answers)) : null;

  const viabilityChip = viability
    ? viability.level === 'alta'
      ? { dot: 'bg-emerald-500', text: 'ALTA', cls: 'text-emerald-700' }
      : viability.level === 'media'
        ? { dot: 'bg-amber-500', text: 'MEDIA', cls: 'text-amber-700' }
        : { dot: 'bg-rose-500', text: 'BAJA', cls: 'text-rose-700' }
    : null;

  return (
    <aside
      aria-live="polite"
      aria-label="Estimación en tiempo real"
      className="bg-card border border-border rounded-lg shadow-sm p-6 font-mono text-sm"
    >
      <header className="border-b border-dashed border-border pb-3 mb-4">
        <div className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
          Tu reforma · Estimación
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          Cota Madrid · Cálculo en vivo
        </div>
      </header>

      {!hasBase && (
        <div className="text-muted-foreground text-xs leading-relaxed py-6 text-center">
          Empieza a responder y verás crecer tu presupuesto aquí, línea a línea.
          <div className="mt-4 space-y-2 opacity-50">
            <div>· · · · · · · · · · · ·</div>
            <div>· · · · · · · · · · · ·</div>
            <div>· · · · · · · · · · · ·</div>
          </div>
        </div>
      )}

      {hasBase && (
        <div className="space-y-2">
          <AnimatePresence initial={false}>
            {lines.map((line) => (
              <motion.div
                key={line.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="flex items-start justify-between gap-3 text-xs"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-foreground truncate">{line.label}</div>
                  {line.factor && (
                    <div className="text-[10px] text-muted-foreground">
                      {line.factor}
                    </div>
                  )}
                </div>
                <div className="text-right tabular-nums whitespace-nowrap">
                  {line.id === 'base' ? fmtEur(line.delta) : fmtDelta(line.delta)}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Placeholders for unfilled */}
          {!answers.barrio && hasBase && (
            <div className="text-[10px] text-muted-foreground/50 italic pt-1">
              · · · pendiente: barrio · · ·
            </div>
          )}

          <div className="border-t border-dashed border-border pt-3 mt-4">
            <div className="flex items-baseline justify-between">
              <div className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground">
                Rango estimado
              </div>
              {viabilityChip && (
                <div className={`flex items-center gap-1.5 text-[10px] ${viabilityChip.cls}`}>
                  <span className={`inline-block w-1.5 h-1.5 rounded-full ${viabilityChip.dot}`} />
                  Viabilidad {viabilityChip.text}
                </div>
              )}
            </div>
            <div
              className="mt-1 text-2xl font-semibold tabular-nums"
              style={{ color: 'oklch(0.72 0.13 75)' }}
            >
              <AnimatedNumber value={rangeMin} /> – <AnimatedNumber value={rangeMax} />
            </div>
            <div className="text-[10px] text-muted-foreground mt-1 tabular-nums">
              Central: {fmtEur(total)}
            </div>
          </div>

          {/* Soft budget viability warning (Option C — non-blocking) */}
          {isBudgetUnrealistic(answers.presupuestoRango, rangeMin) && (
            <div className="mt-4 rounded-md border border-amber-500/40 bg-amber-500/10 p-3 text-[11px] leading-relaxed text-amber-900 dark:text-amber-100">
              <div className="font-semibold mb-1">Una nota honesta</div>
              <div className="opacity-90">
                Para esta obra, el rango realista empieza alrededor de{' '}
                <span className="tabular-nums">{fmtEur(rangeMin)}</span>. Tu
                presupuesto está por debajo, así que conviene reajustar el
                alcance o las calidades. Sigue el diagnóstico — al final te
                explicamos las opciones, sin compromiso.
              </div>
            </div>
          )}
        </div>
      )}

      <footer className="border-t border-dashed border-border mt-5 pt-3 text-[10px] text-muted-foreground text-center">
        Cálculo en tiempo real · Cota Madrid
      </footer>

      {generating && (
        <div className="mt-4 text-center text-xs text-muted-foreground animate-pulse">
          Generando tu informe completo…
        </div>
      )}

      {allFilled && !generating && onComplete && (
        <button
          type="button"
          onClick={onComplete}
          className="mt-4 w-full rounded-md bg-foreground text-background py-2.5 text-xs font-sans font-medium tracking-wide hover:opacity-90 transition"
        >
          Ver informe completo →
        </button>
      )}
    </aside>
  );
}
