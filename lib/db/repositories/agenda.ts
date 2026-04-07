import { sql, isDbConfigured } from '../client';
import { AGENDA_DEFAULTS, type AgendaAvailability } from '@/config/agenda-defaults';

function fromDefaults(): AgendaAvailability {
  return {
    time_slots: [...AGENDA_DEFAULTS.time_slots],
    blocked_dates: [...AGENDA_DEFAULTS.blocked_dates],
    blocked_weekdays: [...AGENDA_DEFAULTS.blocked_weekdays],
  };
}

export async function getAgendaAvailability(): Promise<AgendaAvailability> {
  if (!isDbConfigured()) return fromDefaults();
  try {
    const { rows } = await sql`SELECT * FROM agenda_availability WHERE id = 1 LIMIT 1`;
    if (rows.length === 0) return fromDefaults();
    const r = rows[0];
    return {
      time_slots: Array.isArray(r.time_slots) ? r.time_slots : fromDefaults().time_slots,
      blocked_dates: Array.isArray(r.blocked_dates) ? r.blocked_dates : [],
      blocked_weekdays: Array.isArray(r.blocked_weekdays) ? r.blocked_weekdays : [6],
    };
  } catch (err) {
    console.error('[db] getAgendaAvailability failed, falling back to defaults', err);
    return fromDefaults();
  }
}

export async function setAgendaAvailability(a: AgendaAvailability): Promise<void> {
  if (!isDbConfigured()) throw new Error('Base de datos no configurada (POSTGRES_URL)');
  await sql`
    INSERT INTO agenda_availability (id, time_slots, blocked_dates, blocked_weekdays, updated_at)
    VALUES (
      1,
      ${JSON.stringify(a.time_slots)}::jsonb,
      ${JSON.stringify(a.blocked_dates)}::jsonb,
      ${JSON.stringify(a.blocked_weekdays)}::jsonb,
      NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
      time_slots = EXCLUDED.time_slots,
      blocked_dates = EXCLUDED.blocked_dates,
      blocked_weekdays = EXCLUDED.blocked_weekdays,
      updated_at = NOW()
  `;
}
