import { describe, expect, it } from 'vitest';
import { diagnose } from '@/lib/pricing/diagnose';
import type { WizardAnswers } from '@/lib/pricing/types';

const base: WizardAnswers = {
  tipo: 'integral',
  metros: 90,
  barrio: 'salamanca',
  antiguedad: '1980-2000',
  calidad: 'medio',
  estado: 'estrenar',
  plazo: '3-6-meses',
  extras: { sinAscensor: false, edificioProtegido: false, zonaBajasEmisiones: false },
};

describe('viability', () => {
  it('alta: standard integral mid-quality project', () => {
    expect(diagnose(base).viability.level).toBe('alta');
  });

  it('alta: integral with budget above min', () => {
    const d = diagnose({ ...base, presupuestoCliente: 200000 });
    expect(d.viability.level).toBe('alta');
  });

  it('media: urgente plazo', () => {
    expect(diagnose({ ...base, plazo: 'urgente' }).viability.level).toBe('media');
  });

  it('media: calidad basico', () => {
    expect(diagnose({ ...base, calidad: 'basico' }).viability.level).toBe('media');
  });

  it('baja: cocina-only', () => {
    expect(diagnose({ ...base, tipo: 'cocina' }).viability.level).toBe('baja');
  });

  it('baja: metros < 30', () => {
    expect(diagnose({ ...base, metros: 25 }).viability.level).toBe('baja');
  });
});
