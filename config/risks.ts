import type { Risk, WizardAnswers } from '@/lib/pricing/types';

interface RiskRule {
  id: string;
  title: string;
  description: string;
  severity: Risk['severity'];
  applies: (a: WizardAnswers) => boolean;
}

export const RISK_RULES: RiskRule[] = [
  {
    id: 'instalaciones-obsoletas',
    title: 'Instalaciones obsoletas casi seguras',
    description:
      'Edificios anteriores a 1950 normalmente requieren renovar electricidad, fontanería y gas para cumplir normativa actual.',
    severity: 'warning',
    applies: (a) => a.antiguedad === 'pre-1950',
  },
  {
    id: 'asbesto',
    title: 'Posible presencia de amianto',
    description:
      'Es habitual encontrar materiales con amianto en bajantes y bajocubiertas anteriores a 1980. Requieren retirada certificada.',
    severity: 'critical',
    applies: (a) => a.antiguedad === 'pre-1950' || a.antiguedad === '1950-1980',
  },
  {
    id: 'logistica-sin-ascensor',
    title: 'Logística sin ascensor',
    description:
      'Subir material y bajar escombro a mano alarga plazos y aumenta jornales. Conviene preverlo desde el presupuesto.',
    severity: 'warning',
    applies: (a) => a.extras.sinAscensor,
  },
  {
    id: 'patrimonio',
    title: 'Trámites con patrimonio',
    description:
      'Edificios catalogados requieren licencias específicas y materiales aprobados. Los plazos administrativos pueden añadir 1-2 meses.',
    severity: 'warning',
    applies: (a) => a.extras.edificioProtegido,
  },
  {
    id: 'urgencia',
    title: 'Margen ajustado por urgencia',
    description:
      'Con un plazo inferior a 3 meses, cualquier imprevisto compromete la fecha final. Recomendable doblar equipos.',
    severity: 'warning',
    applies: (a) => a.plazo === 'urgente',
  },
  {
    id: 'zbe',
    title: 'Restricciones de acceso (ZBE)',
    description:
      'Madrid Central limita el acceso de vehículos pesados. Carga y descarga requieren permisos específicos.',
    severity: 'info',
    applies: (a) => a.extras.zonaBajasEmisiones,
  },
  {
    id: 'demolicion-pesada',
    title: 'Demolición más laboriosa',
    description:
      'Pisos vividos durante décadas suelen acumular capas de reformas previas. La demolición es más lenta y genera más residuos.',
    severity: 'info',
    applies: (a) => a.estado === 'vivido-obsoleto',
  },
  {
    id: 'reserva-imprevistos',
    title: 'Reserva para imprevistos',
    description:
      'Recomendamos siempre reservar un 10-15% del presupuesto para imprevistos. En reformas integrales no es opcional.',
    severity: 'info',
    applies: (a) => a.tipo === 'integral',
  },
];

export function evaluateRisks(a: WizardAnswers): Risk[] {
  return RISK_RULES.filter((r) => r.applies(a)).map(({ applies, ...risk }) => risk);
}
