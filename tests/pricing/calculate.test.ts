import { describe, expect, it } from 'vitest';
import { calculate } from '@/lib/pricing/calculate';
import type { WizardAnswers } from '@/lib/pricing/types';

const base: WizardAnswers = {
  tipo: 'integral',
  metros: 100,
  barrio: 'tetuan',
  antiguedad: '1980-2000',
  calidad: 'medio',
  estado: 'estrenar',
  plazo: '3-6-meses',
  extras: { sinAscensor: false, edificioProtegido: false, zonaBajasEmisiones: false },
};

describe('calculate', () => {
  it('returns min < central < max', () => {
    const r = calculate(base);
    expect(r.min).toBeLessThan(r.central);
    expect(r.central).toBeLessThan(r.max);
  });

  it('higher quality yields a higher central estimate', () => {
    const a = calculate(base);
    const b = calculate({ ...base, calidad: 'premium' });
    expect(b.central).toBeGreaterThan(a.central);
  });

  it('extras increase the central estimate', () => {
    const a = calculate(base);
    const b = calculate({
      ...base,
      extras: { sinAscensor: true, edificioProtegido: true, zonaBajasEmisiones: true },
    });
    expect(b.central).toBeGreaterThan(a.central);
  });

  it('rounds min and max to nearest 1000', () => {
    const r = calculate(base);
    expect(r.min % 1000).toBe(0);
    expect(r.max % 1000).toBe(0);
  });
});
