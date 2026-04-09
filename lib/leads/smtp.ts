import nodemailer from 'nodemailer';
import { renderLeadEmail } from './email-template';
import type { Lead } from './types';

function getTransport() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  const secure = process.env.SMTP_SECURE === 'true';
  if (!host || !user || !pass) {
    throw new Error(
      'Missing SMTP env vars (SMTP_HOST, SMTP_USER, SMTP_PASSWORD)'
    );
  }
  return nodemailer.createTransport({ host, port, secure, auth: { user, pass } });
}

export async function sendLeadEmail(lead: Lead): Promise<void> {
  const from = process.env.SMTP_FROM;
  const to = process.env.LEADS_TO_EMAIL;
  if (!from || !to) {
    throw new Error('Missing SMTP_FROM or LEADS_TO_EMAIL');
  }
  const transporter = getTransport();
  const { subject, html } = renderLeadEmail(lead);
  await transporter.sendMail({ from, to, subject, html });
}

/** Sends a warm follow-up email to the *client* (not Paulo) 24h after their
 *  diagnóstico, if they haven't been contacted yet. */
export async function sendClientFollowupEmail(args: {
  to: string;
  nombre: string;
}): Promise<void> {
  const from = process.env.SMTP_FROM;
  if (!from) throw new Error('Missing SMTP_FROM');
  const transporter = getTransport();
  const firstName = args.nombre.split(' ')[0] || 'hola';
  const html = `
<!DOCTYPE html>
<html lang="es"><head><meta charset="utf-8"></head>
<body style="font-family:-apple-system,Segoe UI,sans-serif;background:#fafaf7;color:#1a1a1a;margin:0;padding:24px">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:12px;padding:32px;border:1px solid #e5e5e0">
    <p style="margin:0 0 16px;font-size:16px;line-height:1.55">Hola ${firstName},</p>

    <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#404040">
      Soy Paulo, de Cota Madrid. Ayer hiciste el diagnóstico de tu reforma en
      nuestra web y quería escribirte personalmente.
    </p>

    <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#404040">
      No es un email automático para venderte nada — es para preguntarte si
      hay algo del informe que no te quedó claro, o si quieres que te
      expliquemos las opciones reales para tu caso, sin compromiso.
    </p>

    <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#404040">
      Solo tienes que responder a este correo. Lo leemos personalmente y te
      contestamos cuanto antes.
    </p>

    <div style="border-top:1px solid #e5e5e0;padding-top:20px;margin-top:24px">
      <p style="margin:0;font-size:14px;color:#737373">
        Un saludo,<br>
        <strong style="color:#1a1a1a">Paulo · Cota Madrid</strong><br>
        <a href="https://cotamadrid.es" style="color:#a07a17;text-decoration:none">cotamadrid.es</a>
      </p>
    </div>
  </div>
  <p style="text-align:center;font-size:11px;color:#a3a3a3;margin-top:16px">
    Si prefieres no recibir más correos, simplemente respóndenos &quot;baja&quot;.
  </p>
</body></html>`;

  await transporter.sendMail({
    from,
    to: args.to,
    subject: `${firstName}, ¿alguna duda con tu diagnóstico?`,
    html,
  });
}
