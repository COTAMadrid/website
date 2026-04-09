import { NextResponse } from 'next/server';
import { getCompany } from '@/lib/db/repositories/company';

export const runtime = 'nodejs';
export const revalidate = 300; // 5 min cache

export async function GET() {
  try {
    const c = await getCompany();
    // Public-safe subset only
    return NextResponse.json({
      telefono: c.telefono ?? null,
      whatsapp: c.whatsapp ?? null,
      commercial_name: c.commercial_name ?? null,
    });
  } catch {
    return NextResponse.json({ telefono: null, whatsapp: null, commercial_name: null });
  }
}
