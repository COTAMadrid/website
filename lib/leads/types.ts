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
  score?: {
    score: number;
    quality: 'alto' | 'medio' | 'bajo';
    reasons: string[];
  };
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
