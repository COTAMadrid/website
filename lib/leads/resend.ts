import { Resend } from 'resend';
import { renderLeadEmail } from './email-template';
import type { Lead } from './types';

export async function sendLeadEmail(lead: Lead): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEADS_TO_EMAIL;
  const from = process.env.LEADS_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    throw new Error('Missing Resend env vars (RESEND_API_KEY, LEADS_TO_EMAIL, LEADS_FROM_EMAIL)');
  }

  const resend = new Resend(apiKey);
  const { subject, html } = renderLeadEmail(lead);

  const { error } = await resend.emails.send({ from, to, subject, html });
  if (error) throw new Error(`Resend error: ${error.message}`);
}
