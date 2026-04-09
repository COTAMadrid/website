import { NextResponse } from 'next/server';
import {
  getLead,
  listNotes,
  updateLeadStatus,
} from '@/lib/db/repositories/leads';
import { isDbConfigured } from '@/lib/db/client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(_req: Request, context: { params: Promise<{ id: string }> }) {
  if (!isDbConfigured()) {
    return NextResponse.json({ error: 'DB no configurada' }, { status: 503 });
  }
  const { id } = await context.params;
  const lead = await getLead(id);
  if (!lead) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
  const notes = await listNotes(id);
  return NextResponse.json({ lead, notes });
}

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  if (!isDbConfigured()) {
    return NextResponse.json({ error: 'DB no configurada' }, { status: 503 });
  }
  const { id } = await context.params;
  let body: { statusId?: string };
  try {
    body = (await req.json()) as { statusId?: string };
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });
  }
  if (!body.statusId) {
    return NextResponse.json({ error: 'statusId requerido' }, { status: 400 });
  }
  await updateLeadStatus(id, body.statusId);
  return NextResponse.json({ ok: true });
}
