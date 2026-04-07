export const COPY = {
  hero: {
    eyebrow: 'Consultoría de reformas · Madrid',
    title: 'Reformar tu piso en Madrid sin sustos, sin sobrecostes y con control total',
    highlight: 'control total',
    subtitle:
      'Antes de empezar, te decimos si tu reforma es viable, cuánto puede costar y qué problemas pueden aparecer.',
    inputPlaceholder: 'Ej: piso de 80 m² en Chamberí para reforma integral',
    inputCta: 'Analizar mi reforma',
    microcopy: 'Análisis gratuito en menos de 1 minuto',
    image: '/images/cota/hero-mano.png',
    imageAlt:
      'Mano de arquitecto dibujando un plano arquitectónico con luz cálida',
  },
  autoridad: {
    eyebrow: '01 · Diagnóstico',
    title: 'El problema no es reformar… es no saber en qué te estás metiendo',
    body: 'La mayoría de personas empieza una reforma sin tener claro el coste real, los tiempos ni los riesgos. Y eso es exactamente lo que provoca retrasos, sobrecostes y decisiones mal tomadas.',
    closing: 'Nosotros lo hacemos al revés.',
    image: '/images/cota/autoridad-01-diagnostico.jpg',
    imageAlt: 'Manos de arquitecto analizando un plano con regla y lápiz',
    problemas: [
      {
        n: '01',
        title: 'Coste real desconocido',
        body: 'Empezar sin saber cuánto cuesta la reforma → presupuesto inicial irreal, sobrecostes a mitad de obra.',
        image: '/images/cota/autoridad-01-diagnostico.jpg',
        imageAlt: 'Manos de arquitecto sobre un plano con lápiz y regla',
      },
      {
        n: '02',
        title: 'Tiempos imprecisos',
        body: 'Plazos optimistas sin margen para imprevistos → meses extra viviendo en obra.',
        image: '/images/cota/autoridad-02-tiempos.png',
        imageAlt: 'Comparativa antes y después de una reforma de salón en Madrid',
      },
      {
        n: '03',
        title: 'Riesgos invisibles',
        body: 'Estructura, instalaciones, comunidad. Problemas que aparecen tarde y cuestan caro.',
        image: '/images/cota/autoridad-03-riesgos.png',
        imageAlt: 'Antes y después dramático de un piso reformado',
      },
    ],
  },
  propuesta: {
    eyebrow: '02 · Método',
    title: 'Primero entiendes tu reforma. Luego decides si hacerla.',
    bullets: [
      'Te damos un rango de precio realista',
      'Detectamos problemas antes de empezar',
      'Te decimos si tu idea es viable (aunque no nos contrates)',
      'Solo trabajamos en proyectos que encajan',
    ],
    // Word in each bullet that gets the gold accent treatment.
    // Must match exactly a word present in the corresponding bullet string.
    accents: ['realista', 'antes', 'viable', 'encajan'],
  },
  escenarios: {
    eyebrow: '03 · Casos reales',
    title: 'Lo que suele pasar en una reforma (y cómo evitarlo)',
    cards: [
      {
        title: 'Piso de 70 m² con presupuesto corto',
        body: 'Quieren una reforma integral con 25.000 €. La realidad: no es viable sin recortar calidad o alcance.',
        closing: 'Lo detectamos antes de empezar.',
        image: '/images/cota/escenario-1.jpeg',
        imageAlt:
          'Collage editorial de un piso vintage con problemas marcados en rojo',
      },
      {
        title: 'Reforma sin planificación técnica',
        body: 'Empiezan obra sin proyecto claro. Resultado: cambios constantes y sobrecostes.',
        closing: 'Por eso primero analizamos.',
        image: '/images/cota/escenario-2-planificacion.png',
        imageAlt:
          'Manos de arquitecto trazando un plano técnico antes de empezar la obra',
      },
      {
        title: 'Presupuesto barato que acaba siendo caro',
        body: 'Oferta inicial atractiva. Pero aparecen extras en obra.',
        closing: 'Te mostramos el coste real desde el inicio.',
        image: '/images/cota/escenario-3-cocina.png',
        imageAlt:
          'Cocina reformada con acabados premium en mármol blanco y latón',
      },
    ],
  },
  comoFunciona: {
    eyebrow: '04 · Proceso',
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
    eyebrow: '05 · Criterio',
    title: 'No trabajamos con todos los proyectos',
    body: 'Solo aceptamos reformas donde podemos garantizar resultado, control y calidad.',
    closing: 'Si tu proyecto encaja, te lo diremos. Si no, también.',
    image:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80',
    imageAlt: 'Interior reformado minimalista con líneas arquitectónicas limpias',
  },
  agenda: {
    eyebrow: '06 · Agenda',
    title: 'Reserva una sesión de planificación',
    image:
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=2000&q=80',
    imageAlt: 'Mesa de arquitecto con planos y herramientas de planificación',
    options: [
      { icon: 'Phone', title: 'Llamada inicial', duration: '15 min', body: 'Para entender tu caso rápidamente.' },
      { icon: 'Monitor', title: 'Videollamada', duration: '30 min', body: 'Para analizar tu reforma en detalle.' },
      { icon: 'Home', title: 'Visita técnica', duration: 'Premium', body: 'Solo para proyectos avanzados.' },
    ],
  },
  cierre: {
    title: 'Reformar sin información es arriesgado. Hacerlo con claridad lo cambia todo.',
    cta: 'Empezar mi diagnóstico',
  },
} as const;
