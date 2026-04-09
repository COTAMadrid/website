import { NextResponse } from 'next/server';
import { getConversationWithMessages } from '@/lib/db/repositories/conversations';
import { isDbConfigured } from '@/lib/db/client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!isDbConfigured()) {
    return NextResponse.json({ error: 'DB no configurada' }, { status: 503 });
  }
  const { id } = await ctx.params;
  const data = await getConversationWithMessages(id);
  if (!data) return NextResponse.json({ error: 'No encontrada' }, { status: 404 });
  return NextResponse.json(data);
}
