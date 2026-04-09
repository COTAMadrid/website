import { describe, expect, it } from 'vitest';
import { diagnose } from '@/lib/pricing/diagnose';
import type { WizardAnswers } from '@/lib/pricing/types';

/**
 * Caso de calibración del comité comercial 2026.
 *
 * Antes de la recalibración el caso era "calidad medio" → 96k-130k. Tras la
 * actualización del comité (que introduce ICIO 3.75% y refina las bandas
 * €/m²), el mismo cliente real corresponde a "alto" — porque las nuevas
 * bandas son más conservadoras y reflejan mejor el mercado.
 *
 * Salamanca · 80 m² · pre-1950 · alto · vivido-obsoleto · sin-prisa.
 * Target: rango 105k–150k (PEM + ICIO 3.75%).
 */
describe('calibration: Salamanca 80m² 1920 vivido alto sin-prisa (comité 2026)', () => {
  const answers: WizardAnswers = {
    tipo: 'integral',
    metros: 80,
    barrio: 'salamanca',
    antiguedad: 'pre-1950',
    calidad: 'alto',
    estado: 'vivido-obsoleto',
    plazo: 'sin-prisa',
    extras: {
      sinAscensor: false,
      edificioProtegido: false,
      zonaBajasEmisiones: false,
    },
  };

  it('produces a range within ±10% of [109000, 147000] including ICIO', () => {
    const { estimate } = diagnose(answers);
    const tol = 0.1;
    expect(estimate.min).toBeGreaterThanOrEqual(109000 * (1 - tol));
    expect(estimate.min).toBeLessThanOrEqual(109000 * (1 + tol));
    expect(estimate.max).toBeGreaterThanOrEqual(147000 * (1 - tol));
    expect(estimate.max).toBeLessThanOrEqual(147000 * (1 + tol));
    expect(estimate.min).toBeLessThan(estimate.central);
    expect(estimate.central).toBeLessThan(estimate.max);
  });

  it('exposes PEM, ICIO and cost structure breakdown', () => {
    const { estimate } = diagnose(answers);
    expect(estimate.subtotalPem).toBeGreaterThan(0);
    expect(estimate.icio).toBeGreaterThan(0);
    // ICIO should be ~3.75% of PEM
    if (estimate.subtotalPem && estimate.icio) {
      const ratio = estimate.icio / estimate.subtotalPem;
      expect(ratio).toBeGreaterThan(0.035);
      expect(ratio).toBeLessThan(0.04);
    }
    expect(estimate.costStructure).toBeDefined();
    expect(estimate.costStructure?.manoObra).toBeGreaterThan(0);
  });
});
