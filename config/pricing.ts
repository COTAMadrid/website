import type {
  Antiguedad,
  Barrio,
  Calidad,
  EstadoActual,
  Plazo,
} from '@/lib/pricing/types';

/**
 * €/m² ranges by quality level — Madrid 2026.
 * Validated by PCH Obras (10 years of operation).
 * Edit these values to recalibrate the engine.
 */
export const PRICE_PER_M2: Record<Calidad, { min: number; max: number }> = {
  basico: { min: 600, max: 850 },
  medio: { min: 850, max: 1200 },
  alto: { min: 1200, max: 1700 },
  premium: { min: 1700, max: 2500 },
};

export const BARRIO_FACTOR: Record<Barrio, number> = {
  salamanca: 1.15,
  chamberi: 1.15,
  justicia: 1.15,
  centro: 1.15,
  chamartin: 1.08,
  retiro: 1.08,
  moncloa: 1.08,
  tetuan: 1.0,
  arganzuela: 1.0,
  latina: 1.0,
  carabanchel: 1.0,
  otros: 1.0,
  'fuera-m30': 0.95,
};

export const ANTIGUEDAD_FACTOR: Record<Antiguedad, number> = {
  'pre-1950': 1.2,
  '1950-1980': 1.1,
  '1980-2000': 1.0,
  'post-2000': 0.95,
};

export const PLAZO_FACTOR: Record<Plazo, number> = {
  'sin-prisa': 0.95,
  '3-6-meses': 1.0,
  urgente: 1.15,
};

export const ESTADO_FACTOR: Record<EstadoActual, number> = {
  estrenar: 1.0,
  'vivido-obsoleto': 1.05,
  'parcial-reformado': 0.9,
};

export const EXTRA_FACTOR = {
  sinAscensor: 1.1,
  edificioProtegido: 1.1,
  zonaBajasEmisiones: 1.05,
} as const;

/**
 * Range spread applied to the central estimate to show as "X – Y".
 * 0.85 / 1.15 means ±15%.
 */
export const RANGE_SPREAD = { lower: 0.85, upper: 1.15 } as const;

/**
 * Duration estimate per m² (in weeks).
 * Crude rule: ~0.1 weeks/m² for integral, scaled down for partial scopes.
 */
export const DURATION_RULES = {
  integral: { weeksMin: 0.09, weeksMax: 0.13 },
  parcial: { weeksMin: 0.06, weeksMax: 0.09 },
  'zona-humeda': { weeksMin: 0.04, weeksMax: 0.06 },
  cocina: { weeksMin: 0.04, weeksMax: 0.06 },
} as const;
