import {
  ANTIGUEDAD_FACTOR,
  BARRIO_FACTOR,
  COST_STRUCTURE,
  ESTADO_FACTOR,
  EXTRA_FACTOR,
  ICIO_RATE,
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
  const icioRate = overrides?.icio_rate ?? ICIO_RATE;
  const costStructure = overrides?.cost_structure ?? COST_STRUCTURE;

  const range = pricePerM2[answers.calidad];
  const meanPerM2 = (range.min + range.max) / 2;

  // 1) Subtotal PEM (presupuesto de ejecución material)
  let pem = answers.metros * meanPerM2;
  pem *= barrioFactor[answers.barrio];
  pem *= antiguedadFactor[answers.antiguedad];
  pem *= plazoFactor[answers.plazo];
  pem *= estadoFactor[answers.estado];

  if (answers.extras.sinAscensor) pem *= extraFactor.sinAscensor;
  if (answers.extras.edificioProtegido) pem *= extraFactor.edificioProtegido;
  if (answers.extras.zonaBajasEmisiones) pem *= extraFactor.zonaBajasEmisiones;

  // 2) ICIO sobre el PEM
  const icio = pem * icioRate;
  const central = pem + icio;

  // 3) Range
  const min = roundTo(central * rangeSpread.lower, 1000);
  const max = roundTo(central * rangeSpread.upper, 1000);

  // 4) Cost structure breakdown over the central estimate (PEM only)
  const breakdown = {
    manoObra: Math.round(pem * costStructure.manoObra),
    materiales: Math.round(pem * costStructure.materiales),
    mediosAuxiliares: Math.round(pem * costStructure.mediosAuxiliares),
    estructuraMargen: Math.round(pem * costStructure.estructuraMargen),
  };

  return {
    min,
    max,
    central: Math.round(central),
    subtotalPem: Math.round(pem),
    icio: Math.round(icio),
    costStructure: breakdown,
  };
}
