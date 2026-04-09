import { NextResponse } from 'next/server';
import { z } from 'zod';
import { diagnose } from '@/lib/pricing/diagnose';
import { processLead } from '@/lib/leads/repository';
import type { Lead } from '@/lib/leads/types';
import { scoreLead } from '@/lib/pricing/viability-budget';

export const runtime = 'nodejs';

const schema = z.object({
  contact: z.object({
    nombre: z.string().min(2).max(100),
    email: z.string().email(),
    telefono: z.string().min(6).max(20),
    localidad: z.string().min(2).max(100).optional(),
  }),
  resumen: z.string().max(2000).optional(),
  answers: z.object({
    tipo: z.enum(['integral', 'parcial', 'zona-humeda', 'cocina']),
    metros: z.number().int().min(15).max(1000),
    barrio: z.string(),
    antiguedad: z.enum(['pre-1950', '1950-1980', '1980-2000', 'post-2000']),
    calidad: z.enum(['basico', 'medio', 'alto', 'premium']),
    estado: z.enum(['estrenar', 'vivido-obsoleto', 'parcial-reformado']),
    plazo: z.enum(['sin-prisa', '3-6-meses', 'urgente']),
    extras: z.object({
      sinAscensor: z.boolean(),
      edificioProtegido: z.boolean(),
      zonaBajasEmisiones: z.boolean(),
    }),
    presupuestoCliente: z.number().optional(),
    presupuestoRango: z
      .enum(['menos-40', '40-80', '80-150', '150-mas', 'no-se'])
      .optional(),
    urgencia: z
      .enum(['este-mes', '1-3-meses', '3-6-meses', 'sin-fecha'])
      .optional(),
  }),
  source: z
    .object({
      utm_source: z.string().optional(),
      utm_medium: z.string().optional(),
      utm_campaign: z.string().optional(),
      referrer: z.string().optional(),
    })
    .optional(),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const { contact, answers, source, resumen } = parsed.data;
  // The wizard already produced the diagnosis client-side, but we re-run server-side
  // so we never trust the client's calculated numbers.
  const diagnosis = diagnose({ ...answers, contacto: contact } as never);

  const score = scoreLead(
    diagnosis.answers,
    diagnosis.estimate.min,
    diagnosis.estimate.max
  );

  const lead: Lead = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    contact,
    resumen,
    diagnosis,
    source,
    score,
  };

  try {
    await processLead(lead);
  } catch (err) {
    console.error('[leads] processing failed', err);
    return NextResponse.json(
      { error: 'Lead processing partially failed' },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, id: lead.id });
}
