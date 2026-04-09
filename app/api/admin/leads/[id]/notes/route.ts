import { NextResponse } from 'next/server';
import { addNote, listNotes } from '@/lib/db/repositories/leads';
import { isDbConfigured } from '@/lib/db/client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  if (!isDbConfigured()) {
    return NextResponse.json({ error: 'DB no configurada' }, { status: 503 });
  }
  const { id } = await context.params;
  let body: { body?: string; author?: string };
  try {
    body = (await req.json()) as { body?: string; author?: string };
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });
  }
  const note = body.body?.trim();
  if (!note) {
    return NextResponse.json({ error: 'Nota vacía' }, { status: 400 });
  }
  await addNote(id, note, body.author);
  const notes = await listNotes(id);
  return NextResponse.json({ ok: true, notes });
}
