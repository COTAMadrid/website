import { NextResponse } from 'next/server';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { sql, isDbConfigured } from '@/lib/db/client';

export const runtime = 'nodejs';

export async function POST() {
  if (!isDbConfigured()) {
    return NextResponse.json(
      { error: 'POSTGRES_URL no configurado' },
      { status: 400 }
    );
  }
  try {
    const schemaPath = path.join(process.cwd(), 'lib', 'db', 'schema.sql');
    const schema = await readFile(schemaPath, 'utf8');
    // Split on ; at end of line to run each statement separately via sql.query
    const statements = schema
      .split(/;\s*\n/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    for (const stmt of statements) {
      await sql.query(stmt);
    }
    return NextResponse.json({ ok: true, statements: statements.length });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
