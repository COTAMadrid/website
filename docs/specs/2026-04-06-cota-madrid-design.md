# Cota — Spec de diseño del proyecto

**Fecha:** 2026-04-06
**Autor:** Brainstorming colaborativo (Paulo + Claude)
**Estado:** Borrador para revision del cliente

---

## 1. Resumen ejecutivo

**Cota** es una marca comercial nueva, frontal premium de la empresa **PCH Obras** (10 años de oficio en reformas de baños y reformas integrales puntuales en Madrid). El objetivo del proyecto es lanzar una **landing premium con diagnostico interactivo** que reposicione a la empresa en el segmento de **reforma integral de pisos en Madrid**, dirigida a un publico medio-alto y premium.

La web se diferencia del resto del sector por **vender claridad antes que obra**: el visitante completa un diagnostico guiado de 60 segundos y recibe un informe con rango de precio, duracion estimada, riesgos detectados y veredicto de viabilidad. Este enfoque convierte la incertidumbre del cliente en una decision informada y posiciona a Cota como un consultor con manos, no como otra empresa de reformas mas.

---

## 2. Marca y posicionamiento

| Elemento | Decision |
|---|---|
| **Marca comercial** | Cota |
| **Empresa legal detras** | PCH Obras (sin tocar) |
| **Dominio principal** | cotamadrid.com |
| **Dominio defensivo** | cotamadrid.es (redirige al .com) |
| **Tagline candidato** | "Reforma con criterio" / "La medida exacta de tu reforma" (a afinar en fase de copy) |
| **Tono de marca** | Confianza + Claridad (excluye lujo/atelier y oficio/taller) |
| **Territorio semantico del nombre** | Certeza + Metodo (Cota = medida exacta en un plano arquitectonico) |
| **Publico objetivo principal** | Mezcla medio-alto y premium en Madrid: pisos en Salamanca, Chamberi, Chamartin, Centro, Retiro. Ticket esperado 35k–150k+. Compran tranquilidad, control y cero sustos. |
| **Posicionamiento estrategico** | "No vendemos reformas. Analizamos decisiones." Consultor antes que ejecutor. Resuelve elegantemente la falta de portfolio de pisos integrales. |

---

## 3. Alcance del MVP (MVP-B)

**Decision:** se construye **MVP-B** (estatico premium + diagnostico wow). Se descartan A (insuficiente) y C (sobreingenieria).

### Lo que SI entra en V1
- Hero impactante con titular, subtitulo e input directo
- Bloques de copy del brief: autoridad, propuesta de valor, como funciona, filtrado, escenarios reales, agenda, WhatsApp, cierre
- **Diagnostico guiado (wizard)** de 7 preguntas con animaciones suaves y progreso visual
- **Pantalla de resultado tipo informe**: rango de precio, duracion, riesgos, viabilidad (verde/amarillo/rojo), CTA dinamico
- **Filtrado automatico de leads** segun viabilidad
- **Envio de leads** a email + Google Sheets (ver §6)
- Agenda integrada (Cal.com o similar)
- WhatsApp flotante condicional
- Diseño visual premium (oscuro + blanco + acento, tipografia editorial)
- Mobile-first perfecto
- SEO basico para "reforma piso madrid" y variantes
- Cumplimiento RGPD basico (cookies, politica de privacidad, aviso legal)

### Lo que NO entra en V1 (queda para V2+)
- Chatbot integrado tipo "asesor disponible"
- Casos interactivos con detalle expandible
- Backoffice CMS bonito (las reglas viven en archivos del codigo, ver §5)
- Animaciones premium en todos los bloques (solo en hero y wizard)
- Integracion con Bitrix24 o CRM propio (se hace cuando este listo el CRM propio)
- Multiidioma

---

## 4. Stack tecnico

| Capa | Tecnologia | Razon |
|---|---|---|
| **Framework** | Next.js 15 (App Router) + React 19 | Estandar premium 2026, SEO, performance |
| **Lenguaje** | TypeScript | Seguridad de tipos, mantenible |
| **Estilos** | Tailwind CSS v4 | Velocidad de iteracion, consistencia |
| **Componentes UI** | shadcn/ui | Codigo en el repo, control total |
| **Animaciones** | Framer Motion | Estandar premium |
| **Iconos** | Lucide | Limpio, minimalista |
| **Formularios/wizard** | React Hook Form + Zod | Validacion robusta |
| **Email transaccional** | Resend | Free tier sobra |
| **Google Sheets API** | googleapis (Node) | Append de leads |
| **Hosting** | Vercel | 1-click deploy, preview deployments, analytics incluidos |
| **Repositorio** | GitHub privado | Deploy automatico Vercel |
| **Analytics** | Vercel Analytics | Incluido, sin cookies |

