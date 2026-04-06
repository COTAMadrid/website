export const COPY = {
  hero: {
    title: 'Reformar tu piso en Madrid sin sustos, sin sobrecostes y con control total',
    subtitle:
      'Antes de empezar, te decimos si tu reforma es viable, cuánto puede costar y qué problemas pueden aparecer.',
    inputPlaceholder: 'Ej: piso de 80 m² en Chamberí para reforma integral',
    inputCta: 'Analizar mi reforma',
    microcopy: 'Análisis gratuito en menos de 1 minuto',
  },
  autoridad: {
    title: 'El problema no es reformar… es no saber en qué te estás metiendo',
    body: 'La mayoría de personas empieza una reforma sin tener claro el coste real, los tiempos ni los riesgos. Y eso es exactamente lo que provoca retrasos, sobrecostes y decisiones mal tomadas.',
    closing: 'Nosotros lo hacemos al revés.',
  },
  propuesta: {
    title: 'Primero entiendes tu reforma. Luego decides si hacerla.',
    bullets: [
      'Te damos un rango de precio realista',
      'Detectamos problemas antes de empezar',
      'Te decimos si tu idea es viable (aunque no nos contrates)',
      'Solo trabajamos en proyectos que encajan',
    ],
  },
  escenarios: {
    title: 'Lo que suele pasar en una reforma (y cómo evitarlo)',
    cards: [
      {
        title: 'Piso de 70 m² con presupuesto corto',
        body: 'Quieren una reforma integral con 25.000 €. La realidad: no es viable sin recortar calidad o alcance.',
        closing: 'Lo detectamos antes de empezar.',
      },
      {
        title: 'Reforma sin planificación técnica',
        body: 'Empiezan obra sin proyecto claro. Resultado: cambios constantes y sobrecostes.',
        closing: 'Por eso primero analizamos.',
      },
      {
        title: 'Presupuesto barato que acaba siendo caro',
        body: 'Oferta inicial atractiva. Pero aparecen extras en obra.',
        closing: 'Te mostramos el coste real desde el inicio.',
      },
    ],
  },
  comoFunciona: {
    title: 'Así trabajamos contigo',
    steps: [
      {
        n: '01',
        title: 'Analizamos tu caso',
        body: 'Entendemos tu piso, tus objetivos y tu presupuesto.',
      },
      {
        n: '02',
        title: 'Te damos claridad',
        body: 'Precio estimado, tiempos y riesgos antes de empezar.',
      },
      {
        n: '03',
        title: 'Planificamos contigo',
        body: 'Solo si tiene sentido avanzar.',
      },
    ],
  },
  filtrado: {
    title: 'No trabajamos con todos los proyectos',
    body: 'Solo aceptamos reformas donde podemos garantizar resultado, control y calidad.',
    closing: 'Si tu proyecto encaja, te lo diremos. Si no, también.',
  },
  agenda: {
    title: 'Reserva una sesión de planificación',
    options: [
      { icon: '📞', title: 'Llamada inicial', duration: '15 min', body: 'Para entender tu caso rápidamente.' },
      { icon: '💻', title: 'Videollamada', duration: '30 min', body: 'Para analizar tu reforma en detalle.' },
      { icon: '🏠', title: 'Visita técnica', duration: 'Premium', body: 'Solo para proyectos avanzados.' },
    ],
  },
  cierre: {
    title: 'Reformar sin información es arriesgado. Hacerlo con claridad lo cambia todo.',
    cta: 'Empezar mi diagnóstico',
  },
} as const;
