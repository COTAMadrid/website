import { NextResponse } from 'next/server';
import { listConversations } from '@/lib/db/repositories/conversations';
import { isDbConfigured } from '@/lib/db/client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  if (!isDbConfigured()) {
    return NextResponse.json({ configured: false, conversations: [] });
  }
  const conversations = await listConversations();
  return NextResponse.json({ configured: true, conversations });
}