**Flujo de trabajo:**
1. Local: `npm run dev` → preview en `localhost:3000` con hot reload (Antigravity / Chrome / cualquier navegador)
2. Preview Vercel: cada commit genera URL publica unica para enseñar a terceros
3. Produccion: despliegue manual con 1 click cuando el cliente diga "ok"

---

## 5. Motor de estimacion (corazon del proyecto)

### 5.1 Las 7 preguntas del wizard

1. **Tipo de reforma**: integral / parcial / solo zona humeda / solo cocina
2. **Metros cuadrados** (input numerico)
3. **Zona/barrio**: Salamanca, Chamberi, Justicia, Centro, Chamartin, Retiro, Moncloa, Tetuan, Arganzuela, Latina, Carabanchel, otros, fuera M-30
4. **Antigüedad del edificio**: anterior 1950 / 1950–1980 / 1980–2000 / posterior 2000
5. **Nivel de calidad buscado**: basico-funcional / medio-bueno / alto / premium
6. **Estado actual del piso**: a estrenar / vivido y obsoleto / parcialmente reformado
7. **Plazo deseado**: sin prisa / 3–6 meses / urgente (<3 meses)

### 5.2 Rangos de precio base (€/m²) — Madrid 2026

| Nivel | €/m² (rango) |
|---|---|
| Basico-funcional | 600 – 850 |
| Medio-bueno | 850 – 1.200 |
| Alto | 1.200 – 1.700 |
| Premium | 1.700 – 2.500+ |

> **Calibracion:** validados como realistas por el cliente (PCH Obras, 10 años de mercado Madrid).

### 5.3 Modificadores

#### Por barrio
| Barrio | Factor |
|---|---|
| Salamanca, Chamberi, Justicia, Centro | × 1.15 |
| Chamartin, Retiro, Moncloa | × 1.08 |
| Tetuan, Arganzuela, Latina, Carabanchel | × 1.00 |
| Fuera M-30 | × 0.95 |

#### Por antigüedad
| Antigüedad | Factor |
|---|---|
| Anterior a 1950 | × 1.20 |
| 1950 – 1980 | × 1.10 |
| 1980 – 2000 | × 1.00 |
| Posterior a 2000 | × 0.95 |

#### Por plazo
| Plazo | Factor |
|---|---|
| Sin prisa | × 0.95 |
| 3–6 meses | × 1.00 |
| Urgente (<3 meses) | × 1.15 |

#### Por estado actual
| Estado | Factor |
|---|---|
| A estrenar | × 1.00 |
| Vivido y obsoleto | × 1.05 |
| Parcialmente reformado | × 0.90 |

#### Modificadores adicionales (preguntas extra del wizard, ver nota)
| Modificador | Factor |
|---|---|
| Sin ascensor | × 1.10 |
| Edificio protegido / catalogado | × 1.10 |
| Zona Bajas Emisiones (ZBE) Madrid Central | × 1.05 |

> **Nota:** estos 3 modificadores extra implican preguntas adicionales en el wizard. Se añadiran como sub-preguntas opcionales o como checkboxes en el paso de barrio/antigüedad para no romper la regla de "max 7 pasos" del wizard. Decision concreta de UX se tomara en fase de diseño visual.

### 5.4 Formula de calculo

```
precio_base = m² × media(€/m²_segun_calidad)
precio_estimado = precio_base
                × factor_barrio
                × factor_antigüedad
                × factor_plazo
                × factor_estado
                × factor_sin_ascensor (si aplica)
                × factor_protegido (si aplica)
                × factor_ZBE (si aplica)

rango_mostrado = precio_estimado × [0.85 ; 1.15]
```

**Calibracion validada:** piso 80m² en Salamanca, edificio de 1920, vivido, calidad medio-buena, sin prisa → rango **96.000 € – 130.000 €** (confirmado realista por el cliente).

### 5.5 Reglas de viabilidad

#### 🟢 ALTA — Cliente ideal
**Todas estas condiciones:**
- Presupuesto del cliente ≥ rango bajo del informe
- Plazo: sin prisa o 3–6 meses
- Calidad: medio-bueno, alto o premium
- m² entre 50 y 200

**CTA:** "Reservar sesion de planificacion" (videollamada 30 min o visita tecnica)
**Microcopy:** *"Tu proyecto encaja con nuestro tipo de reformas. Vamos a planificarlo bien desde el inicio."*

#### 🟡 MEDIA — Hay puntos a definir
**Al menos una:**
- Presupuesto entre 70%–100% del rango bajo
- Plazo urgente
- Calidad basico-funcional
- m² < 50 o > 200

