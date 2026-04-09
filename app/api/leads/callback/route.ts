import { NextResponse } from 'next/server';
import { z } from 'zod';
import { sql, isDbConfigured } from '@/lib/db/client';
import { sendLeadEmail } from '@/lib/leads/smtp';
import type { Lead } from '@/lib/leads/types';

export const runtime = 'nodejs';

const FRANJA_LABEL: Record<string, string> = {
  manana: 'por la mañana (9–14h)',
  tarde: 'por la tarde (14–18h)',
  'tarde-noche': 'a última hora (18–20h)',
  cualquiera: 'cuando podáis',
};

const schema = z.object({
  nombre: z.string().min(2).max(100),
  telefono: z.string().min(6).max(20),
  franja: z.enum(['manana', 'tarde', 'tarde-noche', 'cualquiera']),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 422 });
  }
  const { nombre, telefono, franja } = parsed.data;
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  const resumen = `Solicitud de llamada · prefiere ${FRANJA_LABEL[franja] ?? franja}`;

  // 1. Persist to PG (best-effort)
  if (isDbConfigured()) {
    try {
      await sql`
        INSERT INTO leads (
          id, created_at, nombre, email, telefono, resumen,
          tipo, score_value, score_quality, status_id, diagnosis
        ) VALUES (
          ${id}, ${createdAt}, ${nombre}, ${''}, ${telefono}, ${resumen},
          ${'callback'}, ${50}, ${'medio'}, ${'nuevo'},
          ${JSON.stringify({ kind: 'callback', franja })}
        )
      `;
    } catch (err) {
      console.error('[callback] PG insert failed', err);
    }
  }

  // 2. Send notify email so Paulo gets it in his inbox
  try {
    const fakeLead: Lead = {
      id,
      createdAt,
      contact: { nombre, email: '', telefono },
      resumen,
      score: { score: 50, quality: 'medio', reasons: ['Solicitud de llamada directa'] },
      diagnosis: {
        estimate: { min: 0, max: 0, central: 0 },
        duration: { weeksMin: 0, weeksMax: 0 },
        risks: [],
        viability: { level: 'media', microcopy: '', cta: { label: '', href: '' } },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        answers: { tipo: 'integral', metros: 0, barrio: 'salamanca' } as any,
      },
    };
    await sendLeadEmail(fakeLead);
  } catch (err) {
    console.error('[callback] email failed', err);
  }

  return NextResponse.json({ ok: true, id });
}
