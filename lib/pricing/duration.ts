import { DURATION_RULES } from '@/config/pricing';
import type { DurationEstimate, WizardAnswers } from '@/lib/pricing/types';

export function estimateDuration(answers: WizardAnswers): DurationEstimate {
  const rule = DURATION_RULES[answers.tipo];
  let weeksMin = answers.metros * rule.weeksMin;
  let weeksMax = answers.metros * rule.weeksMax;

  let stretch = 1;
  if (answers.extras.sinAscensor) stretch *= 1.1;
  if (answers.extras.edificioProtegido) stretch *= 1.15;
  if (answers.antiguedad === 'pre-1950') stretch *= 1.1;

  weeksMin *= stretch;
  weeksMax *= stretch;

  return {
    weeksMin: Math.max(2, Math.round(weeksMin)),
    weeksMax: Math.max(3, Math.round(weeksMax)),
  };
}
