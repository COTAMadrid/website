import { evaluateRisks } from '@/config/risks';
import { evaluateViability } from '@/config/viability';
import { calculate } from '@/lib/pricing/calculate';
import { estimateDuration } from '@/lib/pricing/duration';
import type { Diagnosis, WizardAnswers } from '@/lib/pricing/types';

export function diagnose(answers: WizardAnswers): Diagnosis {
  const estimate = calculate(answers);
  const duration = estimateDuration(answers);
  const risks = evaluateRisks(answers);
  const viability = evaluateViability(answers, estimate);
  return { estimate, duration, risks, viability, answers };
}
