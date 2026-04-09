CREATE TABLE IF NOT EXISTS company (
  id INT PRIMARY KEY DEFAULT 1,
  legal_name TEXT NOT NULL,
  commercial_name TEXT NOT NULL,
  cif TEXT,
  domicilio TEXT,
  registro_mercantil TEXT,
  email_contacto TEXT,
  email_reclamaciones TEXT,
  telefono TEXT,
  whatsapp TEXT,
  instagram TEXT,
  linkedin TEXT,
  last_legal_update DATE,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT single_row CHECK (id = 1)
);

CREATE TABLE IF NOT EXISTS pricing_config (
  id INT PRIMARY KEY DEFAULT 1,
  price_per_m2 JSONB NOT NULL,
  barrio_factor JSONB NOT NULL,
  antiguedad_factor JSONB NOT NULL,
  plazo_factor JSONB NOT NULL,
  estado_factor JSONB NOT NULL,
  extra_factor JSONB NOT NULL,
  range_spread JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT single_row_pricing CHECK (id = 1)
);

CREATE TABLE IF NOT EXISTS agenda_availability (
  id INT PRIMARY KEY DEFAULT 1,
  time_slots JSONB NOT NULL DEFAULT '["10:00","12:00","16:00","18:00"]'::jsonb,
  blocked_dates JSONB NOT NULL DEFAULT '[]'::jsonb,
  blocked_weekdays JSONB NOT NULL DEFAULT '[6]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT single_row_agenda CHECK (id = 1)
);

CREATE TABLE IF NOT EXISTS api_keys (
  provider TEXT PRIMARY KEY,
  ciphertext TEXT NOT NULL,
  iv TEXT NOT NULL,
  tag TEXT NOT NULL,
  last_4 TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Configurable lead statuses (Paulo can add/remove/rename from /admin/leads/estados)
CREATE TABLE IF NOT EXISTS lead_statuses (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#737373',
  position INT NOT NULL DEFAULT 0,
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed default statuses (only if table is empty)
INSERT INTO lead_statuses (id, label, color, position, is_default)
SELECT * FROM (VALUES
  ('nuevo',         'Nuevo',         '#3b82f6', 1, true),
  ('contactado',    'Contactado',    '#8b5cf6', 2, false),
  ('cualificado',   'Cualificado',   '#06b6d4', 3, false),
  ('presupuestado', 'Presupuestado', '#eab308', 4, false),
  ('cerrado',       'Cerrado',       '#22c55e', 5, false),
  ('perdido',       'Perdido',       '#ef4444', 6, false),
  ('descartado',    'Descartado',    '#737373', 7, false)
) AS v(id, label, color, position, is_default)
WHERE NOT EXISTS (SELECT 1 FROM lead_statuses);

CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Contact
  nombre TEXT NOT NULL,
  email TEXT NOT NULL,
  telefono TEXT NOT NULL,
  localidad TEXT,

  -- Free text from the user
  resumen TEXT,

  -- Quick filterable fields lifted out of diagnosis JSON
  tipo TEXT,
  metros INT,
  barrio TEXT,
  presupuesto_rango TEXT,
  urgencia TEXT,

  -- Score
  score_value INT,
  score_quality TEXT,

  -- Status (FK to lead_statuses, default 'nuevo')
  status_id TEXT REFERENCES lead_statuses(id) ON DELETE SET NULL DEFAULT 'nuevo',

  -- UTM source
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  referrer TEXT,

  -- Full diagnosis blob
  diagnosis JSONB NOT NULL
);

CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads (created_at DESC);
CREATE INDEX IF NOT EXISTS leads_status_idx ON leads (status_id);
CREATE INDEX IF NOT EXISTS leads_quality_idx ON leads (score_quality);

-- Track when we sent the auto follow-up to the client (for cron idempotency)
ALTER TABLE leads ADD COLUMN IF NOT EXISTS followup_sent_at TIMESTAMPTZ;

CREATE TABLE IF NOT EXISTS lead_notes (
  id BIGSERIAL PRIMARY KEY,
  lead_id TEXT NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  author TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS lead_notes_lead_idx ON lead_notes (lead_id, created_at DESC);
