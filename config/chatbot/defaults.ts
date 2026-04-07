import type { ChatbotConfig } from '@/lib/chatbot/types';

export const DEFAULT_CONFIG: ChatbotConfig = {
  systemPrompt: `Eres el asesor virtual de Cota Madrid, una consultoría premium especializada en reformas integrales de viviendas en Madrid.

Tu misión: ayudar a los usuarios a entender si su reforma es viable, cuánto puede costar y qué riesgos puede tener, con un tono profesional, cercano, claro y honesto. Siempre en español de España.

Reglas:
- Responde de forma breve y útil (2-5 frases salvo que el usuario pida detalle).
- Basa tus respuestas en la base de conocimiento que tienes a continuación.
- Si no sabes algo con certeza, dilo y sugiere hablar con el equipo humano por WhatsApp o rellenar el diagnóstico.
- Cuando detectes intención real (proyecto concreto, presupuesto, plazos), invita amablemente al usuario a hacer el diagnóstico gratuito en /diagnostico, sin presionar.
- Nunca inventes precios cerrados; usa rangos orientativos.
- No hables de temas ajenos a reformas, vivienda, Cota o Madrid.`,
  knowledge: [
    {
      topic: 'Qué es Cota',
      content:
        'Cota es una consultoría premium de reformas en Madrid. Antes de empezar, analizamos viabilidad técnica, coste estimado y riesgos del proyecto. Acompañamos al cliente desde el diagnóstico hasta la entrega.',
    },
    {
      topic: 'Diagnóstico gratuito',
      content:
        'Ofrecemos un diagnóstico online gratuito en /diagnostico. El usuario contesta unas preguntas y recibe un informe con viabilidad, rango de precio y principales riesgos.',
    },
    {
      topic: 'Precios orientativos por tipo de reforma',
      content:
        'Reforma integral en Madrid: 900-1.500 €/m² gama media, 1.500-2.500 €/m² gama alta, 2.500 €/m² o más en gama premium. Cocina aislada: 8.000-25.000 €. Baño aislado: 4.500-12.000 €.',
    },
    {
      topic: 'Diferencias por barrio',
      content:
        'Salamanca, Chamberí y Justicia suelen estar en gama alta o premium por exigencias de comunidad y acabados. Tetuán, Carabanchel o Vallecas permiten más rangos medios. La ubicación afecta a logística (acceso, horarios de carga) y a coste.',
    },
    {
      topic: 'Plazos típicos',
      content:
        'Reforma integral 70-100 m²: 10-16 semanas de obra. Sumar 2-4 semanas de proyecto y permisos. Cocina o baño aislados: 3-6 semanas.',
    },
    {
      topic: 'Riesgos comunes',
      content:
        'Estructuras antiguas con vigas de madera, instalaciones de plomo o aluminio, humedades no detectadas, comunidades restrictivas, licencias municipales y elementos protegidos en edificios catalogados.',
    },
    {
      topic: 'Licencias',
      content:
        'En Madrid, una reforma sin afectar estructura ni distribución suele ir por declaración responsable. Si tocas tabiques, fachada o instalaciones generales, puede requerir licencia urbanística.',
    },
    {
      topic: 'Cómo funciona el proceso',
      content:
        '1) Diagnóstico online gratis. 2) Visita técnica si encaja. 3) Anteproyecto con coste cerrado y plazos. 4) Ejecución con jefe de obra dedicado. 5) Entrega y postventa.',
    },
    {
      topic: 'Garantías',
      content:
        'Garantía de 2 años en acabados y 10 años en elementos estructurales según ley. Postventa activa los primeros 12 meses sin coste.',
    },
    {
      topic: 'Contacto WhatsApp',
      content:
        'Puedes hablar con el equipo humano por WhatsApp pulsando el botón verde en la esquina inferior derecha de la web.',
    },
    {
      topic: 'Pago y financiación',
      content:
        'Trabajamos con hitos por avance de obra. No exigimos pagos iniciales agresivos. Podemos orientar sobre financiación bancaria si el cliente lo solicita.',
    },
    {
      topic: 'Zonas de servicio',
      content:
        'Operamos en Madrid capital y municipios cercanos del área metropolitana. Para proyectos fuera de esta zona, evaluamos caso a caso.',
    },
  ],
  providers: [
    { id: 'groq', name: 'Groq', model: 'llama-3.3-70b-versatile', enabled: true, apiKeyEnv: 'GROQ_API_KEY' },
    { id: 'deepseek', name: 'DeepSeek', model: 'deepseek-chat', enabled: true, apiKeyEnv: 'DEEPSEEK_API_KEY' },
    { id: 'openai', name: 'OpenAI', model: 'gpt-4o-mini', enabled: true, apiKeyEnv: 'OPENAI_API_KEY' },
    { id: 'claude', name: 'Anthropic Claude', model: 'claude-sonnet-4-5', enabled: true, apiKeyEnv: 'ANTHROPIC_API_KEY' },
    { id: 'gemini', name: 'Google Gemini', model: 'gemini-2.0-flash', enabled: true, apiKeyEnv: 'GEMINI_API_KEY' },
  ],
};
