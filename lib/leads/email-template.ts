import type { Lead } from './types';

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const VIABILITY_COLOR = {
  alta: '#22c55e',
  media: '#eab308',
  baja: '#ef4444',
} as const;

const VIABILITY_LABEL = {
  alta: '🟢 ALTA — Cliente ideal',
  media: '🟡 MEDIA — Hay puntos a definir',
  baja: '🔴 BAJA — No es buena opción',
} as const;

const QUALITY_COLOR = { alto: '#22c55e', medio: '#eab308', bajo: '#ef4444' } as const;
const QUALITY_LABEL = {
  alto: '🔥 LEAD CALIENTE',
  medio: '🟡 LEAD TEMPLADO',
  bajo: '🔻 LEAD FRÍO',
} as const;

const URGENCIA_LABEL: Record<string, string> = {
  'este-mes': 'Este mes',
  '1-3-meses': '1 – 3 meses',
  '3-6-meses': '3 – 6 meses',
  'sin-fecha': 'Sin fecha cerrada',
};

const PRESUPUESTO_LABEL: Record<string, string> = {
  'menos-40': '< 40.000 €',
  '40-80': '40.000 € – 80.000 €',
  '80-150': '80.000 € – 150.000 €',
  '150-mas': '> 150.000 €',
  'no-se': 'No lo sabe',
};

export function renderLeadEmail(lead: Lead): { subject: string; html: string } {
  const { contact, diagnosis, score } = lead;
  const { estimate, duration, risks, viability, answers } = diagnosis;
  const color = VIABILITY_COLOR[viability.level];
  const label = VIABILITY_LABEL[viability.level];

  const fmt = (n: number) =>
    new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);

  const wa = `https://wa.me/${(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '34600000000').replace(/\D/g, '')}?text=${encodeURIComponent(`Hola ${contact.nombre}, vengo del diagnóstico de Cota.`)}`;

  const qualityTag = score
    ? `${QUALITY_LABEL[score.quality]} · ${score.score}/100`
    : '';

  const subject = `${qualityTag ? qualityTag + ' — ' : ''}${contact.nombre} (${answers.metros}m² ${answers.barrio})`;

  const html = `
<!DOCTYPE html>
<html lang="es"><head><meta charset="utf-8"></head>
<body style="font-family:-apple-system,sans-serif;background:#0a0a0a;color:#fafafa;margin:0;padding:24px">
  <div style="max-width:600px;margin:0 auto;background:#171717;border-radius:12px;padding:32px">
    <h1 style="margin:0 0 8px;font-weight:300">Nuevo lead Cota</h1>
    <p style="margin:0 0 24px;color:#a3a3a3">${new Date(lead.createdAt).toLocaleString('es-ES')}</p>

    ${score ? `
    <div style="background:${QUALITY_COLOR[score.quality]}22;border-left:4px solid ${QUALITY_COLOR[score.quality]};padding:16px;border-radius:6px;margin-bottom:12px">
      <strong style="color:${QUALITY_COLOR[score.quality]};font-size:18px">${QUALITY_LABEL[score.quality]}</strong>
      <div style="color:#a3a3a3;font-size:13px;margin-top:4px">Score ${score.score}/100 · ${score.reasons.join(' · ')}</div>
    </div>
    ` : ''}

    <div style="background:${color}22;border-left:4px solid ${color};padding:16px;border-radius:6px;margin-bottom:24px">
      <strong style="color:${color}">${label}</strong>
    </div>

    ${(answers.urgencia || answers.presupuestoRango) ? `
    <table style="width:100%;margin-bottom:24px;border-collapse:collapse">
      ${answers.urgencia ? `
      <tr><td style="padding:8px 0;color:#a3a3a3;width:40%">Urgencia</td><td style="padding:8px 0;font-weight:600">${URGENCIA_LABEL[answers.urgencia] ?? answers.urgencia}</td></tr>
      ` : ''}
      ${answers.presupuestoRango ? `
      <tr><td style="padding:8px 0;color:#a3a3a3">Presupuesto declarado</td><td style="padding:8px 0;font-weight:600">${PRESUPUESTO_LABEL[answers.presupuestoRango] ?? answers.presupuestoRango}</td></tr>
      ` : ''}
    </table>
    ` : ''}

    <h2 style="font-weight:300;border-bottom:1px solid #333;padding-bottom:8px">Contacto</h2>
    <p><strong>${contact.nombre}</strong><br>
       ${contact.email}<br>
       <a href="tel:${contact.telefono}" style="color:#fafafa">${contact.telefono}</a>
       ${contact.localidad ? `<br>${contact.localidad}` : ''}</p>

    ${lead.resumen ? `
    <h2 style="font-weight:300;border-bottom:1px solid #333;padding-bottom:8px">Lo que cuenta el cliente</h2>
    <p style="background:#0f0f0f;border-left:3px solid #d4a017;padding:12px 16px;border-radius:4px;color:#e5e5e5;white-space:pre-wrap">${escapeHtml(lead.resumen)}</p>
    ` : ''}

    <h2 style="font-weight:300;border-bottom:1px solid #333;padding-bottom:8px">Estimación</h2>
    <p style="font-size:24px;margin:8px 0">${fmt(estimate.min)} – ${fmt(estimate.max)}</p>
    <p style="color:#a3a3a3">Duración: ${duration.weeksMin} – ${duration.weeksMax} semanas</p>

    <h2 style="font-weight:300;border-bottom:1px solid #333;padding-bottom:8px">Datos del proyecto</h2>
    <ul style="list-style:none;padding:0">
      <li>Tipo: <strong>${answers.tipo}</strong></li>
      <li>Metros: <strong>${answers.metros} m²</strong></li>
      <li>Barrio: <strong>${answers.barrio}</strong></li>
      <li>Antigüedad: <strong>${answers.antiguedad}</strong></li>
      <li>Calidad: <strong>${answers.calidad}</strong></li>
      <li>Estado: <strong>${answers.estado}</strong></li>
      <li>Plazo: <strong>${answers.plazo}</strong></li>
      ${answers.presupuestoCliente ? `<li>Presupuesto cliente: <strong>${fmt(answers.presupuestoCliente)}</strong></li>` : ''}
      ${answers.extras.sinAscensor ? '<li>⚠️ Sin ascensor</li>' : ''}
      ${answers.extras.edificioProtegido ? '<li>⚠️ Edificio protegido</li>' : ''}
      ${answers.extras.zonaBajasEmisiones ? '<li>⚠️ Zona Bajas Emisiones</li>' : ''}
    </ul>

    ${risks.length > 0 ? `
    <h2 style="font-weight:300;border-bottom:1px solid #333;padding-bottom:8px">Riesgos detectados</h2>
    <ul>${risks.map((r) => `<li><strong>${r.title}</strong><br><span style="color:#a3a3a3">${r.description}</span></li>`).join('')}</ul>
    ` : ''}

    <div style="text-align:center;margin-top:32px">
      <a href="${wa}" style="display:inline-block;background:#25d366;color:white;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:600">
        Responder por WhatsApp
      </a>
    </div>
  </div>
</body></html>`;

  return { subject, html };
}