**CTA:** "Llamada inicial de 15 minutos"
**Microcopy:** *"Podemos ayudarte, pero hay puntos clave que necesitamos hablar antes de avanzar."*

#### 🔴 BAJA — No somos la mejor opcion
**Al menos una:**
- Presupuesto < 70% del rango bajo
- Reforma "solo zona humeda" o muy parcial
- Solo cocina aislada
- m² < 30

**CTA:** WhatsApp directo, sin agenda
**Microcopy:** *"Por las caracteristicas de tu proyecto, no somos la mejor opcion. Si quieres, podemos orientarte hacia alguien que si lo sea."*

### 5.6 Riesgos detectados (lista dinamica)

Cada respuesta del wizard puede añadir 0–N riesgos a la lista que aparece en el informe. Ejemplos:

- **Edificio anterior a 1950** → "Posible necesidad de renovar instalaciones obsoletas (electricidad, fontaneria, gas)"
- **Edificio anterior a 1950** → "Posibles materiales con asbesto que requieren tratamiento especializado"
- **Sin ascensor** → "Logistica de carga y descarga afecta plazos y coste"
- **Edificio protegido** → "Tramites adicionales con patrimonio que pueden alargar plazos"
- **Plazo urgente** → "Margen ajustado: cualquier imprevisto compromete la fecha"
- **Presupuesto en limite bajo** → "Margen pequeño para imprevistos: recomendable reserva del 15%"
- **Reforma integral en zona ZBE** → "Restricciones de acceso para vehiculos pesados"
- **Vivido y obsoleto** → "Demolicion mas pesada por capas de reformas anteriores"

La lista exhaustiva de riesgos por combinacion de respuestas se definira en fase de implementacion, en `config/risks.ts`.

---

## 6. Captura y destino de leads

### 6.1 Datos capturados por lead

- Las 7 respuestas del wizard
- Modificadores adicionales aplicados (sin ascensor, protegido, ZBE)
- Rango calculado (min – max)
- Duracion estimada
- Viabilidad (verde/amarillo/rojo)
- Riesgos detectados
- Datos de contacto (nombre, email, telefono)
- Timestamp
- UTM source si viene de campaña

### 6.2 Destinos en V1

1. **Email instantaneo via Resend** → llega a `info@cotamadrid.com` (o el que decida el cliente) con HTML formateado: resumen del lead, semaforo de viabilidad, boton "responder por WhatsApp" con mensaje pre-rellenado.
2. **Append automatico a Google Sheet** → cada lead = una fila nueva. El cliente accede desde cualquier dispositivo, descarga como `.xlsx`, comparte con su equipo.

### 6.3 Arquitectura preparada para migracion

**Patron repository:** la logica de "guardar lead" se implementa detras de una interfaz `LeadRepository` con metodos `save(lead)` y `notify(lead)`. La implementacion V1 escribe a Google Sheets + Resend. Migrar a Bitrix24 o al CRM propio en el futuro = crear una nueva implementacion de la misma interfaz, sin tocar nada del wizard ni del informe.

Lo mismo aplica al motor de estimacion: las reglas viven en `config/pricing.ts`, `config/wizard.ts`, `config/risks.ts`. Migrar a un CMS headless tipo Sanity en V2 = crear un `PricingRepository` que lea de Sanity, sin tocar el motor.

---

## 7. Estructura del proyecto

```
cota-madrid/
├── app/                       # Next.js App Router
│   ├── (marketing)/           # Landing publica
│   │   ├── page.tsx           # Home
│   │   ├── diagnostico/       # Wizard
│   │   ├── informe/           # Pantalla de resultado
│   │   ├── politica-privacidad/
│   │   ├── aviso-legal/
│   │   └── cookies/
│   └── api/
│       └── leads/             # Endpoint que recibe el lead
├── components/
│   ├── ui/                    # shadcn/ui
│   ├── marketing/             # Hero, bloques de la landing
│   └── wizard/                # Componentes del diagnostico
├── lib/
│   ├── pricing/               # Motor de estimacion
│   │   ├── calculate.ts
│   │   └── viability.ts
│   ├── leads/                 # LeadRepository + implementaciones
│   │   ├── types.ts
│   │   ├── google-sheets.ts
│   │   └── resend.ts
│   └── utils.ts
├── config/                    # Reglas editables (Nivel 1)
│   ├── pricing.ts             # €/m² + modificadores
│   ├── wizard.ts              # Preguntas del wizard
│   ├── risks.ts               # Reglas de riesgos
│   └── viability.ts           # Reglas verde/amarillo/rojo
├── content/                   # Copy editable en markdown
│   ├── hero.md
│   ├── escenarios.md
│   └── ...
├── docs/
│   └── specs/
│       └── 2026-04-06-cota-madrid-design.md  # este archivo
├── public/
└── package.json
```

