import { sql, isDbConfigured } from '../client';

export interface ConversationRow {
  id: string;
  created_at: string;
  updated_at: string;
  visitor_id: string | null;
  page_path: string | null;
  lead_id: string | null;
  message_count: number;
  last_message_preview: string | null;
}

export interface ConversationMessageRow {
  id: number;
  conversation_id: string;
  role: 'user' | 'assistant';
  content: string;
  provider_used: string | null;
  created_at: string;
}

function asISO(v: unknown): string {
  if (v instanceof Date) return v.toISOString();
  if (typeof v === 'string') return v;
  return new Date().toISOString();
}

export async function ensureConversation(args: {
  id: string;
  visitorId?: string | null;
  pagePath?: string | null;
  userAgent?: string | null;
}): Promise<void> {
  if (!isDbConfigured()) return;
  await sql`
    INSERT INTO conversations (id, visitor_id, page_path, user_agent)
    VALUES (${args.id}, ${args.visitorId ?? null}, ${args.pagePath ?? null}, ${args.userAgent ?? null})
    ON CONFLICT (id) DO NOTHING
  `;
}

export async function appendMessage(args: {
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  providerUsed?: string | null;
}): Promise<void> {
  if (!isDbConfigured()) return;
  const preview = args.content.slice(0, 200);
  await sql`
    INSERT INTO conversation_messages (conversation_id, role, content, provider_used)
    VALUES (${args.conversationId}, ${args.role}, ${args.content}, ${args.providerUsed ?? null})
  `;
  await sql`
    UPDATE conversations
    SET updated_at = NOW(),
        message_count = message_count + 1,
        last_message_preview = ${preview}
    WHERE id = ${args.conversationId}
  `;
}

export async function attachLeadToConversation(
  conversationId: string,
  leadId: string
): Promise<void> {
  if (!isDbConfigured()) return;
  await sql`
    UPDATE conversations SET lead_id = ${leadId}, updated_at = NOW()
    WHERE id = ${conversationId}
  `;
}

export async function listConversations(): Promise<ConversationRow[]> {
  if (!isDbConfigured()) return [];
  const { rows } = await sql`
    SELECT id, created_at, updated_at, visitor_id, page_path, lead_id,
           message_count, last_message_preview
    FROM conversations
    ORDER BY updated_at DESC
    LIMIT 200
  `;
  return rows.map((r) => ({
    id: String(r.id),
    created_at: asISO(r.created_at),
    updated_at: asISO(r.updated_at),
    visitor_id: r.visitor_id ? String(r.visitor_id) : null,
    page_path: r.page_path ? String(r.page_path) : null,
    lead_id: r.lead_id ? String(r.lead_id) : null,
    message_count: Number(r.message_count ?? 0),
    last_message_preview: r.last_message_preview ? String(r.last_message_preview) : null,
  }));
}

export async function getConversationWithMessages(
  id: string
): Promise<{ conversation: ConversationRow; messages: ConversationMessageRow[] } | null> {
  if (!isDbConfigured()) return null;
  const conv = await sql`SELECT * FROM conversations WHERE id = ${id}`;
  if (conv.rows.length === 0) return null;
  const c = conv.rows[0];
  const msgs = await sql`
    SELECT id, conversation_id, role, content, provider_used, created_at
    FROM conversation_messages
    WHERE conversation_id = ${id}
    ORDER BY created_at ASC
  `;
  return {
    conversation: {
      id: String(c.id),
      created_at: asISO(c.created_at),
      updated_at: asISO(c.updated_at),
      visitor_id: c.visitor_id ? String(c.visitor_id) : null,
      page_path: c.page_path ? String(c.page_path) : null,
      lead_id: c.lead_id ? String(c.lead_id) : null,
      message_count: Number(c.message_count ?? 0),
      last_message_preview: c.last_message_preview ? String(c.last_message_preview) : null,
    },
    messages: msgs.rows.map((m) => ({
      id: Number(m.id),
      conversation_id: String(m.conversation_id),
      role: m.role as 'user' | 'assistant',
      content: String(m.content),
      provider_used: m.provider_used ? String(m.provider_used) : null,
      created_at: asISO(m.created_at),
    })),
  };
}
