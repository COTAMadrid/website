import {
  ANTIGUEDAD_FACTOR,
  BARRIO_FACTOR,
  ESTADO_FACTOR,
  EXTRA_FACTOR,
  PLAZO_FACTOR,
  PRICE_PER_M2,
  RANGE_SPREAD,
} from '@/config/pricing';
import type { PriceEstimate, WizardAnswers } from '@/lib/pricing/types';
import type { PricingConfig } from '@/lib/db/repositories/pricing';

function roundTo(n: number, step: number): number {
  return Math.round(n / step) * step;
}

export function calculate(
  answers: WizardAnswers,
  overrides?: Partial<PricingConfig>
): PriceEstimate {
  const pricePerM2 = overrides?.price_per_m2 ?? PRICE_PER_M2;
  const barrioFactor = overrides?.barrio_factor ?? BARRIO_FACTOR;
  const antiguedadFactor = overrides?.antiguedad_factor ?? ANTIGUEDAD_FACTOR;
  const plazoFactor = overrides?.plazo_factor ?? PLAZO_FACTOR;
  const estadoFactor = overrides?.estado_factor ?? ESTADO_FACTOR;
  const extraFactor = overrides?.extra_factor ?? EXTRA_FACTOR;
  const rangeSpread = overrides?.range_spread ?? RANGE_SPREAD;

  const range = pricePerM2[answers.calidad];
  const meanPerM2 = (range.min + range.max) / 2;

  let central = answers.metros * meanPerM2;
  central *= barrioFactor[answers.barrio];
  central *= antiguedadFactor[answers.antiguedad];
  central *= plazoFactor[answers.plazo];
  central *= estadoFactor[answers.estado];

  if (answers.extras.sinAscensor) central *= extraFactor.sinAscensor;
  if (answers.extras.edificioProtegido) central *= extraFactor.edificioProtegido;
  if (answers.extras.zonaBajasEmisiones) central *= extraFactor.zonaBajasEmisiones;

  const min = roundTo(central * rangeSpread.lower, 1000);
  const max = roundTo(central * rangeSpread.upper, 1000);

  return { min, max, central: Math.round(central) };
}
