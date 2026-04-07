import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export const runtime = 'nodejs';

export async function GET() {
  const sheetId = process.env.GOOGLE_SHEETS_ID;
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_SERVICE_ACCOUNT_KEY?.replace(/\\n/g, '\n');

  if (!sheetId || !email || !key) {
    return NextResponse.json({ leads: [], configured: false });
  }

  try {
    const auth = new google.auth.JWT({
      email,
      key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });
    const sheets = google.sheets({ version: 'v4', auth });
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'Leads!A1:U',
    });
    const rows = res.data.values || [];
    if (rows.length === 0) {
      return NextResponse.json({ leads: [], configured: true });
    }
    const [header, ...data] = rows;
    const leads = data.map((row) => {
      const obj: Record<string, string> = {};
      header.forEach((h: string, i: number) => {
        obj[h] = row[i] ?? '';
      });
      return obj;
    });
    return NextResponse.json({ leads, header, configured: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error';
    return NextResponse.json({ error: msg, leads: [], configured: true }, { status: 500 });
  }
}
