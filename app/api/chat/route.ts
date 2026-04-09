import { NextResponse } from 'next/server';
import { runChain } from '@/lib/chatbot/chain';
import { getConfig } from '@/lib/chatbot/store';
import {
  appendMessage,
  ensureConversation,
} from '@/lib/db/repositories/conversations';
import type { ChatMessage } from '@/lib/chatbot/types';

export const runtime = 'nodejs';

interface IncomingBody {
  messages?: ChatMessage[];
  conversationId?: string;
  visitorId?: string;
  pagePath?: string;
}

/** Extracts an [ACCION:XXX] tag and returns { reply, action } where reply has
 *  the tag stripped. Lucia uses these tags to signal frontend actions. */
function extractAction(reply: string): {
  reply: string;
  action: 'callback' | 'diagnostico' | null;
} {
  const m = reply.match(/\[ACCION:(CALLBACK|DIAGNOSTICO)\]/i);
  if (!m) return { reply, action: null };
  const action = m[1].toLowerCase() as 'callback' | 'diagnostico';
  const cleaned = reply.replace(m[0], '').trim();
  return { reply: cleaned, action };
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as IncomingBody;
    const messages = Array.isArray(body.messages) ? body.messages : [];
    if (messages.length === 0) {
      return NextResponse.json({ error: 'messages requerido' }, { status: 400 });
    }
    const safe = messages
      .filter((m) => m && (m.role === 'user' || m.role === 'assistant'))
      .slice(-20)
      .map((m) => ({ role: m.role, content: String(m.content ?? '').slice(0, 4000) }));

    const conversationId = body.conversationId ?? crypto.randomUUID();

    // Persist conversation + last user message (best-effort)
    if (body.conversationId === undefined || body.conversationId === conversationId) {
      try {
        await ensureConversation({
          id: conversationId,
          visitorId: body.visitorId ?? null,
          pagePath: body.pagePath ?? null,
          userAgent: req.headers.get('user-agent'),
        });
        const lastUser = [...safe].reverse().find((m) => m.role === 'user');
        if (lastUser) {
          await appendMessage({
            conversationId,
            role: 'user',
            content: lastUser.content,
          });
        }
      } catch (e) {
        console.error('[chat] persist user msg failed', e);
      }
    }

    const config = await getConfig();
    const result = await runChain(safe, config);
    const { reply, action } = extractAction(result.reply);

    // Persist assistant reply (best-effort)
    try {
      await appendMessage({
        conversationId,
        role: 'assistant',
        content: reply,
        providerUsed: result.providerUsed,
      });
    } catch (e) {
      console.error('[chat] persist assistant msg failed', e);
    }

    return NextResponse.json({
      reply,
      action,
      providerUsed: result.providerUsed,
      conversationId,
    });
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
