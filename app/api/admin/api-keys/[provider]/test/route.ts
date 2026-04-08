import { NextResponse } from 'next/server';
import { getKeyPlaintext } from '@/lib/db/repositories/api-keys';
import {
  SUPPORTED_PROVIDERS,
  getProviderMeta,
} from '@/config/api-keys-defaults';
import { PROVIDER_ADAPTERS } from '@/lib/chatbot/providers';
import type { ProviderId as ChatProviderId } from '@/lib/chatbot/types';

export const runtime = 'nodejs';

const TIMEOUT_MS = 10_000;

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params;
  const meta = getProviderMeta(provider);
  if (!meta) {
    return NextResponse.json(
      { ok: false, error: 'Proveedor no soportado' },
      { status: 400 }
    );
  }

  // Resolve key: DB first, env fallback.
  let apiKey: string | null = null;
  try {
    apiKey = await getKeyPlaintext(meta.id);
  } catch {
    apiKey = null;
  }
  if (!apiKey) apiKey = process.env[meta.envVar] ?? null;

  if (!apiKey) {
    return NextResponse.json({
      ok: false,
      error: 'No hay API key configurada (ni en BBDD ni en variable de entorno)',
    });
  }

  const adapter =
    PROVIDER_ADAPTERS[meta.id as unknown as ChatProviderId];
  if (!adapter) {
    return NextResponse.json({ ok: false, error: 'Adaptador no disponible' });
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const reply = await adapter.call({
      model: meta.testModel,
      apiKey,
      system: 'You are a test. Reply with the single word: OK',
      messages: [{ role: 'user', content: 'ping' }],
      signal: controller.signal,
    });
    clearTimeout(timer);
    const trimmed = (reply ?? '').toString().slice(0, 120);
    return NextResponse.json({ ok: true, sample: trimmed });
  } catch (err) {
    clearTimeout(timer);
    const msg = err instanceof Error ? err.message : String(err);
    // Never include apiKey in error output.
    return NextResponse.json({ ok: false, error: msg });
  }
}

// Ensure the array stays referenced (tree-shake guard for constants).
void SUPPORTED_PROVIDERS;
