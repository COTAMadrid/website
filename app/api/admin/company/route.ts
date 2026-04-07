import { NextResponse } from 'next/server';
import { getCompany, setCompany } from '@/lib/db/repositories/company';
import type { Company } from '@/config/company-defaults';

export const runtime = 'nodejs';

export async function GET() {
  const company = await getCompany();
  return NextResponse.json({ company });
}

export async function PUT(req: Request) {
  try {
    const body = (await req.json()) as { company?: Company };
    if (!body.company) {
      return NextResponse.json({ error: 'company requerido' }, { status: 400 });
    }
    await setCompany(body.company);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
