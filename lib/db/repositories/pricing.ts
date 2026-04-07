import { sql, isDbConfigured } from '../client';
import {
  PRICE_PER_M2,
  BARRIO_FACTOR,
  ANTIGUEDAD_FACTOR,
  PLAZO_FACTOR,
  ESTADO_FACTOR,
  EXTRA_FACTOR,
  RANGE_SPREAD,
} from '@/config/pricing';
import type {
  Antiguedad,
  Barrio,
  Calidad,
  EstadoActual,
  Plazo,
} from '@/lib/pricing/types';

export interface PricingConfig {
  price_per_m2: Record<Calidad, { min: number; max: number }>;
  barrio_factor: Record<Barrio, number>;
  antiguedad_factor: Record<Antiguedad, number>;
  plazo_factor: Record<Plazo, number>;
  estado_factor: Record<EstadoActual, number>;
  extra_factor: {
    sinAscensor: number;
    edificioProtegido: number;
    zonaBajasEmisiones: number;
  };
  range_spread: { lower: number; upper: number };
}

export const PRICING_DEFAULTS: PricingConfig = {
  price_per_m2: { ...PRICE_PER_M2 },
  barrio_factor: { ...BARRIO_FACTOR },
  antiguedad_factor: { ...ANTIGUEDAD_FACTOR },
  plazo_factor: { ...PLAZO_FACTOR },
  estado_factor: { ...ESTADO_FACTOR },
  extra_factor: { ...EXTRA_FACTOR },
  range_spread: { ...RANGE_SPREAD },
};

export async function getPricingConfig(): Promise<PricingConfig> {
  if (!isDbConfigured()) return PRICING_DEFAULTS;
  try {
    const { rows } = await sql`SELECT * FROM pricing_config WHERE id = 1 LIMIT 1`;
    if (rows.length === 0) return PRICING_DEFAULTS;
    const r = rows[0];
    return {
      price_per_m2: r.price_per_m2 ?? PRICING_DEFAULTS.price_per_m2,
      barrio_factor: r.barrio_factor ?? PRICING_DEFAULTS.barrio_factor,
      antiguedad_factor: r.antiguedad_factor ?? PRICING_DEFAULTS.antiguedad_factor,
      plazo_factor: r.plazo_factor ?? PRICING_DEFAULTS.plazo_factor,
      estado_factor: r.estado_factor ?? PRICING_DEFAULTS.estado_factor,
      extra_factor: r.extra_factor ?? PRICING_DEFAULTS.extra_factor,
      range_spread: r.range_spread ?? PRICING_DEFAULTS.range_spread,
    };
  } catch (err) {
    console.error('[db] getPricingConfig failed, falling back to defaults', err);
    return PRICING_DEFAULTS;
  }
}

export async function setPricingConfig(c: PricingConfig): Promise<void> {
  if (!isDbConfigured()) throw new Error('Base de datos no configurada (POSTGRES_URL)');
  await sql`
    INSERT INTO pricing_config (
      id, price_per_m2, barrio_factor, antiguedad_factor, plazo_factor,
      estado_factor, extra_factor, range_spread, updated_at
    ) VALUES (
      1,
      ${JSON.stringify(c.price_per_m2)}::jsonb,
      ${JSON.stringify(c.barrio_factor)}::jsonb,
      ${JSON.stringify(c.antiguedad_factor)}::jsonb,
      ${JSON.stringify(c.plazo_factor)}::jsonb,
      ${JSON.stringify(c.estado_factor)}::jsonb,
      ${JSON.stringify(c.extra_factor)}::jsonb,
      ${JSON.stringify(c.range_spread)}::jsonb,
      NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
      price_per_m2 = EXCLUDED.price_per_m2,
      barrio_factor = EXCLUDED.barrio_factor,
      antiguedad_factor = EXCLUDED.antiguedad_factor,
      plazo_factor = EXCLUDED.plazo_factor,
      estado_factor = EXCLUDED.estado_factor,
      extra_factor = EXCLUDED.extra_factor,
      range_spread = EXCLUDED.range_spread,
      updated_at = NOW()
  `;
}
