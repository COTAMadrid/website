import { sql, isDbConfigured } from '../client';
import type { Lead } from '@/lib/leads/types';

export interface LeadStatus {
  id: string;
  label: string;
  color: string;
  position: number;
  is_default: boolean;
}

export interface LeadNote {
  id: number;
  lead_id: string;
  body: string;
  author: string | null;
  created_at: string;
}

export interface LeadRow {
  id: string;
  created_at: string;
  updated_at: string;
  nombre: string;
  email: string;
  telefono: string;
  localidad: string | null;
  resumen: string | null;
  tipo: string | null;
  metros: number | null;
  barrio: string | null;
  presupuesto_rango: string | null;
  urgencia: string | null;
  score_value: number | null;
  score_quality: string | null;
  status_id: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  referrer: string | null;
  diagnosis: unknown;
}

function asISO(v: unknown): string {
  if (v instanceof Date) return v.toISOString();
  if (typeof v === 'string') return v;
  return new Date().toISOString();
}

// =====================================================================
// STATUSES
// =====================================================================

export async function listStatuses(): Promise<LeadStatus[]> {
  if (!isDbConfigured()) return [];
  const { rows } = await sql`
    SELECT id, label, color, position, is_default
    FROM lead_statuses
    ORDER BY position ASC, label ASC
  `;
  return rows.map((r) => ({
    id: String(r.id),
    label: String(r.label),
    color: String(r.color),
    position: Number(r.position),
    is_default: Boolean(r.is_default),
  }));
}

export async function upsertStatus(s: {
  id: string;
  label: string;
  color: string;
  position: number;
}): Promise<void> {
  if (!isDbConfigured()) throw new Error('DB no configurada');
  await sql`
    INSERT INTO lead_statuses (id, label, color, position)
    VALUES (${s.id}, ${s.label}, ${s.color}, ${s.position})
    ON CONFLICT (id) DO UPDATE SET
      label = EXCLUDED.label,
      color = EXCLUDED.color,
      position = EXCLUDED.position
  `;
}

export async function deleteStatus(id: string): Promise<void> {
  if (!isDbConfigured()) throw new Error('DB no configurada');
  // Don't allow deleting the default 'nuevo' status
  await sql`DELETE FROM lead_statuses WHERE id = ${id} AND is_default = false`;
}

// =====================================================================
// LEADS
// =====================================================================

export async function saveLead(lead: Lead): Promise<void> {
  if (!isDbConfigured()) {
    // Silently skip — leads still go to email/sheets
    return;
  }
  const a = lead.diagnosis.answers;
  await sql`
    INSERT INTO leads (
      id, created_at, nombre, email, telefono, localidad, resumen,
      tipo, metros, barrio, presupuesto_rango, urgencia,
      score_value, score_quality,
      utm_source, utm_medium, utm_campaign, referrer,
      diagnosis
    ) VALUES (
      ${lead.id},
      ${lead.createdAt},
      ${lead.contact.nombre},
      ${lead.contact.email},
      ${lead.contact.telefono},
      ${lead.contact.localidad ?? null},
      ${lead.resumen ?? null},
      ${a.tipo},
      ${a.metros},
      ${a.barrio},
      ${a.presupuestoRango ?? null},
      ${a.urgencia ?? null},
      ${lead.score?.score ?? null},
      ${lead.score?.quality ?? null},
      ${lead.source?.utm_source ?? null},
      ${lead.source?.utm_medium ?? null},
      ${lead.source?.utm_campaign ?? null},
      ${lead.source?.referrer ?? null},
      ${JSON.stringify(lead.diagnosis)}
    )
    ON CONFLICT (id) DO NOTHING
  `;
}

export interface ListLeadsFilters {
  statusId?: string;
  quality?: 'alto' | 'medio' | 'bajo';
  sinceDays?: number;
  search?: string;
}

