import { NextResponse } from 'next/server';
import { getConfig, setConfig, isPersistenceEnabled } from '@/lib/chatbot/store';
import type { ChatbotConfig } from '@/lib/chatbot/types';

export const runtime = 'nodejs';

export async function GET() {
  const config = await getConfig();
  return NextResponse.json({ config, persistence: isPersistenceEnabled() });
}

export async function PUT(req: Request) {
  try {
    const body = (await req.json()) as { config?: ChatbotConfig };
    if (!body.config) {
      return NextResponse.json({ error: 'config requerido' }, { status: 400 });
    }
    const c = body.config;
    if (
      typeof c.systemPrompt !== 'string' ||
      !Array.isArray(c.knowledge) ||
      !Array.isArray(c.providers)
    ) {
      return NextResponse.json({ error: 'config inválido' }, { status: 400 });
    }
    const result = await setConfig(c);
    return NextResponse.json({ ok: true, persisted: result.persisted });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
