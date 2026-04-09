import type {
  Antiguedad,
  Barrio,
  Calidad,
  EstadoActual,
  Plazo,
  PresupuestoRango,
  ReformType,
  Urgencia,
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

export const PRESUPUESTO_OPTIONS: WizardOption<PresupuestoRango>[] = [
  {
    value: 'menos-40',
    label: 'Menos de 40.000 €',
    description: 'Reformas puntuales o muy básicas',
  },
  {
    value: '40-80',
    label: 'Entre 40.000 € y 80.000 €',
    description: 'Reformas parciales o pisos pequeños',
  },
  {
    value: '80-150',
    label: 'Entre 80.000 € y 150.000 €',
    description: 'Reformas integrales con buenos acabados',
  },
  {
    value: '150-mas',
    label: 'Más de 150.000 €',
    description: 'Reformas premium o pisos grandes',
  },
  {
    value: 'no-se',
    label: 'Aún no lo sé',
    description: 'Quiero saber el rango realista primero',
  },
];

export const URGENCIA_OPTIONS: WizardOption<Urgencia>[] = [
  {
    value: 'este-mes',
    label: 'Este mes',
    description: 'Tengo prisa, quiero empezar ya',
  },
  {
    value: '1-3-meses',
    label: 'En 1 – 3 meses',
    description: 'Estoy organizando para empezar pronto',
  },
  {
    value: '3-6-meses',
    label: 'En 3 – 6 meses',
    description: 'Hay margen para planificar bien',
  },
  {
    value: 'sin-fecha',
    label: 'Sin fecha cerrada',
    description: 'Estoy explorando opciones',
  },
];

/**
 * Total wizard step count, used for the progress bar.
 * Order: tipo · presupuesto · urgencia · metros · barrio · antiguedad · calidad
 *      · estado · plazo · extras · contacto = 11
 */
export const WIZARD_STEP_COUNT = 11;
