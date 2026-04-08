import { NextResponse } from 'next/server';
import { setKey, deleteKey } from '@/lib/db/repositories/api-keys';
import { SUPPORTED_PROVIDERS } from '@/config/api-keys-defaults';

export const runtime = 'nodejs';

function isValidProvider(id: string): boolean {
  return SUPPORTED_PROVIDERS.some((p) => p.id === id);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params;
  if (!isValidProvider(provider)) {
    return NextResponse.json({ error: 'Proveedor no soportado' }, { status: 400 });
  }
  try {
    const body = (await req.json()) as { value?: string };
    const value = (body.value ?? '').trim();
    if (!value) {
      return NextResponse.json({ error: 'value requerido' }, { status: 400 });
    }
    await setKey(provider, value);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params;
  if (!isValidProvider(provider)) {
    return NextResponse.json({ error: 'Proveedor no soportado' }, { status: 400 });
  }
  try {
    await deleteKey(provider);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
