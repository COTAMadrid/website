import type {
  Antiguedad,
  Barrio,
  Calidad,
  EstadoActual,
  Plazo,
  ReformType,
} from '@/lib/pricing/types';

export interface WizardOption<T> {
  value: T;
  label: string;
  description?: string;
}

export const TIPO_OPTIONS: WizardOption<ReformType>[] = [
  {
    value: 'integral',
    label: 'Reforma integral',
    description: 'Toda la vivienda de cero',
  },
  {
    value: 'parcial',
    label: 'Reforma parcial',
    description: 'Varias zonas pero no todo',
  },
  {
    value: 'zona-humeda',
    label: 'Solo baño/s',
    description: 'Sustitución de zonas húmedas',
  },
  { value: 'cocina', label: 'Solo cocina', description: 'Cocina aislada' },
];

export const BARRIO_OPTIONS: WizardOption<Barrio>[] = [
  { value: 'salamanca', label: 'Salamanca' },
  { value: 'chamberi', label: 'Chamberí' },
  { value: 'justicia', label: 'Justicia / Chueca' },
  { value: 'centro', label: 'Centro / Sol' },
  { value: 'chamartin', label: 'Chamartín' },
  { value: 'retiro', label: 'Retiro' },
  { value: 'moncloa', label: 'Moncloa / Argüelles' },
  { value: 'tetuan', label: 'Tetuán' },
  { value: 'arganzuela', label: 'Arganzuela' },
  { value: 'latina', label: 'Latina' },
  { value: 'carabanchel', label: 'Carabanchel' },
  { value: 'otros', label: 'Otro distrito de Madrid' },
  { value: 'fuera-m30', label: 'Fuera de la M-30' },
];

export const ANTIGUEDAD_OPTIONS: WizardOption<Antiguedad>[] = [
  { value: 'pre-1950', label: 'Anterior a 1950' },
  { value: '1950-1980', label: '1950 – 1980' },
  { value: '1980-2000', label: '1980 – 2000' },
  { value: 'post-2000', label: 'Posterior a 2000' },
];

export const CALIDAD_OPTIONS: WizardOption<Calidad>[] = [
  {
    value: 'basico',
    label: 'Básico-funcional',
    description: 'Habitable y digno, sin lujos',
  },
  {
    value: 'medio',
    label: 'Medio-bueno',
    description: 'Marcas conocidas, buenos acabados',
  },
  {
    value: 'alto',
    label: 'Alto',
    description: 'Carpintería a medida, climatización seria',
  },
  {
    value: 'premium',
    label: 'Premium',
    description: 'Materiales nobles, todo a medida',
  },
];

export const ESTADO_OPTIONS: WizardOption<EstadoActual>[] = [
  { value: 'estrenar', label: 'Recién comprado, a reformar' },
  { value: 'vivido-obsoleto', label: 'Vivido y obsoleto' },
  { value: 'parcial-reformado', label: 'Parcialmente reformado' },
];

export const PLAZO_OPTIONS: WizardOption<Plazo>[] = [
  { value: 'sin-prisa', label: 'Sin prisa' },
  { value: '3-6-meses', label: '3 – 6 meses' },
  { value: 'urgente', label: 'Urgente (menos de 3 meses)' },
];

/**
 * Total wizard step count, used for the progress bar.
 * tipo, metros, barrio, antiguedad, calidad, estado, plazo, extras, presupuesto, contacto = 10
 */
export const WIZARD_STEP_COUNT = 10;
