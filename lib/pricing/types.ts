// =============================================================================
// Wizard answers — what the user submits
// =============================================================================

export type ReformType = 'integral' | 'parcial' | 'zona-humeda' | 'cocina';

export type Barrio =
  | 'salamanca'
  | 'chamberi'
  | 'justicia'
  | 'centro'
  | 'chamartin'
  | 'retiro'
  | 'moncloa'
  | 'tetuan'
  | 'arganzuela'
  | 'latina'
  | 'carabanchel'
  | 'otros'
  | 'fuera-m30';

export type Antiguedad = 'pre-1950' | '1950-1980' | '1980-2000' | 'post-2000';

export type Calidad = 'basico' | 'medio' | 'alto' | 'premium';

export type EstadoActual = 'estrenar' | 'vivido-obsoleto' | 'parcial-reformado';

export type Plazo = 'sin-prisa' | '3-6-meses' | 'urgente';

export interface WizardAnswers {
  tipo: ReformType;
  metros: number;
  barrio: Barrio;
  antiguedad: Antiguedad;
  calidad: Calidad;
  estado: EstadoActual;
  plazo: Plazo;
  extras: {
    sinAscensor: boolean;
    edificioProtegido: boolean;
    zonaBajasEmisiones: boolean;
  };
  presupuestoCliente?: number; // optional, used for viability
  contacto?: {
    nombre: string;
    email: string;
    telefono: string;
  };
}

// =============================================================================
// Engine outputs
// =============================================================================

export interface PriceEstimate {
  min: number;
  max: number;
  central: number;
}

export interface DurationEstimate {
  weeksMin: number;
  weeksMax: number;
}

export interface Risk {
  id: string;
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'critical';
}

export type ViabilityLevel = 'alta' | 'media' | 'baja';

export interface Viability {
  level: ViabilityLevel;
  microcopy: string;
  cta: {
    label: string;
    href: string;
  };
}

export interface Diagnosis {
  estimate: PriceEstimate;
  duration: DurationEstimate;
  risks: Risk[];
  viability: Viability;
  answers: WizardAnswers;
}
