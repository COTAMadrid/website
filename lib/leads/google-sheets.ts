import { google } from 'googleapis';
import type { Lead } from './types';

const HEADER = [
  'Timestamp',
  'Nombre',
  'Email',
  'Teléfono',
  'Viabilidad',
  'Estimación min (€)',
  'Estimación max (€)',
  'Duración semanas',
  'Tipo',
  'Metros',
  'Barrio',
  'Antigüedad',
  'Calidad',
  'Estado',
  'Plazo',
  'Sin ascensor',
  'Edif. protegido',
  'ZBE',
  'Presupuesto cliente',
  'Riesgos',
  'UTM source',
];

export async function appendLeadRow(lead: Lead): Promise<void> {
  const sheetId = process.env.GOOGLE_SHEETS_ID;
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_SERVICE_ACCOUNT_KEY?.replace(/\\n/g, '\n');

  if (!sheetId || !email || !key) {
    throw new Error('Missing Google Sheets env vars');
  }

  const auth = new google.auth.JWT({
    email,
    key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });
  const { diagnosis: d } = lead;

  const row = [
    lead.createdAt,
    lead.contact.nombre,
    lead.contact.email,
    lead.contact.telefono,
    d.viability.level,
    d.estimate.min,
    d.estimate.max,
    `${d.duration.weeksMin}-${d.duration.weeksMax}`,
    d.answers.tipo,
    d.answers.metros,
    d.answers.barrio,
    d.answers.antiguedad,
    d.answers.calidad,
    d.answers.estado,
    d.answers.plazo,
    d.answers.extras.sinAscensor ? 'sí' : 'no',
    d.answers.extras.edificioProtegido ? 'sí' : 'no',
    d.answers.extras.zonaBajasEmisiones ? 'sí' : 'no',
    d.answers.presupuestoCliente ?? '',
    d.risks.map((r) => r.title).join(' | '),
    lead.source?.utm_source ?? '',
  ];

  // Ensure header exists (idempotent: only writes header if A1 is empty)
  const headerRange = 'Leads!A1:U1';
  const existing = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: headerRange,
  });
  if (!existing.data.values || existing.data.values.length === 0) {
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: headerRange,
      valueInputOption: 'RAW',
      requestBody: { values: [HEADER] },
    });
  }

  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: 'Leads!A:U',
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [row] },
  });
}
