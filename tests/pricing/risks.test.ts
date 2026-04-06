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

const ids = (a: WizardAnswers) => diagnose(a).risks.map((r) => r.id);

describe('risks', () => {
  it('flags pre-1950 instalaciones + asbesto', () => {
    const r = ids({ ...base, antiguedad: 'pre-1950' });
    expect(r).toContain('instalaciones-obsoletas');
    expect(r).toContain('asbesto');
  });

  it('flags sin-ascensor', () => {
    const r = ids({ ...base, extras: { ...base.extras, sinAscensor: true } });
    expect(r).toContain('logistica-sin-ascensor');
  });

  it('flags edificio protegido', () => {
    const r = ids({ ...base, extras: { ...base.extras, edificioProtegido: true } });
    expect(r).toContain('patrimonio');
  });

  it('flags urgencia', () => {
    expect(ids({ ...base, plazo: 'urgente' })).toContain('urgencia');
  });

  it('always flags reserva-imprevistos for integral', () => {
    expect(ids(base)).toContain('reserva-imprevistos');
  });
});
