import { sql, isDbConfigured } from '../client';
import { COMPANY_DEFAULTS, type Company } from '@/config/company-defaults';

function fromDefaults(): Company {
  return { ...COMPANY_DEFAULTS };
}

export async function getCompany(): Promise<Company> {
  if (!isDbConfigured()) return fromDefaults();
  try {
    const { rows } = await sql`SELECT * FROM company WHERE id = 1 LIMIT 1`;
    if (rows.length === 0) return fromDefaults();
    const r = rows[0];
    return {
      legal_name: r.legal_name ?? COMPANY_DEFAULTS.legal_name,
      commercial_name: r.commercial_name ?? COMPANY_DEFAULTS.commercial_name,
      cif: r.cif ?? '',
      domicilio: r.domicilio ?? '',
      registro_mercantil: r.registro_mercantil ?? '',
      email_contacto: r.email_contacto ?? '',
      email_reclamaciones: r.email_reclamaciones ?? '',
      telefono: r.telefono ?? '',
      whatsapp: r.whatsapp ?? '',
      instagram: r.instagram ?? '',
      linkedin: r.linkedin ?? '',
      last_legal_update:
        r.last_legal_update instanceof Date
          ? r.last_legal_update.toISOString().slice(0, 10)
          : String(r.last_legal_update ?? COMPANY_DEFAULTS.last_legal_update),
    };
  } catch (err) {
    console.error('[db] getCompany failed, falling back to defaults', err);
    return fromDefaults();
  }
}

export async function setCompany(c: Company): Promise<void> {
  if (!isDbConfigured()) throw new Error('Base de datos no configurada (POSTGRES_URL)');
  await sql`
    INSERT INTO company (
      id, legal_name, commercial_name, cif, domicilio, registro_mercantil,
      email_contacto, email_reclamaciones, telefono, whatsapp, instagram, linkedin,
      last_legal_update, updated_at
    ) VALUES (
      1, ${c.legal_name}, ${c.commercial_name}, ${c.cif}, ${c.domicilio}, ${c.registro_mercantil},
      ${c.email_contacto}, ${c.email_reclamaciones}, ${c.telefono}, ${c.whatsapp}, ${c.instagram}, ${c.linkedin},
      ${c.last_legal_update}, NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
      legal_name = EXCLUDED.legal_name,
      commercial_name = EXCLUDED.commercial_name,
      cif = EXCLUDED.cif,
      domicilio = EXCLUDED.domicilio,
      registro_mercantil = EXCLUDED.registro_mercantil,
      email_contacto = EXCLUDED.email_contacto,
      email_reclamaciones = EXCLUDED.email_reclamaciones,
      telefono = EXCLUDED.telefono,
      whatsapp = EXCLUDED.whatsapp,
      instagram = EXCLUDED.instagram,
      linkedin = EXCLUDED.linkedin,
      last_legal_update = EXCLUDED.last_legal_update,
      updated_at = NOW()
  `;
}
