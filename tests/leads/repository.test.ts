import { describe, it, expect, vi } from 'vitest';
import { processLead } from '@/lib/leads/repository';
import type { Lead, LeadRepository } from '@/lib/leads/types';

const fakeLead: Lead = {
  id: 'test-1',
  createdAt: new Date().toISOString(),
  contact: { nombre: 'Test', email: 't@t.com', telefono: '600000000' },
  diagnosis: {
    estimate: { min: 50000, max: 70000, central: 60000 },
    duration: { weeksMin: 8, weeksMax: 10 },
    risks: [],
    viability: { level: 'alta', microcopy: 'ok', cta: { label: 'x', href: '#' } },
    answers: {
      tipo: 'integral',
      metros: 80,
      barrio: 'chamberi',
      antiguedad: '1980-2000',
      calidad: 'medio',
      estado: 'estrenar',
      plazo: '3-6-meses',
      extras: { sinAscensor: false, edificioProtegido: false, zonaBajasEmisiones: false },
    },
  },
};

describe('processLead', () => {
  it('calls both save and notify on success', async () => {
    const save = vi.fn().mockResolvedValue(undefined);
    const notify = vi.fn().mockResolvedValue(undefined);
    const repo: LeadRepository = { save, notify };
    await processLead(fakeLead, repo);
    expect(save).toHaveBeenCalledOnce();
    expect(notify).toHaveBeenCalledOnce();
  });

  it('still calls notify even if save fails', async () => {
    const save = vi.fn().mockRejectedValue(new Error('sheets down'));
    const notify = vi.fn().mockResolvedValue(undefined);
    const repo: LeadRepository = { save, notify };
    await expect(processLead(fakeLead, repo)).rejects.toThrow();
    expect(notify).toHaveBeenCalledOnce();
  });

  it('still calls save even if notify fails', async () => {
    const save = vi.fn().mockResolvedValue(undefined);
    const notify = vi.fn().mockRejectedValue(new Error('resend down'));
    const repo: LeadRepository = { save, notify };
    await expect(processLead(fakeLead, repo)).rejects.toThrow();
    expect(save).toHaveBeenCalledOnce();
  });
});
