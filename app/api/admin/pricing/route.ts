import { NextResponse } from 'next/server';
import {
  getPricingConfig,
  setPricingConfig,
  type PricingConfig,
} from '@/lib/db/repositories/pricing';

export const runtime = 'nodejs';

export async function GET() {
  const config = await getPricingConfig();
  return NextResponse.json({ config });
}

export async function PUT(req: Request) {
  try {
    const body = (await req.json()) as { config?: PricingConfig };
    if (!body.config) {
      return NextResponse.json({ error: 'config requerido' }, { status: 400 });
    }
    await setPricingConfig(body.config);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
