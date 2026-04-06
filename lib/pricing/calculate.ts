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

function roundTo(n: number, step: number): number {
  return Math.round(n / step) * step;
}

export function calculate(answers: WizardAnswers): PriceEstimate {
  const range = PRICE_PER_M2[answers.calidad];
  const meanPerM2 = (range.min + range.max) / 2;

  let central = answers.metros * meanPerM2;
  central *= BARRIO_FACTOR[answers.barrio];
  central *= ANTIGUEDAD_FACTOR[answers.antiguedad];
  central *= PLAZO_FACTOR[answers.plazo];
  central *= ESTADO_FACTOR[answers.estado];

  if (answers.extras.sinAscensor) central *= EXTRA_FACTOR.sinAscensor;
  if (answers.extras.edificioProtegido) central *= EXTRA_FACTOR.edificioProtegido;
  if (answers.extras.zonaBajasEmisiones) central *= EXTRA_FACTOR.zonaBajasEmisiones;

  const min = roundTo(central * RANGE_SPREAD.lower, 1000);
  const max = roundTo(central * RANGE_SPREAD.upper, 1000);

  return { min, max, central: Math.round(central) };
}
