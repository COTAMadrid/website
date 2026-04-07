import { NextResponse } from 'next/server';
import { runChain } from '@/lib/chatbot/chain';
import { getConfig } from '@/lib/chatbot/store';
import type { ChatMessage } from '@/lib/chatbot/types';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { messages?: ChatMessage[] };
    const messages = Array.isArray(body.messages) ? body.messages : [];
    if (messages.length === 0) {
      return NextResponse.json({ error: 'messages requerido' }, { status: 400 });
    }
    const safe = messages
      .filter((m) => m && (m.role === 'user' || m.role === 'assistant'))
      .slice(-20)
      .map((m) => ({ role: m.role, content: String(m.content ?? '').slice(0, 4000) }));

    const config = await getConfig();
    const result = await runChain(safe, config);
    return NextResponse.json(result);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error desconocido';
    console.error('[api/chat]', msg);
    return NextResponse.json(
      {
        error:
          'Lo siento, ahora mismo no puedo responder. Puedes escribirnos por WhatsApp o rellenar el diagnóstico en /diagnostico.',
        detail: msg,
      },
      { status: 503 }
    );
  }
}
