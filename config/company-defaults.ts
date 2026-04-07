export const COMPANY_DEFAULTS = {
  legal_name: 'PCH Obras',
  commercial_name: 'Cota',
  cif: '',
  domicilio: 'Madrid, España',
  registro_mercantil: '',
  email_contacto: 'hola@cotamadrid.com',
  email_reclamaciones: 'reclamaciones@cotamadrid.com',
  telefono: '+34 000 000 000',
  whatsapp: '+34000000000',
  instagram: '',
  linkedin: '',
  last_legal_update: '2026-01-01',
} as const;

export type Company = {
  legal_name: string;
  commercial_name: string;
  cif: string;
  domicilio: string;
  registro_mercantil: string;
  email_contacto: string;
  email_reclamaciones: string;
  telefono: string;
  whatsapp: string;
  instagram: string;
  linkedin: string;
  last_legal_update: string;
};