---

## 8. Fases de trabajo (alto nivel)

> El plan detallado se escribira en la siguiente fase con la skill `writing-plans`.

1. **Fase 0 — Setup** (1 dia): inicializar Next.js, Tailwind, shadcn, Vercel, GitHub privado, primer deploy de "Hello World".
2. **Fase 1 — Diseño visual base** (2–3 dias): tipografia, paleta, sistema de espaciado, componentes base.
3. **Fase 2 — Landing estatica** (2–3 dias): hero + todos los bloques de copy del brief, mobile perfecto.
4. **Fase 3 — Motor de estimacion** (2–3 dias): `config/pricing.ts`, calculadora, tests unitarios de la formula.
5. **Fase 4 — Wizard del diagnostico** (3–4 dias): UI animada, validacion, navegacion paso a paso.
6. **Fase 5 — Pantalla de informe** (2 dias): visualizacion de resultados, semaforo, CTA dinamico.
7. **Fase 6 — Captura y envio de leads** (1–2 dias): API endpoint, Resend, Google Sheets.
8. **Fase 7 — Agenda + WhatsApp + legales** (1 dia): integracion Cal.com, boton WhatsApp, paginas legales RGPD.
9. **Fase 8 — Pulido y QA** (2 dias): revision en mobile real, accesibilidad, performance, SEO.
10. **Fase 9 — Deploy a cotamadrid.com** (medio dia): conexion del dominio, certificado SSL, lanzamiento.

**Hitos de revision con cliente:** despues de Fase 2 (ver landing estatica), Fase 5 (probar el diagnostico end-to-end en preview), y antes de Fase 9 (aprobacion final).

---

## 9. Decisiones explicitamente diferidas a V2

Estas decisiones se han considerado y se han pospuesto deliberadamente:

- **Backoffice CMS (Sanity/Payload)** → V2. Arquitectura preparada para migrar sin reescribir.
- **Chatbot "asesor disponible"** → V2 cuando haya volumen.
- **Casos reales interactivos** → V2 cuando haya 3+ pisos integrales completados.
- **Integracion con Bitrix24 o CRM propio** → cuando el CRM propio este listo (proximo proyecto del cliente).
- **WhatsApp Business API instantaneo** → V2 cuando el volumen de leads lo justifique.
- **Multiidioma** → no previsto a corto plazo.
- **Testimonios de clientes** → cuando existan casos integrales propios.
- **Animaciones premium en todos los bloques** → solo hero y wizard en V1.

---

## 10. Riesgos del proyecto y mitigaciones

| Riesgo | Mitigacion |
|---|---|
| Rangos de precio mal calibrados → cliente premium pierde confianza | Validados con cliente en este spec. Calibrar de nuevo tras 5 leads reales. |
| Wizard demasiado largo → caida de conversion | Maximo 7 pasos, animaciones, progreso visible, tiempo objetivo <60s. |
| Filtrar mal a un cliente bueno como rojo | Reglas conservadoras de viabilidad. Logging de todos los leads para revisar manualmente al inicio. |
| Falta de portfolio de pisos integrales debilita la web | Bloque de "escenarios reales" del brief sustituye al portfolio sin mentir. Apoyo en autoridad de baños como prueba de oficio. |
| "Cota" puede ser dificil de recordar al principio | Tagline corto reforzando significado ("la medida exacta"), branding consistente, dominio cotamadrid.com con palabra Madrid de apoyo. |
| Cambios de precio frecuentes en los primeros meses | Edicion en archivo + redeploy = 1 minuto. Arquitectura repository preparada para CMS si volumen de cambios crece. |

---

## 11. Criterios de exito del MVP

- ✅ Web desplegada en cotamadrid.com con SSL
- ✅ Lighthouse: Performance ≥ 90, Accesibilidad ≥ 95, SEO ≥ 95 en mobile
- ✅ Wizard completable en < 90 segundos en mobile
- ✅ Lead llega al email del cliente y a Google Sheets en < 5 segundos desde envio
- ✅ Calculo de rangos coincide con la calibracion validada (test automatizado)
- ✅ Mobile perfecto en iPhone SE (375px) hasta iPad Pro
- ✅ Cumplimiento RGPD basico

---

## 12. Aprobacion

Este spec recoge todas las decisiones tomadas durante el brainstorming del 2026-04-06 entre Paulo (PCH Obras) y Claude. Cualquier cambio posterior debera reflejarse en este documento antes de ser implementado.

**Siguiente paso:** una vez aprobado este spec por el cliente, se invocara la skill `writing-plans` para generar el plan detallado de implementacion paso a paso.
