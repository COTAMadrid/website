import { NextResponse } from 'next/server';
import { sql, isDbConfigured } from '@/lib/db/client';
import { sendClientFollowupEmail } from '@/lib/leads/smtp';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Daily cron at 09:00 UTC. Sends a warm follow-up to clients who:
 *   - did a diagnóstico ~24h ago (between 36h and 18h ago)
 *   - are still in status 'nuevo' (we haven't contacted them)
 *   - have a valid email
 *   - have not received the follow-up already
 *
 * Triggered by Vercel Cron. The CRON_SECRET env var protects the endpoint.
 */
export async function GET(req: Request) {
  // Vercel signs cron requests with this header. Reject everything else.
  const auth = req.headers.get('authorization');
  if (
    process.env.CRON_SECRET &&
    auth !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!isDbConfigured()) {
    return NextResponse.json({ ok: false, reason: 'db-not-configured' });
  }

  const { rows } = await sql`
    SELECT id, nombre, email
    FROM leads
    WHERE status_id = 'nuevo'
      AND followup_sent_at IS NULL
      AND email <> ''
      AND created_at <= NOW() - INTERVAL '18 hours'
      AND created_at >= NOW() - INTERVAL '36 hours'
    LIMIT 50
  `;

  const sent: string[] = [];
  const failed: { id: string; error: string }[] = [];

  for (const r of rows) {
    const id = String(r.id);
    const email = String(r.email);
    const nombre = String(r.nombre);
    try {
      await sendClientFollowupEmail({ to: email, nombre });
      await sql`UPDATE leads SET followup_sent_at = NOW() WHERE id = ${id}`;
      sent.push(id);
    } catch (err) {
      failed.push({ id, error: err instanceof Error ? err.message : String(err) });
    }
  }

  return NextResponse.json({
    ok: true,
    candidates: rows.length,
    sent: sent.length,
    failed: failed.length,
    failures: failed,
  });
}
