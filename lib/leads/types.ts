import type { Diagnosis } from '@/lib/pricing/types';

export interface Lead {
  id: string;
  createdAt: string; // ISO timestamp
  contact: {
    nombre: string;
    email: string;
    telefono: string;
    localidad?: string;
  };
  resumen?: string;
  diagnosis: Diagnosis;
  source?: {
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    referrer?: string;
  };
}

export interface LeadRepository {
  save(lead: Lead): Promise<void>;
  notify(lead: Lead): Promise<void>;
}
