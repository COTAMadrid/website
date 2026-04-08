import { NextResponse } from 'next/server';
import { listKeys } from '@/lib/db/repositories/api-keys';
import { SUPPORTED_PROVIDERS } from '@/config/api-keys-defaults';
import { isDbConfigured } from '@/lib/db/client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  if (!isDbConfigured()) {
    return NextResponse.json(
      { error: 'Base de datos no configurada' },
      { status: 503 }
    );
  }
  try {
    const rows = await listKeys();
    const byProvider = new Map(rows.map((r) => [r.provider, r]));
    const providers = SUPPORTED_PROVIDERS.map((p) => {
      const db = byProvider.get(p.id);
      const envPresent = !!process.env[p.envVar];
      let status: 'configured' | 'env-var' | 'none';
      if (db) status = 'configured';
      else if (envPresent) status = 'env-var';
      else status = 'none';
      return {
        id: p.id,
        name: p.name,
        envVar: p.envVar,
        docsUrl: p.docsUrl,
        status,
        last_4: db?.last_4 ?? null,
        updated_at: db?.updated_at ?? null,
      };
    });
    return NextResponse.json({ providers });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
