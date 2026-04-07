import { NextResponse } from 'next/server';
import {
  getAgendaAvailability,
  setAgendaAvailability,
} from '@/lib/db/repositories/agenda';
import type { AgendaAvailability } from '@/config/agenda-defaults';

export const runtime = 'nodejs';

export async function GET() {
  const availability = await getAgendaAvailability();
  return NextResponse.json({ availability });
}

export async function PUT(req: Request) {
  try {
    const body = (await req.json()) as { availability?: AgendaAvailability };
    if (!body.availability) {
      return NextResponse.json(
        { error: 'availability requerido' },
        { status: 400 }
      );
    }
    await setAgendaAvailability(body.availability);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
