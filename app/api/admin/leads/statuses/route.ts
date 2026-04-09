import { NextResponse } from 'next/server';
import {
  deleteStatus,
  listStatuses,
  upsertStatus,
} from '@/lib/db/repositories/leads';
import { isDbConfigured } from '@/lib/db/client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  if (!isDbConfigured()) {
    return NextResponse.json({ statuses: [] });
  }
  const statuses = await listStatuses();
  return NextResponse.json({ statuses });
}

export async function POST(req: Request) {
  if (!isDbConfigured()) {
    return NextResponse.json({ error: 'DB no configurada' }, { status: 503 });
  }
  let body: { id?: string; label?: string; color?: string; position?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });
  }
  if (!body.id || !body.label) {
    return NextResponse.json({ error: 'id y label requeridos' }, { status: 400 });
  }
  const id = body.id
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '');
  if (!id) {
    return NextResponse.json({ error: 'id inválido' }, { status: 400 });
  }
  await upsertStatus({
    id,
    label: body.label,
    color: body.color ?? '#737373',
    position: body.position ?? 99,
  });
  const statuses = await listStatuses();
  return NextResponse.json({ ok: true, statuses });
}

export async function DELETE(req: Request) {
  if (!isDbConfigured()) {
    return NextResponse.json({ error: 'DB no configurada' }, { status: 503 });
  }
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id requerido' }, { status: 400 });
  await deleteStatus(id);
  const statuses = await listStatuses();
  return NextResponse.json({ ok: true, statuses });
}
