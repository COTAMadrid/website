import type {
  PriceEstimate,
  Viability,
  ViabilityLevel,
  WizardAnswers,
} from '@/lib/pricing/types';

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '34600000000';

const CTA_BY_LEVEL: Record<ViabilityLevel, { label: string; href: string }> = {
  alta: {
    label: 'Reservar sesión de planificación',
    href: '#agenda',
  },
  media: {
    label: 'Llamada inicial de 15 minutos',
    href: '#agenda',
  },
  baja: {
    label: 'Hablar por WhatsApp',
    href: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      'Hola, vengo del diagnóstico de Cota.'
    )}`,
  },
};

const MICROCOPY: Record<ViabilityLevel, string> = {
  alta: 'Tu proyecto encaja con nuestro tipo de reformas. Vamos a planificarlo bien desde el inicio.',
  media:
    'Podemos ayudarte, pero hay puntos clave que necesitamos hablar antes de avanzar.',
  baja: 'Por las características de tu proyecto, no somos la mejor opción. Si quieres, podemos orientarte hacia alguien que sí lo sea.',
};

/**
 * Spec §5.5 — viability rules.
 * Order matters: BAJA is checked first, then MEDIA, then ALTA as default.
 */
export function evaluateViability(
  a: WizardAnswers,
  estimate: PriceEstimate
): Viability {
  const level = computeLevel(a, estimate);
  return {
    level,
    microcopy: MICROCOPY[level],
    cta: CTA_BY_LEVEL[level],
  };
}

function computeLevel(a: WizardAnswers, estimate: PriceEstimate): ViabilityLevel {
  // BAJA conditions (any one)
  if (a.tipo === 'zona-humeda' || a.tipo === 'cocina') return 'baja';
  if (a.metros < 30) return 'baja';
  if (
    a.presupuestoCliente !== undefined &&
    a.presupuestoCliente < estimate.min * 0.7
  ) {
    return 'baja';
  }

  // MEDIA conditions (any one)
  if (
    a.presupuestoCliente !== undefined &&
    a.presupuestoCliente >= estimate.min * 0.7 &&
    a.presupuestoCliente < estimate.min
  ) {
    return 'media';
  }
  if (a.plazo === 'urgente') return 'media';
  if (a.calidad === 'basico') return 'media';
  if (a.metros < 50 || a.metros > 200) return 'media';

  // ALTA otherwise
  return 'alta';
}
