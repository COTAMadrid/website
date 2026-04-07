import nodemailer from 'nodemailer';
import { renderLeadEmail } from './email-template';
import type { Lead } from './types';

export async function sendLeadEmail(lead: Lead): Promise<void> {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  const from = process.env.SMTP_FROM;
  const to = process.env.LEADS_TO_EMAIL;
  const secure = process.env.SMTP_SECURE === 'true';

  if (!host || !user || !pass || !from || !to) {
    throw new Error(
      'Missing SMTP env vars (SMTP_HOST, SMTP_USER, SMTP_PASSWORD, SMTP_FROM, LEADS_TO_EMAIL)'
    );
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });

  const { subject, html } = renderLeadEmail(lead);
  await transporter.sendMail({ from, to, subject, html });
}
