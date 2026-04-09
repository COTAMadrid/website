// =============================================================================
// Wizard answers — what the user submits
// =============================================================================

export type ReformType = 'integral' | 'parcial' | 'zona-humeda' | 'cocina';

export type Barrio =
  // Madrid capital — Prime
  | 'salamanca'
  | 'chamberi'
  | 'chamartin'
  | 'retiro'
  // Madrid capital — Centro histórico
  | 'centro'
  | 'justicia'
  // Madrid capital — Residencial media-alta
  | 'arganzuela'
  | 'moncloa'
  | 'tetuan'
  // Madrid capital — Ajustada
  | 'latina'
  | 'carabanchel'
  | 'villaverde'
  // Madrid capital — Otros
  | 'otros'
  // Municipios prime
  | 'pozuelo'
  | 'majadahonda'
  // Municipios medios
  | 'getafe'
  // Municipios ajustados
  | 'alcala'
  // Resto del área metropolitana
  | 'fuera-m30';

export type Antiguedad = 'pre-1950' | '1950-1980' | '1980-2000' | 'post-2000';

export type Calidad = 'basico' | 'medio' | 'alto' | 'premium';

export type EstadoActual = 'estrenar' | 'vivido-obsoleto' | 'parcial-reformado';

export type Plazo = 'sin-prisa' | '3-6-meses' | 'urgente';

/** Rango de presupuesto declarado por el cliente. Más útil que un número exacto
 *  para cualificar leads sin pedir compromiso. */
export type PresupuestoRango =
  | 'menos-40'
  | '40-80'
  | '80-150'
  | '150-mas'
  | 'no-se';

/** Cuándo quiere empezar la obra el cliente. Crítico para priorizar leads. */
export type Urgencia = 'este-mes' | '1-3-meses' | '3-6-meses' | 'sin-fecha';

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
  presupuestoCliente?: number; // optional, used for viability (legacy/numeric)
  presupuestoRango?: PresupuestoRango; // new — coarse range for qualification
  urgencia?: Urgencia; // new — when do they want to start
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
  /** Subtotal antes de aplicar ICIO. Útil para mostrar el desglose */
  subtotalPem?: number;
  /** Importe de ICIO calculado (3.75% del PEM) */
  icio?: number;
  /** Desglose 50/35/7.5/7.5 sobre el central, para credibilidad técnica */
  costStructure?: {
    manoObra: number;
    materiales: number;
    mediosAuxiliares: number;
    estructuraMargen: number;
  };
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
