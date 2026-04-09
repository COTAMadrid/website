import { NextResponse } from 'next/server';
import { listLeads, listStatuses } from '@/lib/db/repositories/leads';
import { isDbConfigured } from '@/lib/db/client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  if (!isDbConfigured()) {
    return NextResponse.json(
      { configured: false, leads: [], statuses: [] },
      { status: 200 }
    );
  }
  const { searchParams } = new URL(req.url);
  const statusId = searchParams.get('status') ?? undefined;
  const quality = (searchParams.get('quality') ?? undefined) as
    | 'alto'
    | 'medio'
    | 'bajo'
    | undefined;
  const sinceDays = searchParams.get('since')
    ? Number(searchParams.get('since'))
    : undefined;
  const search = searchParams.get('q') ?? undefined;

  try {
    const [leads, statuses] = await Promise.all([
      listLeads({ statusId, quality, sinceDays, search }),
      listStatuses(),
    ]);
    return NextResponse.json({ configured: true, leads, statuses });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error desconocido';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
