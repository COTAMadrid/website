import { describe, expect, it } from 'vitest';
import { diagnose } from '@/lib/pricing/diagnose';
import type { WizardAnswers } from '@/lib/pricing/types';

describe('calibration: Salamanca 80m² 1920 vivido medio sin-prisa', () => {
  const answers: WizardAnswers = {
    tipo: 'integral',
    metros: 80,
    barrio: 'salamanca',
    antiguedad: 'pre-1950',
    calidad: 'medio',
    estado: 'vivido-obsoleto',
    plazo: 'sin-prisa',
    extras: {
      sinAscensor: false,
      edificioProtegido: false,
      zonaBajasEmisiones: false,
    },
  };

  it('produces a range within ±5% of [96000, 130000]', () => {
    const { estimate } = diagnose(answers);
    const tol = 0.05;
    expect(estimate.min).toBeGreaterThanOrEqual(96000 * (1 - tol));
    expect(estimate.min).toBeLessThanOrEqual(96000 * (1 + tol));
    expect(estimate.max).toBeGreaterThanOrEqual(130000 * (1 - tol));
    expect(estimate.max).toBeLessThanOrEqual(130000 * (1 + tol));
    expect(estimate.min).toBeLessThan(estimate.central);
    expect(estimate.central).toBeLessThan(estimate.max);
  });
});
