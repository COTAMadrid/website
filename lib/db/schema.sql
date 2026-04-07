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
