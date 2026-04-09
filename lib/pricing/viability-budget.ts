import type {
  PresupuestoRango,
  ReformType,
  Urgencia,
  WizardAnswers,
} from './types';

/** Mapping de rango → punto medio numérico, para comparar contra el cálculo. */
export const PRESUPUESTO_MIDPOINT: Record<PresupuestoRango, number> = {
  'menos-40': 30_000,
  '40-80': 60_000,
  '80-150': 115_000,
  '150-mas': 200_000,
  'no-se': 0,
};

export const PRESUPUESTO_MIN: Record<PresupuestoRango, number> = {
  'menos-40': 0,
  '40-80': 40_000,
  '80-150': 80_000,
  '150-mas': 150_000,
  'no-se': 0,
};

export const PRESUPUESTO_MAX: Record<PresupuestoRango, number> = {
  'menos-40': 40_000,
  '40-80': 80_000,
  '80-150': 150_000,
  '150-mas': 1_000_000,
  'no-se': 1_000_000,
};

/** ¿Es el rango del cliente claramente insuficiente para esta obra?
 *  Definimos "insuficiente" como < 50% del mínimo realista calculado. */
export function isBudgetUnrealistic(
  rango: PresupuestoRango | undefined,
  realisticMin: number
): boolean {
  if (!rango || rango === 'no-se') return false;
  const max = PRESUPUESTO_MAX[rango];
  return max < realisticMin * 0.5;
}

/** Score de calidad del lead 0-100, combinando match de presupuesto + urgencia
 *  + viabilidad del proyecto. Cuanto más alto, más caliente. */
export type LeadQuality = 'alto' | 'medio' | 'bajo';

export interface LeadScore {
  score: number; // 0-100
  quality: LeadQuality;
  reasons: string[];
}

const URGENCIA_POINTS: Record<Urgencia, number> = {
  'este-mes': 30,
  '1-3-meses': 25,
  '3-6-meses': 15,
  'sin-fecha': 5,
};

export function scoreLead(
  answers: WizardAnswers,
  realisticMin: number,
  realisticMax: number
): LeadScore {
  let score = 0;
  const reasons: string[] = [];

  // Urgencia → 0-30 puntos
  if (answers.urgencia) {
    const u = URGENCIA_POINTS[answers.urgencia];
    score += u;
    if (u >= 25) reasons.push('Urgencia alta');
    else if (u >= 15) reasons.push('Margen razonable');
    else reasons.push('Sin fecha definida');
  }

  // Match de presupuesto → 0-50 puntos
  if (answers.presupuestoRango && answers.presupuestoRango !== 'no-se') {
    const min = PRESUPUESTO_MIN[answers.presupuestoRango];
    const max = PRESUPUESTO_MAX[answers.presupuestoRango];
    if (max < realisticMin * 0.5) {
      // Muy bajo → 0
      score += 0;
      reasons.push('Presupuesto muy ajustado');
    } else if (max < realisticMin) {
      // Bajo pero recuperable → 15
      score += 15;
      reasons.push('Presupuesto justo');
    } else if (min >= realisticMin && max <= realisticMax * 1.2) {
      // En rango → 50
      score += 50;
      reasons.push('Presupuesto encaja');
    } else if (min > realisticMax * 1.2) {
      // Holgado → 45
      score += 45;
      reasons.push('Presupuesto holgado');
    } else {
      // Solapamiento parcial → 30
      score += 30;
      reasons.push('Presupuesto razonable');
    }
  } else if (answers.presupuestoRango === 'no-se') {
    score += 10;
    reasons.push('Sin idea de presupuesto');
  }

  // Tipo de obra → 0-20 puntos (integral vale más)
  const TIPO_POINTS: Record<ReformType, number> = {
    integral: 20,
    parcial: 15,
    cocina: 10,
    'zona-humeda': 10,
  };
  score += TIPO_POINTS[answers.tipo];

  let quality: LeadQuality;
  if (score >= 65) quality = 'alto';
  else if (score >= 40) quality = 'medio';
  else quality = 'bajo';

  return { score, quality, reasons };
}
