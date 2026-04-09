import type {
  Antiguedad,
  Barrio,
  Calidad,
  EstadoActual,
  Plazo,
} from '@/lib/pricing/types';

/**
 * €/m² ranges by quality level — Madrid 2026.
 *
 * Calibrado por el comité comercial (abril 2026), aliñado con la Tabla 3
 * "Rango por tipo de obra":
 *   - basico   → "Lavado de cara / Reforma parcial seria"   200-450
 *   - medio    → "Integral funcional / estándar buena"      500-900
 *   - alto     → "Integral premium"                          950-1200
 *   - premium  → "Lujo alto o singular"                      1200-2000
 *
 * El wizard mantiene los mismos keys (basico/medio/alto/premium) por
 * compatibilidad con leads históricos, pero las etiquetas en la UI se
 * actualizan al lenguaje comercial nuevo.
 */
export const PRICE_PER_M2: Record<Calidad, { min: number; max: number }> = {
  basico: { min: 250, max: 450 },
  medio: { min: 500, max: 900 },
  alto: { min: 950, max: 1200 },
  premium: { min: 1200, max: 2000 },
};

/**
 * Multiplicadores de zona — calibrados con anclajes reales de precio de
 * vivienda (marzo 2026). Cuanto más caro el m² del barrio, más caro suele
 * salir reformar (acabados, exigencias de comunidad, logística).
 */
export const BARRIO_FACTOR: Record<Barrio, number> = {
  // Prime capital
  salamanca: 1.2,
  chamberi: 1.18,
  chamartin: 1.15,
  retiro: 1.15,
  // Centro histórico
  centro: 1.15,
  justicia: 1.15,
  // Residencial media-alta capital
  arganzuela: 1.05,
  moncloa: 1.05,
  tetuan: 1.0,
  // Capital ajustada
  latina: 0.95,
  carabanchel: 0.9,
  villaverde: 0.85,
  // Otros distritos capital
  otros: 1.0,
  // Municipios prime
  pozuelo: 1.1,
  majadahonda: 1.1,
  // Municipios medios
  getafe: 0.95,
  // Municipios ajustados
  alcala: 0.9,
  // Resto del área metropolitana
  'fuera-m30': 0.95,
};

/**
 * Antigüedad. Pre-1960 con instalaciones nuevas implica un sobrecoste real
 * del 10–20% según el comité; lo simplificamos en factores fijos.
 */
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

/**
 * Extras de Tabla 2 (ajustes recomendados por el comité).
 */
export const EXTRA_FACTOR = {
  sinAscensor: 1.1, // 3ª-5ª planta sin ascensor → +10%
  edificioProtegido: 1.12, // Patrimonio → +12%
  zonaBajasEmisiones: 1.05, // ZBE / restricciones de circulación → +5%
} as const;

/**
 * ICIO Madrid (Impuesto sobre Construcciones, Instalaciones y Obras).
 * Tipo único del 3,75% sobre el coste real y efectivo de la obra (PEM).
 * Lo aplicamos como línea visible al subtotal del cálculo.
 */
export const ICIO_RATE = 0.0375;

/**
 * Estructura de coste interna (referencia para el desglose del informe).
 * No afecta al cálculo del rango, solo se muestra al cliente para dar
 * credibilidad técnica. Total debe sumar 1.0.
 */
export const COST_STRUCTURE = {
  manoObra: 0.5, // 45-55%
  materiales: 0.35, // 35-45%
  mediosAuxiliares: 0.075, // 5-10%
  estructuraMargen: 0.075, // 5-15%
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