export async function listLeads(filters: ListLeadsFilters = {}): Promise<LeadRow[]> {
  if (!isDbConfigured()) return [];

  // sql tagged template doesn't support dynamic WHERE clauses easily, so we
  // run a single query with COALESCE-style filters.
  const { statusId, quality, sinceDays, search } = filters;
  const search_ = search ? `%${search.toLowerCase()}%` : null;
  const sinceISO = sinceDays
    ? new Date(Date.now() - sinceDays * 86400_000).toISOString()
    : null;

  const { rows } = await sql`
    SELECT
      id, created_at, updated_at, nombre, email, telefono, localidad, resumen,
      tipo, metros, barrio, presupuesto_rango, urgencia,
      score_value, score_quality, status_id,
      utm_source, utm_medium, utm_campaign, referrer,
      diagnosis
    FROM leads
    WHERE
      (${statusId ?? null}::text IS NULL OR status_id = ${statusId ?? null})
      AND (${quality ?? null}::text IS NULL OR score_quality = ${quality ?? null})
      AND (${sinceISO}::timestamptz IS NULL OR created_at >= ${sinceISO}::timestamptz)
      AND (
        ${search_}::text IS NULL OR
        LOWER(nombre) LIKE ${search_}::text OR
        LOWER(email) LIKE ${search_}::text OR
        LOWER(COALESCE(barrio,'')) LIKE ${search_}::text OR
        LOWER(COALESCE(resumen,'')) LIKE ${search_}::text OR
        LOWER(COALESCE(localidad,'')) LIKE ${search_}::text
      )
    ORDER BY created_at DESC
    LIMIT 500
  `;

  return rows.map((r) => ({
    id: String(r.id),
    created_at: asISO(r.created_at),
    updated_at: asISO(r.updated_at),
    nombre: String(r.nombre),
    email: String(r.email),
    telefono: String(r.telefono),
    localidad: r.localidad ? String(r.localidad) : null,
    resumen: r.resumen ? String(r.resumen) : null,
    tipo: r.tipo ? String(r.tipo) : null,
    metros: r.metros !== null ? Number(r.metros) : null,
    barrio: r.barrio ? String(r.barrio) : null,
    presupuesto_rango: r.presupuesto_rango ? String(r.presupuesto_rango) : null,
    urgencia: r.urgencia ? String(r.urgencia) : null,
    score_value: r.score_value !== null ? Number(r.score_value) : null,
    score_quality: r.score_quality ? String(r.score_quality) : null,
    status_id: r.status_id ? String(r.status_id) : null,
    utm_source: r.utm_source ? String(r.utm_source) : null,
    utm_medium: r.utm_medium ? String(r.utm_medium) : null,
    utm_campaign: r.utm_campaign ? String(r.utm_campaign) : null,
    referrer: r.referrer ? String(r.referrer) : null,
    diagnosis: r.diagnosis,
  }));
}

export async function getLead(id: string): Promise<LeadRow | null> {
  if (!isDbConfigured()) return null;
  const { rows } = await sql`SELECT * FROM leads WHERE id = ${id} LIMIT 1`;
  if (rows.length === 0) return null;
  const r = rows[0];
  return {
    id: String(r.id),
    created_at: asISO(r.created_at),
    updated_at: asISO(r.updated_at),
    nombre: String(r.nombre),
    email: String(r.email),
    telefono: String(r.telefono),
    localidad: r.localidad ? String(r.localidad) : null,
    resumen: r.resumen ? String(r.resumen) : null,
    tipo: r.tipo ? String(r.tipo) : null,
    metros: r.metros !== null ? Number(r.metros) : null,
    barrio: r.barrio ? String(r.barrio) : null,
    presupuesto_rango: r.presupuesto_rango ? String(r.presupuesto_rango) : null,
    urgencia: r.urgencia ? String(r.urgencia) : null,
    score_value: r.score_value !== null ? Number(r.score_value) : null,
    score_quality: r.score_quality ? String(r.score_quality) : null,
    status_id: r.status_id ? String(r.status_id) : null,
    utm_source: r.utm_source ? String(r.utm_source) : null,
    utm_medium: r.utm_medium ? String(r.utm_medium) : null,
    utm_campaign: r.utm_campaign ? String(r.utm_campaign) : null,
    referrer: r.referrer ? String(r.referrer) : null,
    diagnosis: r.diagnosis,
  };
}

export async function updateLeadStatus(
  leadId: string,
  statusId: string
): Promise<void> {
  if (!isDbConfigured()) throw new Error('DB no configurada');
  await sql`
    UPDATE leads SET status_id = ${statusId}, updated_at = NOW()
    WHERE id = ${leadId}
  `;
}

// =====================================================================
// NOTES
// =====================================================================

export async function listNotes(leadId: string): Promise<LeadNote[]> {
  if (!isDbConfigured()) return [];
  const { rows } = await sql`
    SELECT id, lead_id, body, author, created_at
    FROM lead_notes WHERE lead_id = ${leadId}
    ORDER BY created_at DESC
  `;
  return rows.map((r) => ({
    id: Number(r.id),
    lead_id: String(r.lead_id),
    body: String(r.body),
    author: r.author ? String(r.author) : null,
    created_at: asISO(r.created_at),
  }));
}

export async function addNote(
  leadId: string,
  body: string,
  author?: string | null
): Promise<void> {
  if (!isDbConfigured()) throw new Error('DB no configurada');
  await sql`
    INSERT INTO lead_notes (lead_id, body, author)
    VALUES (${leadId}, ${body}, ${author ?? null})
  `;
}
