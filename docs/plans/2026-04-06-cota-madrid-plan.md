# Cota Madrid — Implementation Plan

> **For agentic workers:** Use `subagent-driven-development` (recommended, this session) or `executing-plans` (separate session) to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy a premium Next.js landing site at `cotamadrid.com` with an interactive 7-step diagnostic wizard, rule-based reform pricing engine, lead capture to email + Google Sheets, and full RGPD compliance.

**Architecture:** Next.js 15 App Router monolith hosted on Vercel. All pricing rules live in versioned config files (`config/*.ts`) consumed by a pure-function engine in `lib/pricing/`. Lead capture uses a `LeadRepository` interface with one V1 implementation that fans out to Resend (email) and Google Sheets (append). Visual components built with shadcn/ui + Tailwind v4 + Framer Motion. Repository pattern keeps all external services swappable for future migration to Sanity CMS / Bitrix24 / custom CRM.

**Tech Stack:** Next.js 15 · React 19 · TypeScript · Tailwind v4 · shadcn/ui · Framer Motion · React Hook Form + Zod · Resend · googleapis · Vitest · Vercel

**Spec reference:** [`docs/specs/2026-04-06-cota-madrid-design.md`](../specs/2026-04-06-cota-madrid-design.md)

---

## File Structure

Files created across the project, grouped by responsibility:

```
cota-madrid/
├── app/
│   ├── layout.tsx                  # Root layout, fonts, metadata
│   ├── page.tsx                    # Home (landing)
│   ├── globals.css                 # Tailwind v4 + design tokens
│   ├── diagnostico/page.tsx        # Wizard route
│   ├── informe/page.tsx            # Result/report route (reads from sessionStorage)
│   ├── politica-privacidad/page.tsx
│   ├── aviso-legal/page.tsx
│   ├── cookies/page.tsx
│   └── api/leads/route.ts          # POST endpoint for lead capture
├── components/
│   ├── ui/                         # shadcn/ui primitives (button, input, card, etc.)
│   ├── marketing/
│   │   ├── hero.tsx
│   │   ├── autoridad.tsx
│   │   ├── propuesta-valor.tsx
│   │   ├── escenarios.tsx
│   │   ├── como-funciona.tsx
│   │   ├── filtrado.tsx
│   │   ├── agenda-block.tsx
│   │   ├── cierre.tsx
│   │   └── footer.tsx
│   ├── wizard/
│   │   ├── wizard.tsx              # State machine + orchestrator
│   │   ├── progress-bar.tsx
│   │   ├── step-tipo.tsx
│   │   ├── step-metros.tsx
│   │   ├── step-barrio.tsx
│   │   ├── step-antiguedad.tsx
│   │   ├── step-calidad.tsx
│   │   ├── step-estado.tsx
│   │   ├── step-plazo.tsx
│   │   ├── step-extras.tsx         # Sin ascensor / protegido / ZBE checkboxes
│   │   ├── step-presupuesto.tsx    # Optional: client's budget for viability
│   │   └── step-contacto.tsx       # Final step: name/email/phone
│   ├── informe/
│   │   ├── informe.tsx             # Main report layout
│   │   ├── rango-precio.tsx
│   │   ├── duracion.tsx
│   │   ├── riesgos.tsx
│   │   ├── semaforo.tsx
│   │   └── cta-dinamico.tsx
│   ├── whatsapp-floating.tsx
│   └── cookie-banner.tsx
├── config/
│   ├── pricing.ts                  # €/m² ranges + all modifier factors
│   ├── wizard.ts                   # Step definitions, options, labels
│   ├── risks.ts                    # Risk rules (when each risk fires)
│   └── viability.ts                # Green/yellow/red rules + CTAs + microcopy
├── lib/
│   ├── pricing/
│   │   ├── calculate.ts            # Pure function: WizardAnswers → PriceEstimate
│   │   ├── viability.ts            # Pure function: (answers, estimate) → Viability
│   │   ├── risks.ts                # Pure function: WizardAnswers → Risk[]
│   │   └── duration.ts             # Pure function: m² + scope → DurationRange
│   ├── leads/
│   │   ├── types.ts                # Lead, LeadRepository interface
│   │   ├── repository.ts           # Default impl: fans out to Resend + Sheets
│   │   ├── resend.ts               # Resend send
│   │   └── google-sheets.ts        # Sheets append
│   ├── seo.ts                      # Metadata helpers
│   └── utils.ts                    # cn() + misc
├── content/
│   └── copy.ts                     # All marketing copy as typed constants
├── tests/
│   ├── pricing/
│   │   ├── calculate.test.ts
│   │   ├── viability.test.ts
│   │   ├── risks.test.ts
│   │   └── calibration.test.ts     # The 96k-130k Salamanca calibration test
│   └── leads/
│       └── repository.test.ts
├── public/
│   ├── og-image.png                # Generated in Task 12
│   └── favicon.ico
├── docs/
│   ├── specs/2026-04-06-cota-madrid-design.md
│   └── plans/2026-04-06-cota-madrid-plan.md
├── .env.local.example
├── .gitignore
├── next.config.ts
├── tailwind.config.ts              # If needed (Tailwind v4 mostly uses CSS)
├── tsconfig.json
├── vitest.config.ts
├── package.json
└── README.md
```

---

## Task Index

| # | Task | Depends on |
|---|---|---|
| 0 | Project setup: Next.js + TS + Tailwind v4 + Vitest + GitHub | — |
| 1 | Design system: tokens, fonts, shadcn init, base components | 0 |
| 2 | Layout shell + legal page stubs + cookie banner | 1 |
| 3 | Pricing config files (the source of truth from spec §5) | 0 |
| 4 | Pricing engine: calculate + viability + risks + duration (with tests + calibration) | 3 |
| 5 | Lead capture: types, repository, Resend, Google Sheets, API endpoint | 0 |
| 6 | Wizard UI: 10-step state machine with animations | 2, 3 |
| 7 | Informe page: report visualization with semaforo + dynamic CTA | 4, 6 |
| 8 | Marketing landing: hero + all content sections | 2 |
| 9 | Agenda integration (Cal.com) + WhatsApp floating button | 2 |
| 10 | SEO + metadata + OG image + sitemap + robots.txt | 8 |
| 11 | Wire wizard → API → informe flow end-to-end | 5, 6, 7 |
| 12 | QA pass: Lighthouse, mobile audit, accessibility, performance | 8, 9, 10, 11 |
| 13 | Production deployment to cotamadrid.com | 12 |

---

## Task 0: Project setup — Next.js, TS, Tailwind v4, Vitest, GitHub

**Goal:** Have a working Next.js 15 project with TypeScript, Tailwind v4, Vitest configured, first commit pushed to a private GitHub repo, deployed to Vercel as "Hello Cota".

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `vitest.config.ts`, `.gitignore`, `.env.local.example`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `README.md`

**Acceptance Criteria:**
- [ ] `npm run dev` starts dev server on `localhost:3000` showing "Cota — coming soon"
- [ ] `npm run build` succeeds with zero TypeScript or ESLint errors
- [ ] `npm test` runs Vitest (with one trivial passing test) and exits 0
- [ ] Git repo initialized with first commit pushed to private GitHub repo `cotamadrid/website` (or equivalent)
- [ ] Vercel project linked, first production deploy succeeds at the auto-generated `*.vercel.app` URL

**Verify:**
```bash
npm run build && npm test
```
Expected: build success, 1 test passing.

**Steps:**

- [ ] **Step 1: Create Next.js app**

```bash
cd /Users/paulochalaca/Documents/cota-madrid
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*" --use-npm --eslint --turbopack
```

When prompted "directory not empty (docs/)", confirm yes. The `docs/` folder is preserved.

- [ ] **Step 2: Install runtime + dev dependencies**

```bash
npm install framer-motion lucide-react react-hook-form @hookform/resolvers zod resend googleapis
npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom jsdom @types/node
```

- [ ] **Step 3: Add Vitest config**

Create `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, '.') },
  },
});
```

Create `tests/setup.ts`:

```ts
import '@testing-library/jest-dom/vitest';
```

Add scripts to `package.json`:

```json
"scripts": {
  "dev": "next dev --turbopack",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "test": "vitest run",
  "test:watch": "vitest"
}
```

- [ ] **Step 4: Add a trivial passing test to prove Vitest works**

Create `tests/smoke.test.ts`:

```ts
import { describe, it, expect } from 'vitest';

describe('smoke', () => {
  it('runs', () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 5: Replace the default home with "Cota coming soon"**

Replace `app/page.tsx`:

```tsx
export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-950 text-neutral-50">
      <div className="text-center">
        <h1 className="text-5xl font-light tracking-tight">Cota</h1>
        <p className="mt-4 text-neutral-400">Coming soon · Madrid</p>
      </div>
    </main>
  );
}
```

Update `app/layout.tsx` metadata:

```tsx
export const metadata = {
  title: 'Cota — Reforma con criterio · Madrid',
  description: 'Antes de empezar tu reforma, te decimos si es viable, cuánto cuesta y qué riesgos puede tener.',
};
```

- [ ] **Step 6: Add `.env.local.example` and update `.gitignore`**

`.env.local.example`:

```
# Resend (transactional email)
RESEND_API_KEY=
LEADS_TO_EMAIL=info@cotamadrid.com
LEADS_FROM_EMAIL=Cota <leads@cotamadrid.com>

# Google Sheets (lead append)
GOOGLE_SHEETS_ID=
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_SERVICE_ACCOUNT_KEY=

# Cal.com
NEXT_PUBLIC_CALCOM_USERNAME=cota

# WhatsApp
NEXT_PUBLIC_WHATSAPP_NUMBER=34600000000
```

Confirm `.env.local` is in `.gitignore` (Next.js default already handles this).

- [ ] **Step 7: Build and test**

Run:
```bash
npm run build && npm test
```
Expected: build succeeds, smoke test passes.

- [ ] **Step 8: Initial commit to GitHub**

Create the GitHub repo via UI or `gh repo create cotamadrid/website --private --source=. --remote=origin`. Then:

```bash
git add -A
git commit -m "feat: initial Next.js setup with Tailwind v4 and Vitest

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
git push -u origin main
```

- [ ] **Step 9: Vercel link + first deploy**

```bash
npx vercel link
npx vercel --prod
```

Confirm the production URL loads "Cota — coming soon" in the browser.

---

## Task 1: Design system — tokens, fonts, shadcn init, base components

**Goal:** Establish the visual foundation: typography (editorial), color tokens (dark base + neutral + accent), spacing scale, and the shadcn/ui primitives we'll use throughout (button, input, card, label, select, radio-group, checkbox).

**Files:**
- Modify: `app/globals.css`, `app/layout.tsx`
- Create: `components/ui/button.tsx`, `components/ui/input.tsx`, `components/ui/card.tsx`, `components/ui/label.tsx`, `components/ui/select.tsx`, `components/ui/radio-group.tsx`, `components/ui/checkbox.tsx`, `lib/utils.ts`, `components.json`

**Acceptance Criteria:**
- [ ] Custom serif font (Fraunces or similar editorial) loaded for headings
- [ ] Custom sans (Inter) loaded for body
- [ ] Color tokens defined as CSS variables: `--background`, `--foreground`, `--accent`, `--muted`, `--border`, `--ring` (dark theme by default)
- [ ] All listed shadcn primitives copied into `components/ui/`
- [ ] A `<Button variant="default">` and `<Button variant="outline">` render correctly on the home page
- [ ] No TypeScript errors

**Verify:**
```bash
npm run build
```
Expected: success.

**Steps:**

- [ ] **Step 1: Init shadcn/ui**

```bash
npx shadcn@latest init
```

Choices: TypeScript yes, Style: New York, Base color: Neutral, CSS variables yes, RSC yes.

- [ ] **Step 2: Add the primitives we need**

```bash
npx shadcn@latest add button input card label select radio-group checkbox
```

- [ ] **Step 3: Add fonts via `next/font`**

Replace `app/layout.tsx`:

```tsx
import type { Metadata } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import './globals.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Cota — Reforma con criterio · Madrid',
  description:
    'Antes de empezar tu reforma, te decimos si es viable, cuánto cuesta y qué riesgos puede tener.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="font-sans antialiased bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Define design tokens in `app/globals.css`**

Replace `app/globals.css`:

```css
@import "tailwindcss";

@theme {
  --font-serif: var(--font-serif), Georgia, serif;
  --font-sans: var(--font-sans), system-ui, sans-serif;

  --color-background: oklch(0.13 0 0);          /* near-black */
  --color-foreground: oklch(0.98 0 0);          /* near-white */
  --color-muted: oklch(0.20 0 0);
  --color-muted-foreground: oklch(0.65 0 0);
  --color-border: oklch(0.25 0 0);
  --color-input: oklch(0.20 0 0);
  --color-ring: oklch(0.75 0.10 80);            /* warm gold for focus */
  --color-accent: oklch(0.78 0.12 80);          /* warm gold accent */
  --color-accent-foreground: oklch(0.13 0 0);
  --color-card: oklch(0.16 0 0);
  --color-card-foreground: oklch(0.98 0 0);
  --color-primary: oklch(0.98 0 0);
  --color-primary-foreground: oklch(0.13 0 0);
  --color-secondary: oklch(0.20 0 0);
  --color-secondary-foreground: oklch(0.98 0 0);
  --color-destructive: oklch(0.55 0.20 25);
  --color-destructive-foreground: oklch(0.98 0 0);
  --color-success: oklch(0.65 0.15 145);        /* green for viability OK */
  --color-warning: oklch(0.75 0.15 75);         /* amber for viability medio */
  --color-danger: oklch(0.60 0.20 25);          /* red for viability bajo */

  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
}

html {
  scroll-behavior: smooth;
}

body {
  font-feature-settings: "ss01", "cv11";
}

h1, h2, h3, h4 {
  font-family: var(--font-serif);
  font-weight: 300;
  letter-spacing: -0.02em;
}
```

- [ ] **Step 5: Smoke-test the tokens on the home page**

Update `app/page.tsx`:

```tsx
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8">
      <h1 className="text-6xl">Cota</h1>
      <p className="text-muted-foreground">Reforma con criterio · Madrid</p>
      <div className="flex gap-3">
        <Button>Empezar diagnóstico</Button>
        <Button variant="outline">Saber más</Button>
      </div>
    </main>
  );
}
```

- [ ] **Step 6: Build and visually verify in browser**

```bash
npm run dev
```
Open `http://localhost:3000`. Expected: dark background, large serif "Cota", two styled buttons.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: design system with shadcn primitives, fonts, and tokens

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Task 2: Layout shell + legal page stubs + cookie banner

**Goal:** Create a reusable site layout (header with logo + nav, footer with legal links), stub pages for the 3 legal documents (RGPD-compliant placeholders), and a minimal cookie banner.

**Files:**
- Create: `components/marketing/footer.tsx`, `components/cookie-banner.tsx`, `app/politica-privacidad/page.tsx`, `app/aviso-legal/page.tsx`, `app/cookies/page.tsx`
- Modify: `app/layout.tsx`, `app/page.tsx`

**Acceptance Criteria:**
- [ ] Footer renders on all pages with: brand, copyright, links to the 3 legal pages
- [ ] All 3 legal pages exist with placeholder text marked clearly as "Pendiente de revisión legal"
- [ ] Cookie banner appears on first visit, dismissable, persists dismissal in `localStorage`
- [ ] Site nav includes a single CTA: "Diagnóstico" linking to `/diagnostico`

**Verify:**
```bash
npm run dev
```
Visit `/`, `/politica-privacidad`, `/aviso-legal`, `/cookies`. Each loads. Cookie banner appears and dismisses.

**Steps:**

- [ ] **Step 1: Create the footer component**

`components/marketing/footer.tsx`:

```tsx
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-border mt-32">
      <div className="mx-auto max-w-6xl px-6 py-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <p className="font-serif text-2xl">Cota</p>
          <p className="text-sm text-muted-foreground mt-1">
            Reforma con criterio · Madrid
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <Link href="/politica-privacidad" className="hover:text-foreground">
            Política de privacidad
          </Link>
          <Link href="/aviso-legal" className="hover:text-foreground">
            Aviso legal
          </Link>
          <Link href="/cookies" className="hover:text-foreground">
            Cookies
          </Link>
        </nav>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} PCH Obras
        </p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Create the cookie banner**

`components/cookie-banner.tsx`:

```tsx
'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const STORAGE_KEY = 'cota-cookies-accepted';

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
  }, []);

  if (!visible) return null;

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, '1');
    setVisible(false);
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md bg-card border border-border rounded-lg p-5 shadow-2xl z-50">
      <p className="text-sm text-foreground">
        Usamos cookies técnicas y de analítica anónima para mejorar la web.{' '}
        <Link href="/cookies" className="underline">
          Saber más
        </Link>
        .
      </p>
      <div className="mt-3 flex gap-2">
        <Button size="sm" onClick={accept}>
          Aceptar
        </Button>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create the 3 legal pages with clear placeholders**

`app/politica-privacidad/page.tsx`:

```tsx
export const metadata = { title: 'Política de privacidad — Cota' };

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="text-4xl mb-8">Política de privacidad</h1>
      <div className="prose prose-invert max-w-none text-muted-foreground">
        <p className="text-warning">
          ⚠️ Texto pendiente de revisión legal antes de lanzamiento público.
        </p>
        <h2>Responsable del tratamiento</h2>
        <p>PCH Obras [+ datos legales completos a añadir antes de producción]</p>
        <h2>Datos recogidos</h2>
        <p>
          Cuando completas el diagnóstico recogemos: nombre, email, teléfono y las
          respuestas del cuestionario. Estos datos se usan exclusivamente para
          contactarte respecto a tu reforma.
        </p>
        <h2>Base legal</h2>
        <p>Consentimiento del interesado (art. 6.1.a RGPD).</p>
        <h2>Conservación</h2>
        <p>
          Tus datos se conservan durante 12 meses desde el último contacto, salvo
          que solicites su eliminación antes.
        </p>
        <h2>Tus derechos</h2>
        <p>
          Puedes acceder, rectificar, oponerte o solicitar la eliminación de tus
          datos escribiendo a info@cotamadrid.com.
        </p>
      </div>
    </main>
  );
}
```

`app/aviso-legal/page.tsx`:

```tsx
export const metadata = { title: 'Aviso legal — Cota' };

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="text-4xl mb-8">Aviso legal</h1>
      <div className="prose prose-invert max-w-none text-muted-foreground">
        <p className="text-warning">
          ⚠️ Texto pendiente de revisión legal antes de lanzamiento público.
        </p>
        <h2>Titular</h2>
        <p>PCH Obras [CIF, domicilio, datos registrales — añadir antes de producción]</p>
        <h2>Objeto</h2>
        <p>
          La presente web ofrece información sobre los servicios de reforma integral
          de viviendas en Madrid prestados por PCH Obras bajo la marca comercial Cota.
        </p>
        <h2>Propiedad intelectual</h2>
        <p>
          Todo el contenido (textos, imágenes, marca, diseño) es propiedad de
          PCH Obras o se utiliza con autorización.
        </p>
      </div>
    </main>
  );
}
```

`app/cookies/page.tsx`:

```tsx
export const metadata = { title: 'Política de cookies — Cota' };

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="text-4xl mb-8">Política de cookies</h1>
      <div className="prose prose-invert max-w-none text-muted-foreground">
        <p className="text-warning">
          ⚠️ Texto pendiente de revisión legal antes de lanzamiento público.
        </p>
        <h2>¿Qué cookies usamos?</h2>
        <ul>
          <li>
            <strong>Técnicas (necesarias):</strong> mantienen el estado del wizard
            durante tu sesión.
          </li>
          <li>
            <strong>Analítica anónima (Vercel Analytics):</strong> medimos páginas
            vistas sin identificarte personalmente. No usa cookies de terceros.
          </li>
        </ul>
        <h2>No usamos</h2>
        <p>Cookies de marketing, publicidad ni de terceros con perfilado.</p>
      </div>
    </main>
  );
}
```

- [ ] **Step 4: Mount footer + cookie banner globally in layout**

Update `app/layout.tsx` body:

```tsx
<body className="font-sans antialiased bg-background text-foreground min-h-screen flex flex-col">
  <div className="flex-1">{children}</div>
  <Footer />
  <CookieBanner />
</body>
```

Add the imports at the top of `app/layout.tsx`:

```tsx
import { Footer } from '@/components/marketing/footer';
import { CookieBanner } from '@/components/cookie-banner';
```

- [ ] **Step 5: Build and verify**

```bash
npm run build && npm run dev
```
Visit `/`, `/politica-privacidad`, `/aviso-legal`, `/cookies`. Footer everywhere. Cookie banner appears on first visit, dismisses, doesn't reappear after refresh.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: layout shell, footer, legal stubs, and cookie banner

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Task 3: Pricing config files (the source of truth)

**Goal:** Translate the entire spec §5 into typed TypeScript config files. These files are the **single source of truth** for the pricing engine and are designed to be edited safely by humans (the "Nivel 1" backoffice). The shape is also chosen so a future Sanity migration is a 1-day swap.

**Files:**
- Create: `config/pricing.ts`, `config/wizard.ts`, `config/risks.ts`, `config/viability.ts`, `lib/pricing/types.ts`

**Acceptance Criteria:**
- [ ] All 4 quality levels with €/m² ranges from spec §5.2
- [ ] All barrio modifiers from spec §5.3
- [ ] All antigüedad / plazo / estado / extras modifiers from spec §5.3
- [ ] Wizard step definitions match spec §5.1 (7 base + extras + budget + contact = 10 steps)
- [ ] Risk rules from spec §5.6 expressed as predicates
- [ ] Viability rules from spec §5.5 expressed as predicates with CTAs and microcopy
- [ ] All exports are typed (no `any`)
- [ ] `npm run build` passes

**Verify:**
```bash
npm run build
```
Expected: zero TS errors. The types are consumed by the engine in Task 4.

**Steps:**

- [ ] **Step 1: Define shared types**

`lib/pricing/types.ts`:

```ts
// =============================================================================
// Wizard answers — what the user submits
// =============================================================================

export type ReformType = 'integral' | 'parcial' | 'zona-humeda' | 'cocina';

export type Barrio =
  | 'salamanca'
  | 'chamberi'
  | 'justicia'
  | 'centro'
  | 'chamartin'
  | 'retiro'
  | 'moncloa'
  | 'tetuan'
  | 'arganzuela'
  | 'latina'
  | 'carabanchel'
  | 'otros'
  | 'fuera-m30';

export type Antiguedad = 'pre-1950' | '1950-1980' | '1980-2000' | 'post-2000';

export type Calidad = 'basico' | 'medio' | 'alto' | 'premium';

export type EstadoActual = 'estrenar' | 'vivido-obsoleto' | 'parcial-reformado';

export type Plazo = 'sin-prisa' | '3-6-meses' | 'urgente';

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
  presupuestoCliente?: number; // optional, used for viability
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
```

- [ ] **Step 2: Pricing config**

`config/pricing.ts`:

```ts
import type {
  Antiguedad,
  Barrio,
  Calidad,
  EstadoActual,
  Plazo,
} from '@/lib/pricing/types';

/**
 * €/m² ranges by quality level — Madrid 2026.
 * Validated by PCH Obras (10 years of operation).
 * Edit these values to recalibrate the engine.
 */
export const PRICE_PER_M2: Record<Calidad, { min: number; max: number }> = {
  basico: { min: 600, max: 850 },
  medio: { min: 850, max: 1200 },
  alto: { min: 1200, max: 1700 },
  premium: { min: 1700, max: 2500 },
};

export const BARRIO_FACTOR: Record<Barrio, number> = {
  salamanca: 1.15,
  chamberi: 1.15,
  justicia: 1.15,
  centro: 1.15,
  chamartin: 1.08,
  retiro: 1.08,
  moncloa: 1.08,
  tetuan: 1.0,
  arganzuela: 1.0,
  latina: 1.0,
  carabanchel: 1.0,
  otros: 1.0,
  'fuera-m30': 0.95,
};

export const ANTIGUEDAD_FACTOR: Record<Antiguedad, number> = {
  'pre-1950': 1.2,
  '1950-1980': 1.1,
  '1980-2000': 1.0,
  'post-2000': 0.95,
};

export const PLAZO_FACTOR: Record<Plazo, number> = {
  'sin-prisa': 0.95,
  '3-6-meses': 1.0,
  urgente: 1.15,
};

export const ESTADO_FACTOR: Record<EstadoActual, number> = {
  estrenar: 1.0,
  'vivido-obsoleto': 1.05,
  'parcial-reformado': 0.9,
};

export const EXTRA_FACTOR = {
  sinAscensor: 1.1,
  edificioProtegido: 1.1,
  zonaBajasEmisiones: 1.05,
} as const;

/**
 * Range spread applied to the central estimate to show as "X – Y".
 * 0.85 / 1.15 means ±15%.
 */
export const RANGE_SPREAD = { lower: 0.85, upper: 1.15 } as const;

/**
 * Duration estimate per m² (in weeks).
 * Crude rule: ~0.1 weeks/m² for integral, scaled down for partial scopes.
 */
export const DURATION_RULES = {
  integral: { weeksMin: 0.09, weeksMax: 0.13 },
  parcial: { weeksMin: 0.06, weeksMax: 0.09 },
  'zona-humeda': { weeksMin: 0.04, weeksMax: 0.06 },
  cocina: { weeksMin: 0.04, weeksMax: 0.06 },
} as const;
```

- [ ] **Step 3: Wizard config**

`config/wizard.ts`:

```ts
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
```

- [ ] **Step 4: Risks config**

`config/risks.ts`:

```ts
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
```

- [ ] **Step 5: Viability config**

`config/viability.ts`:

```ts
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
```

- [ ] **Step 6: Build to verify all types align**

```bash
npm run build
```
Expected: success.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: pricing config files (single source of truth from spec §5)

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Task 4: Pricing engine — calculate, viability, risks, duration (with calibration test)

**Goal:** Implement the pure-function engine that consumes `WizardAnswers` and produces a full `Diagnosis`. Cover with unit tests, including the **critical calibration test** that verifies the Salamanca 80m² 1920 case yields 96k–130k as the spec promises.

**Files:**
- Create: `lib/pricing/calculate.ts`, `lib/pricing/duration.ts`, `lib/pricing/diagnose.ts`, `tests/pricing/calculate.test.ts`, `tests/pricing/viability.test.ts`, `tests/pricing/risks.test.ts`, `tests/pricing/calibration.test.ts`

**Acceptance Criteria:**
- [ ] `calculate(answers)` returns `PriceEstimate` with min/max/central
- [ ] `estimateDuration(answers)` returns weeks min/max
- [ ] `diagnose(answers)` returns full `Diagnosis` (combining estimate + duration + risks + viability)
- [ ] **Calibration test passes**: Salamanca 80m² 1920 vivido medio sin-prisa → range within ±5% of [96000, 130000]
- [ ] All other unit tests pass: at least 2 viability cases per level (alta/media/baja), at least 3 risk rules verified

**Verify:**
```bash
npm test
```
Expected: all pricing tests pass.

**Steps:**

- [ ] **Step 1: Write the calibration test FIRST (TDD)**

`tests/pricing/calibration.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { diagnose } from '@/lib/pricing/diagnose';
import type { WizardAnswers } from '@/lib/pricing/types';

describe('calibration — spec §5.4 reference case', () => {
  it('Salamanca 80m² 1920 vivido medio sin-prisa → 96k–130k ±5%', () => {
    const answers: WizardAnswers = {
      tipo: 'integral',
      metros: 80,
      barrio: 'salamanca',
      antiguedad: 'pre-1950',
      calidad: 'medio',
      estado: 'vivido-obsoleto',
      plazo: 'sin-prisa',
      extras: {
        sinAscensor: false,
        edificioProtegido: false,
        zonaBajasEmisiones: false,
      },
    };

    const { estimate } = diagnose(answers);

    // Expected from spec: 96.000 € – 130.000 €
    // Allow ±5% calibration tolerance
    expect(estimate.min).toBeGreaterThanOrEqual(96000 * 0.95);
    expect(estimate.min).toBeLessThanOrEqual(96000 * 1.05);
    expect(estimate.max).toBeGreaterThanOrEqual(130000 * 0.95);
    expect(estimate.max).toBeLessThanOrEqual(130000 * 1.05);
  });
});
```

- [ ] **Step 2: Run the test to confirm it fails (red)**

```bash
npm test -- calibration
```
Expected: FAIL with module not found.

- [ ] **Step 3: Implement `calculate.ts`**

`lib/pricing/calculate.ts`:

```ts
import {
  ANTIGUEDAD_FACTOR,
  BARRIO_FACTOR,
  ESTADO_FACTOR,
  EXTRA_FACTOR,
  PLAZO_FACTOR,
  PRICE_PER_M2,
  RANGE_SPREAD,
} from '@/config/pricing';
import type { PriceEstimate, WizardAnswers } from './types';

/**
 * Spec §5.4 — multiplicative pricing model.
 * Pure function. No side effects. No I/O.
 */
export function calculate(answers: WizardAnswers): PriceEstimate {
  const range = PRICE_PER_M2[answers.calidad];
  const meanPerM2 = (range.min + range.max) / 2;
  const base = answers.metros * meanPerM2;

  let factor = 1;
  factor *= BARRIO_FACTOR[answers.barrio];
  factor *= ANTIGUEDAD_FACTOR[answers.antiguedad];
  factor *= PLAZO_FACTOR[answers.plazo];
  factor *= ESTADO_FACTOR[answers.estado];

  if (answers.extras.sinAscensor) factor *= EXTRA_FACTOR.sinAscensor;
  if (answers.extras.edificioProtegido) factor *= EXTRA_FACTOR.edificioProtegido;
  if (answers.extras.zonaBajasEmisiones) factor *= EXTRA_FACTOR.zonaBajasEmisiones;

  const central = base * factor;
  const min = roundTo(central * RANGE_SPREAD.lower, 1000);
  const max = roundTo(central * RANGE_SPREAD.upper, 1000);

  return { min, max, central: Math.round(central) };
}

function roundTo(n: number, step: number): number {
  return Math.round(n / step) * step;
}
```

- [ ] **Step 4: Implement `duration.ts`**

`lib/pricing/duration.ts`:

```ts
import { DURATION_RULES } from '@/config/pricing';
import type { DurationEstimate, WizardAnswers } from './types';

export function estimateDuration(answers: WizardAnswers): DurationEstimate {
  const rule = DURATION_RULES[answers.tipo];
  let weeksMin = answers.metros * rule.weeksMin;
  let weeksMax = answers.metros * rule.weeksMax;

  // Modifiers that stretch time
  if (answers.extras.sinAscensor) {
    weeksMin *= 1.1;
    weeksMax *= 1.1;
  }
  if (answers.extras.edificioProtegido) {
    weeksMin *= 1.15;
    weeksMax *= 1.2;
  }
  if (answers.antiguedad === 'pre-1950') {
    weeksMin *= 1.1;
    weeksMax *= 1.15;
  }

  return {
    weeksMin: Math.max(2, Math.round(weeksMin)),
    weeksMax: Math.max(3, Math.round(weeksMax)),
  };
}
```

- [ ] **Step 5: Implement `diagnose.ts` (the public composition)**

`lib/pricing/diagnose.ts`:

```ts
import { evaluateRisks } from '@/config/risks';
import { evaluateViability } from '@/config/viability';
import { calculate } from './calculate';
import { estimateDuration } from './duration';
import type { Diagnosis, WizardAnswers } from './types';

/**
 * Public entry point: full diagnosis from wizard answers.
 * Composes calculate + duration + risks + viability.
 */
export function diagnose(answers: WizardAnswers): Diagnosis {
  const estimate = calculate(answers);
  const duration = estimateDuration(answers);
  const risks = evaluateRisks(answers);
  const viability = evaluateViability(answers, estimate);

  return { estimate, duration, risks, viability, answers };
}
```

- [ ] **Step 6: Run the calibration test (should pass)**

```bash
npm test -- calibration
```
Expected: PASS. If FAIL, the issue is calibration: review the math against spec §5.4 and adjust factors in `config/pricing.ts` until it passes. The calibration is the contract.

- [ ] **Step 7: Add viability tests**

`tests/pricing/viability.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { diagnose } from '@/lib/pricing/diagnose';
import type { WizardAnswers } from '@/lib/pricing/types';

const base: WizardAnswers = {
  tipo: 'integral',
  metros: 80,
  barrio: 'chamberi',
  antiguedad: '1980-2000',
  calidad: 'medio',
  estado: 'estrenar',
  plazo: 'sin-prisa',
  extras: {
    sinAscensor: false,
    edificioProtegido: false,
    zonaBajasEmisiones: false,
  },
};

describe('viability', () => {
  it('returns ALTA for ideal client (no budget given, all green)', () => {
    expect(diagnose(base).viability.level).toBe('alta');
  });

  it('returns BAJA for solo cocina', () => {
    expect(diagnose({ ...base, tipo: 'cocina' }).viability.level).toBe('baja');
  });

  it('returns BAJA for solo zona-humeda', () => {
    expect(diagnose({ ...base, tipo: 'zona-humeda' }).viability.level).toBe('baja');
  });

  it('returns BAJA when m² < 30', () => {
    expect(diagnose({ ...base, metros: 25 }).viability.level).toBe('baja');
  });

  it('returns BAJA when budget < 70% of estimate min', () => {
    const d = diagnose({ ...base, presupuestoCliente: 1000 });
    expect(d.viability.level).toBe('baja');
  });

  it('returns MEDIA when plazo is urgente', () => {
    expect(diagnose({ ...base, plazo: 'urgente' }).viability.level).toBe('media');
  });

  it('returns MEDIA when calidad is basico', () => {
    expect(diagnose({ ...base, calidad: 'basico' }).viability.level).toBe('media');
  });

  it('returns MEDIA when m² > 200', () => {
    expect(diagnose({ ...base, metros: 220 }).viability.level).toBe('media');
  });

  it('returns MEDIA when budget is between 70% and 100% of estimate min', () => {
    const without = diagnose(base);
    const target = without.estimate.min * 0.85;
    const d = diagnose({ ...base, presupuestoCliente: target });
    expect(d.viability.level).toBe('media');
  });
});
```

- [ ] **Step 8: Add risk rule tests**

`tests/pricing/risks.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { evaluateRisks } from '@/config/risks';
import type { WizardAnswers } from '@/lib/pricing/types';

const base: WizardAnswers = {
  tipo: 'integral',
  metros: 80,
  barrio: 'chamberi',
  antiguedad: '1980-2000',
  calidad: 'medio',
  estado: 'estrenar',
  plazo: 'sin-prisa',
  extras: {
    sinAscensor: false,
    edificioProtegido: false,
    zonaBajasEmisiones: false,
  },
};

describe('risk rules', () => {
  it('flags instalaciones-obsoletas for pre-1950', () => {
    const risks = evaluateRisks({ ...base, antiguedad: 'pre-1950' });
    expect(risks.some((r) => r.id === 'instalaciones-obsoletas')).toBe(true);
  });

  it('flags asbesto for pre-1980 buildings', () => {
    const risks = evaluateRisks({ ...base, antiguedad: '1950-1980' });
    expect(risks.some((r) => r.id === 'asbesto')).toBe(true);
  });

  it('flags sin-ascensor when extras.sinAscensor is true', () => {
    const risks = evaluateRisks({
      ...base,
      extras: { ...base.extras, sinAscensor: true },
    });
    expect(risks.some((r) => r.id === 'logistica-sin-ascensor')).toBe(true);
  });

  it('always flags reserva-imprevistos for integral', () => {
    expect(evaluateRisks(base).some((r) => r.id === 'reserva-imprevistos')).toBe(
      true
    );
  });

  it('does not flag patrimonio when not protected', () => {
    expect(evaluateRisks(base).some((r) => r.id === 'patrimonio')).toBe(false);
  });
});
```

- [ ] **Step 9: Add basic calculate tests**

`tests/pricing/calculate.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { calculate } from '@/lib/pricing/calculate';
import type { WizardAnswers } from '@/lib/pricing/types';

const base: WizardAnswers = {
  tipo: 'integral',
  metros: 100,
  barrio: 'tetuan',
  antiguedad: '1980-2000',
  calidad: 'medio',
  estado: 'estrenar',
  plazo: '3-6-meses',
  extras: {
    sinAscensor: false,
    edificioProtegido: false,
    zonaBajasEmisiones: false,
  },
};

describe('calculate', () => {
  it('returns min < central < max', () => {
    const e = calculate(base);
    expect(e.min).toBeLessThan(e.central);
    expect(e.central).toBeLessThan(e.max);
  });

  it('Salamanca is more expensive than Tetuán for the same case', () => {
    const tetuan = calculate(base);
    const salamanca = calculate({ ...base, barrio: 'salamanca' });
    expect(salamanca.central).toBeGreaterThan(tetuan.central);
  });

  it('premium quality is more expensive than basico for the same case', () => {
    const basico = calculate({ ...base, calidad: 'basico' });
    const premium = calculate({ ...base, calidad: 'premium' });
    expect(premium.central).toBeGreaterThan(basico.central * 2);
  });

  it('extras stack multiplicatively', () => {
    const without = calculate(base);
    const allExtras = calculate({
      ...base,
      extras: {
        sinAscensor: true,
        edificioProtegido: true,
        zonaBajasEmisiones: true,
      },
    });
    expect(allExtras.central).toBeGreaterThan(without.central * 1.25);
  });
});
```

- [ ] **Step 10: Run full test suite**

```bash
npm test
```
Expected: all pricing tests pass.

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "feat: pricing engine with calibration test (Salamanca 96k-130k)

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Task 5: Lead capture — types, repository, Resend, Google Sheets, API endpoint

**Goal:** Implement lead persistence with the **repository pattern** so future swaps to Bitrix24 / custom CRM are 1-file changes. V1 implementation fans out to Resend (email notification) and Google Sheets (append row).

**Files:**
- Create: `lib/leads/types.ts`, `lib/leads/repository.ts`, `lib/leads/resend.ts`, `lib/leads/google-sheets.ts`, `lib/leads/email-template.ts`, `app/api/leads/route.ts`, `tests/leads/repository.test.ts`

**Acceptance Criteria:**
- [ ] `LeadRepository` interface with `save(lead): Promise<void>` and `notify(lead): Promise<void>`
- [ ] `DefaultLeadRepository` implementation calls Sheets append AND Resend send in parallel; one failing does NOT break the other
- [ ] HTML email template includes: contact, viability with color, estimate range, all answers, risks list, "Reply via WhatsApp" button
- [ ] Google Sheets row appended with one column per field (timestamp first)
- [ ] `POST /api/leads` validates payload with Zod, calls repository, returns `{ ok: true }` or 4xx/5xx with error
- [ ] Mock-based unit test verifies fan-out behavior (one impl fails, the other still runs)

**Verify:**
```bash
npm test -- leads
```
Expected: pass.

**Steps:**

- [ ] **Step 1: Lead types**

`lib/leads/types.ts`:

```ts
import type { Diagnosis } from '@/lib/pricing/types';

export interface Lead {
  id: string;
  createdAt: string; // ISO timestamp
  contact: {
    nombre: string;
    email: string;
    telefono: string;
  };
  diagnosis: Diagnosis;
  source?: {
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    referrer?: string;
  };
}

export interface LeadRepository {
  save(lead: Lead): Promise<void>;
  notify(lead: Lead): Promise<void>;
}
```

- [ ] **Step 2: Email HTML template**

`lib/leads/email-template.ts`:

```ts
import type { Lead } from './types';

const VIABILITY_COLOR = {
  alta: '#22c55e',
  media: '#eab308',
  baja: '#ef4444',
} as const;

const VIABILITY_LABEL = {
  alta: '🟢 ALTA — Cliente ideal',
  media: '🟡 MEDIA — Hay puntos a definir',
  baja: '🔴 BAJA — No es buena opción',
} as const;

export function renderLeadEmail(lead: Lead): { subject: string; html: string } {
  const { contact, diagnosis } = lead;
  const { estimate, duration, risks, viability, answers } = diagnosis;
  const color = VIABILITY_COLOR[viability.level];
  const label = VIABILITY_LABEL[viability.level];

  const fmt = (n: number) =>
    new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);

  const wa = `https://wa.me/${(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '34600000000').replace(/\D/g, '')}?text=${encodeURIComponent(`Hola ${contact.nombre}, vengo del diagnóstico de Cota.`)}`;

  const subject = `Nuevo lead Cota — ${label.split(' ')[0]} ${contact.nombre} (${answers.metros}m² ${answers.barrio})`;

  const html = `
<!DOCTYPE html>
<html lang="es"><head><meta charset="utf-8"></head>
<body style="font-family:-apple-system,sans-serif;background:#0a0a0a;color:#fafafa;margin:0;padding:24px">
  <div style="max-width:600px;margin:0 auto;background:#171717;border-radius:12px;padding:32px">
    <h1 style="margin:0 0 8px;font-weight:300">Nuevo lead Cota</h1>
    <p style="margin:0 0 24px;color:#a3a3a3">${new Date(lead.createdAt).toLocaleString('es-ES')}</p>

    <div style="background:${color}22;border-left:4px solid ${color};padding:16px;border-radius:6px;margin-bottom:24px">
      <strong style="color:${color}">${label}</strong>
    </div>

    <h2 style="font-weight:300;border-bottom:1px solid #333;padding-bottom:8px">Contacto</h2>
    <p><strong>${contact.nombre}</strong><br>
       ${contact.email}<br>
       <a href="tel:${contact.telefono}" style="color:#fafafa">${contact.telefono}</a></p>

    <h2 style="font-weight:300;border-bottom:1px solid #333;padding-bottom:8px">Estimación</h2>
    <p style="font-size:24px;margin:8px 0">${fmt(estimate.min)} – ${fmt(estimate.max)}</p>
    <p style="color:#a3a3a3">Duración: ${duration.weeksMin} – ${duration.weeksMax} semanas</p>

    <h2 style="font-weight:300;border-bottom:1px solid #333;padding-bottom:8px">Datos del proyecto</h2>
    <ul style="list-style:none;padding:0">
      <li>Tipo: <strong>${answers.tipo}</strong></li>
      <li>Metros: <strong>${answers.metros} m²</strong></li>
      <li>Barrio: <strong>${answers.barrio}</strong></li>
      <li>Antigüedad: <strong>${answers.antiguedad}</strong></li>
      <li>Calidad: <strong>${answers.calidad}</strong></li>
      <li>Estado: <strong>${answers.estado}</strong></li>
      <li>Plazo: <strong>${answers.plazo}</strong></li>
      ${answers.presupuestoCliente ? `<li>Presupuesto cliente: <strong>${fmt(answers.presupuestoCliente)}</strong></li>` : ''}
      ${answers.extras.sinAscensor ? '<li>⚠️ Sin ascensor</li>' : ''}
      ${answers.extras.edificioProtegido ? '<li>⚠️ Edificio protegido</li>' : ''}
      ${answers.extras.zonaBajasEmisiones ? '<li>⚠️ Zona Bajas Emisiones</li>' : ''}
    </ul>

    ${risks.length > 0 ? `
    <h2 style="font-weight:300;border-bottom:1px solid #333;padding-bottom:8px">Riesgos detectados</h2>
    <ul>${risks.map((r) => `<li><strong>${r.title}</strong><br><span style="color:#a3a3a3">${r.description}</span></li>`).join('')}</ul>
    ` : ''}

    <div style="text-align:center;margin-top:32px">
      <a href="${wa}" style="display:inline-block;background:#25d366;color:white;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:600">
        Responder por WhatsApp
      </a>
    </div>
  </div>
</body></html>`;

  return { subject, html };
}
```

- [ ] **Step 3: Resend implementation**

`lib/leads/resend.ts`:

```ts
import { Resend } from 'resend';
import { renderLeadEmail } from './email-template';
import type { Lead } from './types';

export async function sendLeadEmail(lead: Lead): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEADS_TO_EMAIL;
  const from = process.env.LEADS_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    throw new Error('Missing Resend env vars (RESEND_API_KEY, LEADS_TO_EMAIL, LEADS_FROM_EMAIL)');
  }

  const resend = new Resend(apiKey);
  const { subject, html } = renderLeadEmail(lead);

  const { error } = await resend.emails.send({ from, to, subject, html });
  if (error) throw new Error(`Resend error: ${error.message}`);
}
```

- [ ] **Step 4: Google Sheets implementation**

`lib/leads/google-sheets.ts`:

```ts
import { google } from 'googleapis';
import type { Lead } from './types';

const HEADER = [
  'Timestamp',
  'Nombre',
  'Email',
  'Teléfono',
  'Viabilidad',
  'Estimación min (€)',
  'Estimación max (€)',
  'Duración semanas',
  'Tipo',
  'Metros',
  'Barrio',
  'Antigüedad',
  'Calidad',
  'Estado',
  'Plazo',
  'Sin ascensor',
  'Edif. protegido',
  'ZBE',
  'Presupuesto cliente',
  'Riesgos',
  'UTM source',
];

export async function appendLeadRow(lead: Lead): Promise<void> {
  const sheetId = process.env.GOOGLE_SHEETS_ID;
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_SERVICE_ACCOUNT_KEY?.replace(/\\n/g, '\n');

  if (!sheetId || !email || !key) {
    throw new Error('Missing Google Sheets env vars');
  }

  const auth = new google.auth.JWT({
    email,
    key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });
  const { diagnosis: d } = lead;

  const row = [
    lead.createdAt,
    lead.contact.nombre,
    lead.contact.email,
    lead.contact.telefono,
    d.viability.level,
    d.estimate.min,
    d.estimate.max,
    `${d.duration.weeksMin}-${d.duration.weeksMax}`,
    d.answers.tipo,
    d.answers.metros,
    d.answers.barrio,
    d.answers.antiguedad,
    d.answers.calidad,
    d.answers.estado,
    d.answers.plazo,
    d.answers.extras.sinAscensor ? 'sí' : 'no',
    d.answers.extras.edificioProtegido ? 'sí' : 'no',
    d.answers.extras.zonaBajasEmisiones ? 'sí' : 'no',
    d.answers.presupuestoCliente ?? '',
    d.risks.map((r) => r.title).join(' | '),
    lead.source?.utm_source ?? '',
  ];

  // Ensure header exists (idempotent: only writes header if A1 is empty)
  const headerRange = 'Leads!A1:U1';
  const existing = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: headerRange,
  });
  if (!existing.data.values || existing.data.values.length === 0) {
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: headerRange,
      valueInputOption: 'RAW',
      requestBody: { values: [HEADER] },
    });
  }

  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: 'Leads!A:U',
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [row] },
  });
}
```

- [ ] **Step 5: Default repository (fan-out)**

`lib/leads/repository.ts`:

```ts
import { appendLeadRow } from './google-sheets';
import { sendLeadEmail } from './resend';
import type { Lead, LeadRepository } from './types';

export class DefaultLeadRepository implements LeadRepository {
  async save(lead: Lead): Promise<void> {
    // V1: Sheets is the persistent store
    await appendLeadRow(lead);
  }

  async notify(lead: Lead): Promise<void> {
    // V1: Resend email
    await sendLeadEmail(lead);
  }
}

/**
 * Process a lead end-to-end. save() and notify() run in parallel and
 * one failing does NOT block the other — we want both attempts.
 * Errors are aggregated and re-thrown so the API endpoint can log them.
 */
export async function processLead(
  lead: Lead,
  repo: LeadRepository = new DefaultLeadRepository()
): Promise<void> {
  const results = await Promise.allSettled([repo.save(lead), repo.notify(lead)]);
  const errors = results
    .filter((r): r is PromiseRejectedResult => r.status === 'rejected')
    .map((r) => r.reason);
  if (errors.length > 0) {
    throw new AggregateError(errors, 'One or more lead destinations failed');
  }
}
```

- [ ] **Step 6: Repository unit test (mock-based fan-out)**

`tests/leads/repository.test.ts`:

```ts
import { describe, it, expect, vi } from 'vitest';
import { processLead } from '@/lib/leads/repository';
import type { Lead, LeadRepository } from '@/lib/leads/types';

const fakeLead: Lead = {
  id: 'test-1',
  createdAt: new Date().toISOString(),
  contact: { nombre: 'Test', email: 't@t.com', telefono: '600000000' },
  diagnosis: {
    estimate: { min: 50000, max: 70000, central: 60000 },
    duration: { weeksMin: 8, weeksMax: 10 },
    risks: [],
    viability: { level: 'alta', microcopy: 'ok', cta: { label: 'x', href: '#' } },
    answers: {
      tipo: 'integral',
      metros: 80,
      barrio: 'chamberi',
      antiguedad: '1980-2000',
      calidad: 'medio',
      estado: 'estrenar',
      plazo: '3-6-meses',
      extras: { sinAscensor: false, edificioProtegido: false, zonaBajasEmisiones: false },
    },
  },
};

describe('processLead', () => {
  it('calls both save and notify on success', async () => {
    const save = vi.fn().mockResolvedValue(undefined);
    const notify = vi.fn().mockResolvedValue(undefined);
    const repo: LeadRepository = { save, notify };
    await processLead(fakeLead, repo);
    expect(save).toHaveBeenCalledOnce();
    expect(notify).toHaveBeenCalledOnce();
  });

  it('still calls notify even if save fails', async () => {
    const save = vi.fn().mockRejectedValue(new Error('sheets down'));
    const notify = vi.fn().mockResolvedValue(undefined);
    const repo: LeadRepository = { save, notify };
    await expect(processLead(fakeLead, repo)).rejects.toThrow();
    expect(notify).toHaveBeenCalledOnce();
  });

  it('still calls save even if notify fails', async () => {
    const save = vi.fn().mockResolvedValue(undefined);
    const notify = vi.fn().mockRejectedValue(new Error('resend down'));
    const repo: LeadRepository = { save, notify };
    await expect(processLead(fakeLead, repo)).rejects.toThrow();
    expect(save).toHaveBeenCalledOnce();
  });
});
```

- [ ] **Step 7: API endpoint with Zod validation**

`app/api/leads/route.ts`:

```ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { diagnose } from '@/lib/pricing/diagnose';
import { processLead } from '@/lib/leads/repository';
import type { Lead } from '@/lib/leads/types';

export const runtime = 'nodejs';

const schema = z.object({
  contact: z.object({
    nombre: z.string().min(2).max(100),
    email: z.string().email(),
    telefono: z.string().min(6).max(20),
  }),
  answers: z.object({
    tipo: z.enum(['integral', 'parcial', 'zona-humeda', 'cocina']),
    metros: z.number().int().min(15).max(1000),
    barrio: z.string(),
    antiguedad: z.enum(['pre-1950', '1950-1980', '1980-2000', 'post-2000']),
    calidad: z.enum(['basico', 'medio', 'alto', 'premium']),
    estado: z.enum(['estrenar', 'vivido-obsoleto', 'parcial-reformado']),
    plazo: z.enum(['sin-prisa', '3-6-meses', 'urgente']),
    extras: z.object({
      sinAscensor: z.boolean(),
      edificioProtegido: z.boolean(),
      zonaBajasEmisiones: z.boolean(),
    }),
    presupuestoCliente: z.number().optional(),
  }),
  source: z
    .object({
      utm_source: z.string().optional(),
      utm_medium: z.string().optional(),
      utm_campaign: z.string().optional(),
      referrer: z.string().optional(),
    })
    .optional(),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const { contact, answers, source } = parsed.data;
  // The wizard already produced the diagnosis client-side, but we re-run server-side
  // so we never trust the client's calculated numbers.
  const diagnosis = diagnose({ ...answers, contacto: contact } as never);

  const lead: Lead = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    contact,
    diagnosis,
    source,
  };

  try {
    await processLead(lead);
  } catch (err) {
    console.error('[leads] processing failed', err);
    return NextResponse.json(
      { error: 'Lead processing partially failed' },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, id: lead.id });
}
```

- [ ] **Step 8: Run tests**

```bash
npm test
```
Expected: all tests pass (pricing + leads).

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: lead capture with repository pattern (Resend + Sheets fan-out)

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Task 6: Wizard UI — 10-step state machine with animations

**Goal:** Build the diagnostic wizard: a multi-step form that walks users through 10 steps (7 base from spec + extras + budget + contact), with smooth transitions, persistent state, progress bar, and validation. Output of completed wizard is stored in `sessionStorage` and the user is routed to `/informe`.

**Files:**
- Create: `app/diagnostico/page.tsx`, `components/wizard/wizard.tsx`, `components/wizard/progress-bar.tsx`, `components/wizard/step-tipo.tsx`, `components/wizard/step-metros.tsx`, `components/wizard/step-barrio.tsx`, `components/wizard/step-antiguedad.tsx`, `components/wizard/step-calidad.tsx`, `components/wizard/step-estado.tsx`, `components/wizard/step-plazo.tsx`, `components/wizard/step-extras.tsx`, `components/wizard/step-presupuesto.tsx`, `components/wizard/step-contacto.tsx`, `lib/wizard-state.ts`

**Acceptance Criteria:**
- [ ] Wizard renders 10 sequential steps with back/next navigation
- [ ] Progress bar shows X of 10
- [ ] Each step validates before allowing "next"
- [ ] Animations: slide + fade between steps via Framer Motion
- [ ] State persists in `sessionStorage` so a refresh doesn't lose progress
- [ ] On completion, `WizardAnswers` are stored and user is routed to `/informe`
- [ ] Mobile-perfect: touch targets ≥ 44px, no horizontal scroll, large tap zones
- [ ] Keyboard accessible: Tab/Enter navigates, focus visible

**Verify:** Manual: complete the wizard end-to-end on `localhost:3000/diagnostico`, refresh in middle, confirm state persists, finish, confirm redirect to `/informe` with answers in `sessionStorage`.

**Steps:**

> **Implementation note for the implementer:** This task is large. After creating the state machine + first step + last step (the bones), use the `frontend-design` skill to refine the visual polish of each step component. The skill is allowed inside execution.

- [ ] **Step 1: Create the state hook**

`lib/wizard-state.ts`:

```ts
'use client';

import { useEffect, useState } from 'react';
import type { WizardAnswers } from '@/lib/pricing/types';

const STORAGE_KEY = 'cota-wizard-state';

export type PartialAnswers = Partial<WizardAnswers> & {
  extras?: Partial<WizardAnswers['extras']>;
};

export const EMPTY: PartialAnswers = {
  extras: { sinAscensor: false, edificioProtegido: false, zonaBajasEmisiones: false },
};

export function useWizardState() {
  const [answers, setAnswers] = useState<PartialAnswers>(EMPTY);
  const [step, setStep] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setAnswers(parsed.answers ?? EMPTY);
        setStep(parsed.step ?? 0);
      }
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, step }));
  }, [answers, step, hydrated]);

  const update = (patch: PartialAnswers) =>
    setAnswers((a) => ({
      ...a,
      ...patch,
      extras: { ...a.extras, ...patch.extras },
    }));

  const reset = () => {
    setAnswers(EMPTY);
    setStep(0);
    sessionStorage.removeItem(STORAGE_KEY);
  };

  return { answers, step, setStep, update, reset, hydrated };
}

export function isComplete(a: PartialAnswers): a is WizardAnswers {
  return (
    !!a.tipo &&
    typeof a.metros === 'number' &&
    !!a.barrio &&
    !!a.antiguedad &&
    !!a.calidad &&
    !!a.estado &&
    !!a.plazo &&
    !!a.extras &&
    !!a.contacto
  );
}
```

- [ ] **Step 2: Progress bar component**

`components/wizard/progress-bar.tsx`:

```tsx
import { motion } from 'framer-motion';

export function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = Math.round(((current + 1) / total) * 100);
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-muted-foreground mb-2">
        <span>Paso {current + 1} de {total}</span>
        <span>{pct}%</span>
      </div>
      <div className="h-1 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-accent"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Wizard orchestrator (state machine)**

`components/wizard/wizard.tsx`:

```tsx
'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useWizardState, isComplete } from '@/lib/wizard-state';
import { ProgressBar } from './progress-bar';
import { StepTipo } from './step-tipo';
import { StepMetros } from './step-metros';
import { StepBarrio } from './step-barrio';
import { StepAntiguedad } from './step-antiguedad';
import { StepCalidad } from './step-calidad';
import { StepEstado } from './step-estado';
import { StepPlazo } from './step-plazo';
import { StepExtras } from './step-extras';
import { StepPresupuesto } from './step-presupuesto';
import { StepContacto } from './step-contacto';

const STEPS = [
  StepTipo,
  StepMetros,
  StepBarrio,
  StepAntiguedad,
  StepCalidad,
  StepEstado,
  StepPlazo,
  StepExtras,
  StepPresupuesto,
  StepContacto,
];

export function Wizard() {
  const router = useRouter();
  const { answers, step, setStep, update, hydrated } = useWizardState();

  if (!hydrated) return null;

  const Current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  const next = () => {
    if (isLast) {
      if (isComplete(answers)) {
        sessionStorage.setItem('cota-final-answers', JSON.stringify(answers));
        router.push('/informe');
      }
      return;
    }
    setStep(step + 1);
  };

  const back = () => setStep(Math.max(0, step - 1));

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <ProgressBar current={step} total={STEPS.length} />
      <div className="mt-12 min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <Current answers={answers} update={update} onNext={next} onBack={back} canBack={step > 0} isLast={isLast} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export interface StepProps {
  answers: ReturnType<typeof useWizardState>['answers'];
  update: ReturnType<typeof useWizardState>['update'];
  onNext: () => void;
  onBack: () => void;
  canBack: boolean;
  isLast: boolean;
}
```

- [ ] **Step 4: Reusable card-option pattern + first step (Tipo)**

`components/wizard/step-tipo.tsx`:

```tsx
import { Button } from '@/components/ui/button';
import { TIPO_OPTIONS } from '@/config/wizard';
import type { StepProps } from './wizard';

export function StepTipo({ answers, update, onNext }: StepProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl mb-2">¿Qué tipo de reforma necesitas?</h2>
        <p className="text-muted-foreground">Empezamos por entender el alcance.</p>
      </div>
      <div className="grid gap-3">
        {TIPO_OPTIONS.map((opt) => {
          const selected = answers.tipo === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => update({ tipo: opt.value })}
              className={`text-left p-5 rounded-lg border transition-colors ${
                selected
                  ? 'border-accent bg-accent/10'
                  : 'border-border hover:border-muted-foreground'
              }`}
            >
              <div className="font-medium">{opt.label}</div>
              {opt.description && (
                <div className="text-sm text-muted-foreground mt-1">{opt.description}</div>
              )}
            </button>
          );
        })}
      </div>
      <div className="flex justify-end">
        <Button onClick={onNext} disabled={!answers.tipo} size="lg">
          Continuar
        </Button>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Implement remaining single-choice steps following the same pattern**

Steps `step-barrio.tsx`, `step-antiguedad.tsx`, `step-calidad.tsx`, `step-estado.tsx`, `step-plazo.tsx` all follow the EXACT same shape as `step-tipo.tsx` — copy the file and:
- Change the imported options constant (`BARRIO_OPTIONS`, `ANTIGUEDAD_OPTIONS`, etc.)
- Change the field name in `update({ <field>: opt.value })`
- Change the headline + helper text
- Change the disabled check on the Continue button

Each step uses the same `StepProps` interface and calls `onNext()`. The implementer should NOT abstract these into a single component — keeping them as separate files makes copy edits trivial later.

The headlines per step:
- **step-barrio**: "¿En qué zona de Madrid?" / helper: "El barrio influye en logística y normativa."
- **step-antiguedad**: "¿Cuándo se construyó el edificio?" / helper: "La antigüedad nos dice qué problemas pueden aparecer."
- **step-calidad**: "¿Qué nivel de acabados buscas?" / helper: "Marca el rango de inversión."
- **step-estado**: "¿Cómo está el piso ahora?" / helper: "Define el alcance de la demolición."
- **step-plazo**: "¿Para cuándo lo necesitas?" / helper: "El plazo afecta planificación y coste."

- [ ] **Step 6: Numeric step (Metros)**

`components/wizard/step-metros.tsx`:

```tsx
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { StepProps } from './wizard';

export function StepMetros({ answers, update, onNext, onBack, canBack }: StepProps) {
  const valid = typeof answers.metros === 'number' && answers.metros >= 15 && answers.metros <= 1000;
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl mb-2">¿Cuántos metros tiene el piso?</h2>
        <p className="text-muted-foreground">Superficie útil aproximada.</p>
      </div>
      <div className="max-w-xs">
        <Label htmlFor="metros">Metros cuadrados</Label>
        <Input
          id="metros"
          type="number"
          min={15}
          max={1000}
          value={answers.metros ?? ''}
          onChange={(e) => update({ metros: Number(e.target.value) || undefined })}
          placeholder="Ej: 80"
          className="mt-2 text-2xl h-14"
          autoFocus
        />
      </div>
      <div className="flex justify-between">
        {canBack ? <Button variant="ghost" onClick={onBack}>Atrás</Button> : <span />}
        <Button onClick={onNext} disabled={!valid} size="lg">Continuar</Button>
      </div>
    </div>
  );
}
```

- [ ] **Step 7: Extras step (3 checkboxes)**

`components/wizard/step-extras.tsx`:

```tsx
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import type { StepProps } from './wizard';

const EXTRAS = [
  { key: 'sinAscensor', label: 'Edificio sin ascensor', help: 'Subir material y bajar escombro a mano.' },
  { key: 'edificioProtegido', label: 'Edificio protegido o catalogado', help: 'Patrimonio puede requerir trámites adicionales.' },
  { key: 'zonaBajasEmisiones', label: 'Dentro de Madrid Central / ZBE', help: 'Restricciones de acceso para vehículos.' },
] as const;

export function StepExtras({ answers, update, onNext, onBack, canBack }: StepProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl mb-2">¿Algo más que debamos saber?</h2>
        <p className="text-muted-foreground">Marca lo que aplique. Puedes saltar este paso.</p>
      </div>
      <div className="space-y-4">
        {EXTRAS.map(({ key, label, help }) => (
          <label key={key} className="flex items-start gap-3 p-4 rounded-lg border border-border cursor-pointer">
            <Checkbox
              checked={answers.extras?.[key] ?? false}
              onCheckedChange={(c) => update({ extras: { [key]: !!c } })}
              className="mt-1"
            />
            <div>
              <div className="font-medium">{label}</div>
              <div className="text-sm text-muted-foreground">{help}</div>
            </div>
          </label>
        ))}
      </div>
      <div className="flex justify-between">
        {canBack ? <Button variant="ghost" onClick={onBack}>Atrás</Button> : <span />}
        <Button onClick={onNext} size="lg">Continuar</Button>
      </div>
    </div>
  );
}
```

- [ ] **Step 8: Presupuesto step (optional numeric)**

`components/wizard/step-presupuesto.tsx`:

```tsx
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { StepProps } from './wizard';

export function StepPresupuesto({ answers, update, onNext, onBack }: StepProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl mb-2">¿Tienes un presupuesto en mente?</h2>
        <p className="text-muted-foreground">
          Opcional. Nos ayuda a ser más precisos sobre la viabilidad.
        </p>
      </div>
      <div className="max-w-xs">
        <Label htmlFor="presupuesto">Presupuesto aproximado (€)</Label>
        <Input
          id="presupuesto"
          type="number"
          min={0}
          step={1000}
          value={answers.presupuestoCliente ?? ''}
          onChange={(e) =>
            update({ presupuestoCliente: e.target.value ? Number(e.target.value) : undefined })
          }
          placeholder="Ej: 60000"
          className="mt-2 text-2xl h-14"
        />
        <p className="text-xs text-muted-foreground mt-2">Puedes saltar esta pregunta.</p>
      </div>
      <div className="flex justify-between">
        <Button variant="ghost" onClick={onBack}>Atrás</Button>
        <Button onClick={onNext} size="lg">Continuar</Button>
      </div>
    </div>
  );
}
```

- [ ] **Step 9: Contacto step (final)**

`components/wizard/step-contacto.tsx`:

```tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { StepProps } from './wizard';

export function StepContacto({ answers, update, onNext, onBack }: StepProps) {
  const [touched, setTouched] = useState(false);
  const c = answers.contacto ?? { nombre: '', email: '', telefono: '' };
  const valid =
    c.nombre.length >= 2 &&
    /\S+@\S+\.\S+/.test(c.email) &&
    c.telefono.replace(/\D/g, '').length >= 9;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl mb-2">¿A quién enviamos el informe?</h2>
        <p className="text-muted-foreground">
          Solo lo usamos para contactarte sobre tu reforma. No enviamos publicidad.
        </p>
      </div>
      <div className="space-y-4 max-w-md">
        <div>
          <Label htmlFor="nombre">Nombre</Label>
          <Input
            id="nombre"
            value={c.nombre}
            onChange={(e) => update({ contacto: { ...c, nombre: e.target.value } })}
            className="mt-2"
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={c.email}
            onChange={(e) => update({ contacto: { ...c, email: e.target.value } })}
            className="mt-2"
          />
        </div>
        <div>
          <Label htmlFor="telefono">Teléfono</Label>
          <Input
            id="telefono"
            type="tel"
            value={c.telefono}
            onChange={(e) => update({ contacto: { ...c, telefono: e.target.value } })}
            className="mt-2"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Al enviar aceptas nuestra{' '}
          <a href="/politica-privacidad" className="underline">política de privacidad</a>.
        </p>
      </div>
      <div className="flex justify-between">
        <Button variant="ghost" onClick={onBack}>Atrás</Button>
        <Button
          onClick={() => {
            setTouched(true);
            if (valid) onNext();
          }}
          disabled={touched && !valid}
          size="lg"
        >
          Ver mi informe
        </Button>
      </div>
    </div>
  );
}
```

- [ ] **Step 10: Wizard page**

`app/diagnostico/page.tsx`:

```tsx
import { Wizard } from '@/components/wizard/wizard';

export const metadata = { title: 'Diagnóstico de tu reforma — Cota' };

export default function Page() {
  return <Wizard />;
}
```

- [ ] **Step 11: Add `update` extras handler fix**

The `update` function in `lib/wizard-state.ts` already merges extras correctly via the spread on line `extras: { ...a.extras, ...patch.extras }`. Verify that calling `update({ extras: { sinAscensor: true } })` does NOT erase the other 2 booleans. If it does, the merge is wrong — fix and re-test manually.

- [ ] **Step 12: Manual end-to-end test**

```bash
npm run dev
```
Visit `localhost:3000/diagnostico`. Walk through all 10 steps. Refresh in step 5. Verify state persists. Complete the wizard. Verify URL changes to `/informe` (page will 404 until Task 7 — that's expected).

- [ ] **Step 13: Commit**

```bash
git add -A
git commit -m "feat: 10-step diagnostic wizard with persistent state and animations

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Task 7: Informe page — report visualization

**Goal:** Render the diagnostic report (rango de precio, duración, semáforo de viabilidad, riesgos, CTA dinámico) reading from `sessionStorage`. Submits the lead to `/api/leads` on first render.

**Files:**
- Create: `app/informe/page.tsx`, `components/informe/informe.tsx`, `components/informe/rango-precio.tsx`, `components/informe/duracion.tsx`, `components/informe/semaforo.tsx`, `components/informe/riesgos.tsx`, `components/informe/cta-dinamico.tsx`

**Acceptance Criteria:**
- [ ] Reads `cota-final-answers` from `sessionStorage`
- [ ] Computes diagnosis client-side via `diagnose()` (same engine the API will recompute server-side for security)
- [ ] Renders: large price range, duration in weeks, semaforo with color, risks list, CTA button matching viability level
- [ ] On mount, POSTs the lead to `/api/leads` exactly once (via a `sentRef` guard)
- [ ] Handles missing answers (redirect back to `/diagnostico`)
- [ ] Responsive: stacks on mobile, side-by-side on desktop
- [ ] Print-friendly CSS (the cliente may want to save it as PDF)

**Verify:** Manual: complete the wizard, land on `/informe`, verify the report renders and a lead arrives at the test email + Sheet (after Task 5 env vars are set).

**Steps:**

- [ ] **Step 1: Format helpers**

Add to `lib/utils.ts` (append):

```ts
export const formatEUR = (n: number) =>
  new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(n);
```

- [ ] **Step 2: Semaforo component**

`components/informe/semaforo.tsx`:

```tsx
import type { Viability } from '@/lib/pricing/types';

const STYLE = {
  alta: { dot: 'bg-success', text: 'text-success', label: 'Viabilidad alta' },
  media: { dot: 'bg-warning', text: 'text-warning', label: 'Viabilidad media' },
  baja: { dot: 'bg-danger', text: 'text-danger', label: 'No es la mejor opción' },
} as const;

export function Semaforo({ viability }: { viability: Viability }) {
  const s = STYLE[viability.level];
  return (
    <div className="flex items-start gap-4 p-6 rounded-xl border border-border bg-card">
      <div className={`h-4 w-4 rounded-full ${s.dot} mt-1.5 shrink-0`} />
      <div>
        <div className={`font-medium ${s.text}`}>{s.label}</div>
        <p className="text-muted-foreground mt-2">{viability.microcopy}</p>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Rango precio + Duracion + Riesgos + CTA components**

`components/informe/rango-precio.tsx`:

```tsx
import { formatEUR } from '@/lib/utils';
import type { PriceEstimate } from '@/lib/pricing/types';

export function RangoPrecio({ estimate }: { estimate: PriceEstimate }) {
  return (
    <div className="text-center md:text-left">
      <p className="text-sm text-muted-foreground uppercase tracking-wider">Rango estimado</p>
      <p className="font-serif text-4xl md:text-5xl mt-2">
        {formatEUR(estimate.min)} <span className="text-muted-foreground">–</span> {formatEUR(estimate.max)}
      </p>
    </div>
  );
}
```

`components/informe/duracion.tsx`:

```tsx
import type { DurationEstimate } from '@/lib/pricing/types';

export function Duracion({ duration }: { duration: DurationEstimate }) {
  return (
    <div className="text-center md:text-left">
      <p className="text-sm text-muted-foreground uppercase tracking-wider">Duración estimada</p>
      <p className="font-serif text-4xl md:text-5xl mt-2">
        {duration.weeksMin}–{duration.weeksMax} <span className="text-muted-foreground text-2xl">semanas</span>
      </p>
    </div>
  );
}
```

`components/informe/riesgos.tsx`:

```tsx
import type { Risk } from '@/lib/pricing/types';

const SEVERITY = {
  info: 'border-muted-foreground/30',
  warning: 'border-warning/60',
  critical: 'border-danger/60',
} as const;

export function Riesgos({ risks }: { risks: Risk[] }) {
  if (risks.length === 0) return null;
  return (
    <div>
      <h2 className="text-2xl mb-4">Riesgos detectados</h2>
      <div className="space-y-3">
        {risks.map((r) => (
          <div key={r.id} className={`p-4 rounded-lg border-l-4 bg-card ${SEVERITY[r.severity]}`}>
            <div className="font-medium">{r.title}</div>
            <p className="text-sm text-muted-foreground mt-1">{r.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

`components/informe/cta-dinamico.tsx`:

```tsx
import { Button } from '@/components/ui/button';
import type { Viability } from '@/lib/pricing/types';

export function CtaDinamico({ viability }: { viability: Viability }) {
  return (
    <div className="text-center mt-12">
      <Button size="lg" asChild className="text-lg h-14 px-8">
        <a href={viability.cta.href}>{viability.cta.label}</a>
      </Button>
    </div>
  );
}
```

- [ ] **Step 4: Informe orchestrator (reads sessionStorage, submits lead)**

`components/informe/informe.tsx`:

```tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { diagnose } from '@/lib/pricing/diagnose';
import type { Diagnosis, WizardAnswers } from '@/lib/pricing/types';
import { RangoPrecio } from './rango-precio';
import { Duracion } from './duracion';
import { Semaforo } from './semaforo';
import { Riesgos } from './riesgos';
import { CtaDinamico } from './cta-dinamico';

export function Informe() {
  const router = useRouter();
  const [d, setD] = useState<Diagnosis | null>(null);
  const sentRef = useRef(false);

  useEffect(() => {
    const raw = sessionStorage.getItem('cota-final-answers');
    if (!raw) {
      router.replace('/diagnostico');
      return;
    }
    let answers: WizardAnswers;
    try {
      answers = JSON.parse(raw);
    } catch {
      router.replace('/diagnostico');
      return;
    }
    const diagnosis = diagnose(answers);
    setD(diagnosis);

    if (sentRef.current) return;
    sentRef.current = true;

    fetch('/api/leads', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        contact: answers.contacto,
        answers: { ...answers, contacto: undefined },
      }),
    }).catch((err) => console.error('[informe] lead submit failed', err));
  }, [router]);

  if (!d) return <div className="mx-auto max-w-3xl px-6 py-24 text-center">Generando tu informe…</div>;

  return (
    <main className="mx-auto max-w-3xl px-6 py-16 print:py-8">
      <header className="mb-12">
        <p className="text-sm text-muted-foreground uppercase tracking-wider">Tu diagnóstico</p>
        <h1 className="text-4xl md:text-5xl mt-2">Informe de tu reforma</h1>
      </header>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <RangoPrecio estimate={d.estimate} />
        <Duracion duration={d.duration} />
      </div>

      <div className="mb-12">
        <Semaforo viability={d.viability} />
      </div>

      <Riesgos risks={d.risks} />

      <CtaDinamico viability={d.viability} />
    </main>
  );
}
```

- [ ] **Step 5: Informe page**

`app/informe/page.tsx`:

```tsx
import { Informe } from '@/components/informe/informe';

export const metadata = { title: 'Informe — Cota' };

export default function Page() {
  return <Informe />;
}
```

- [ ] **Step 6: Manual flow test**

```bash
npm run dev
```
Complete wizard → land on informe → verify all blocks render, semaforo color matches answers, CTA matches viability level. Check browser DevTools Network tab: `POST /api/leads` should return 200 (or 500 if env vars not set — that's fine for now, we test that in Task 11).

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: informe page with semaforo, riesgos, and dynamic CTA

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Task 8: Marketing landing — hero + all content sections

**Goal:** Build the public home page with all marketing sections from the spec brief: hero with input that routes to wizard, autoridad, propuesta de valor, escenarios reales, cómo funciona, filtrado, agenda block, cierre. Premium visual quality.

**Files:**
- Create: `components/marketing/hero.tsx`, `components/marketing/autoridad.tsx`, `components/marketing/propuesta-valor.tsx`, `components/marketing/escenarios.tsx`, `components/marketing/como-funciona.tsx`, `components/marketing/filtrado.tsx`, `components/marketing/agenda-block.tsx`, `components/marketing/cierre.tsx`, `content/copy.ts`
- Modify: `app/page.tsx`

**Acceptance Criteria:**
- [ ] Home page renders all 8 sections in order
- [ ] Hero input redirects to `/diagnostico` when submitted (without losing the typed text — store in sessionStorage as `cota-hero-input` for context)
- [ ] All copy lives in `content/copy.ts` (typed constants), not hardcoded in components
- [ ] Mobile-perfect: 1-column on mobile, 2-3 column grids on desktop
- [ ] Hero has subtle animation on load (fade + small slide via Framer Motion)
- [ ] Lighthouse Performance ≥ 85 on mobile

**Verify:** Manual visual review on `localhost:3000` at 375px, 768px, 1440px widths. Run Lighthouse on home.

**Steps:**

> **Implementation note:** This is the most visual task. After scaffolding the structure with the code below, use the `frontend-design` skill to elevate the visual polish — refined typography hierarchy, micro-interactions, hover states, motion timing. The skill is allowed inside execution.

- [ ] **Step 1: Centralize all copy**

`content/copy.ts`:

```ts
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
```

- [ ] **Step 2: Hero with input**

`components/marketing/hero.tsx`:

```tsx
'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { COPY } from '@/content/copy';

export function Hero() {
  const router = useRouter();
  const [value, setValue] = useState('');

  const submit = () => {
    if (value.trim()) sessionStorage.setItem('cota-hero-input', value.trim());
    router.push('/diagnostico');
  };

  return (
    <section className="relative min-h-[90vh] flex items-center px-6">
      <div className="mx-auto max-w-4xl text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="text-4xl md:text-6xl lg:text-7xl leading-tight"
        >
          {COPY.hero.title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
          className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
        >
          {COPY.hero.subtitle}
        </motion.p>
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
          className="mt-12 flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto"
        >
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={COPY.hero.inputPlaceholder}
            className="h-14 text-base"
          />
          <Button type="submit" size="lg" className="h-14 px-8">
            {COPY.hero.inputCta}
          </Button>
        </motion.form>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-4 text-sm text-muted-foreground"
        >
          {COPY.hero.microcopy}
        </motion.p>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Remaining sections (skeletons — refine visually with frontend-design)**

`components/marketing/autoridad.tsx`:

```tsx
import { COPY } from '@/content/copy';

export function Autoridad() {
  return (
    <section className="py-24 px-6">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-3xl md:text-5xl">{COPY.autoridad.title}</h2>
        <p className="mt-8 text-lg text-muted-foreground">{COPY.autoridad.body}</p>
        <p className="mt-6 text-xl">{COPY.autoridad.closing}</p>
      </div>
    </section>
  );
}
```

`components/marketing/propuesta-valor.tsx`:

```tsx
import { Check } from 'lucide-react';
import { COPY } from '@/content/copy';

export function PropuestaValor() {
  return (
    <section className="py-24 px-6 bg-card">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-3xl md:text-5xl mb-12">{COPY.propuesta.title}</h2>
        <ul className="space-y-4">
          {COPY.propuesta.bullets.map((b) => (
            <li key={b} className="flex items-start gap-3 text-lg">
              <Check className="text-accent mt-1.5 shrink-0" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
```

`components/marketing/escenarios.tsx`:

```tsx
import { COPY } from '@/content/copy';

export function Escenarios() {
  return (
    <section className="py-24 px-6">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-3xl md:text-5xl mb-12 max-w-3xl">{COPY.escenarios.title}</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {COPY.escenarios.cards.map((c) => (
            <article key={c.title} className="p-8 rounded-xl border border-border bg-card">
              <h3 className="text-xl mb-4">{c.title}</h3>
              <p className="text-muted-foreground">{c.body}</p>
              <p className="mt-6 text-accent">{c.closing}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
```

`components/marketing/como-funciona.tsx`:

```tsx
import { COPY } from '@/content/copy';

export function ComoFunciona() {
  return (
    <section className="py-24 px-6 bg-card">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-3xl md:text-5xl mb-16 text-center">{COPY.comoFunciona.title}</h2>
        <div className="grid md:grid-cols-3 gap-12">
          {COPY.comoFunciona.steps.map((s) => (
            <div key={s.n}>
              <div className="font-serif text-5xl text-accent mb-4">{s.n}</div>
              <h3 className="text-2xl mb-2">{s.title}</h3>
              <p className="text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

`components/marketing/filtrado.tsx`:

```tsx
import { COPY } from '@/content/copy';

export function Filtrado() {
  return (
    <section className="py-24 px-6">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl md:text-5xl">{COPY.filtrado.title}</h2>
        <p className="mt-8 text-lg text-muted-foreground">{COPY.filtrado.body}</p>
        <p className="mt-6 text-xl">{COPY.filtrado.closing}</p>
      </div>
    </section>
  );
}
```

`components/marketing/agenda-block.tsx`:

```tsx
import { COPY } from '@/content/copy';
import { Button } from '@/components/ui/button';

export function AgendaBlock() {
  return (
    <section id="agenda" className="py-24 px-6 bg-card">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-3xl md:text-5xl mb-12 text-center">{COPY.agenda.title}</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {COPY.agenda.options.map((o) => (
            <article key={o.title} className="p-8 rounded-xl border border-border text-center">
              <div className="text-4xl mb-4">{o.icon}</div>
              <h3 className="text-xl">{o.title}</h3>
              <p className="text-sm text-accent mt-1">{o.duration}</p>
              <p className="mt-4 text-muted-foreground">{o.body}</p>
            </article>
          ))}
        </div>
        <p className="mt-12 text-center text-sm text-muted-foreground">
          Solo trabajamos con un número limitado de proyectos al mes.
        </p>
      </div>
    </section>
  );
}
```

`components/marketing/cierre.tsx`:

```tsx
import { Button } from '@/components/ui/button';
import { COPY } from '@/content/copy';
import Link from 'next/link';

export function Cierre() {
  return (
    <section className="py-32 px-6">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl md:text-5xl mb-12">{COPY.cierre.title}</h2>
        <Button asChild size="lg" className="h-14 text-lg px-8">
          <Link href="/diagnostico">{COPY.cierre.cta}</Link>
        </Button>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Compose the home page**

`app/page.tsx`:

```tsx
import { Hero } from '@/components/marketing/hero';
import { Autoridad } from '@/components/marketing/autoridad';
import { PropuestaValor } from '@/components/marketing/propuesta-valor';
import { Escenarios } from '@/components/marketing/escenarios';
import { ComoFunciona } from '@/components/marketing/como-funciona';
import { Filtrado } from '@/components/marketing/filtrado';
import { AgendaBlock } from '@/components/marketing/agenda-block';
import { Cierre } from '@/components/marketing/cierre';

export default function Home() {
  return (
    <>
      <Hero />
      <Autoridad />
      <PropuestaValor />
      <Escenarios />
      <ComoFunciona />
      <Filtrado />
      <AgendaBlock />
      <Cierre />
    </>
  );
}
```

- [ ] **Step 5: Visual refinement pass with `frontend-design`**

> **Implementer:** Invoke the `frontend-design` skill now and ask it to elevate the visual quality of the marketing landing — typography hierarchy, micro-interactions, hover states, spacing, motion timing. Pass it the file paths of the 8 marketing components above. Apply its suggestions.

- [ ] **Step 6: Manual review at 3 widths**

```bash
npm run dev
```
Test at 375px (iPhone SE), 768px (iPad), 1440px (laptop). No horizontal scroll. Touch targets ≥ 44px on mobile. Headlines readable without squinting.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: marketing landing with hero, sections, and content from copy.ts

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Task 9: Agenda integration (Cal.com) + WhatsApp floating button

**Goal:** Embed Cal.com into the agenda block so visitors with high viability can book directly. Add a global floating WhatsApp button that opens a pre-filled chat.

**Files:**
- Create: `components/whatsapp-floating.tsx`, `components/marketing/agenda-embed.tsx`
- Modify: `components/marketing/agenda-block.tsx`, `app/layout.tsx`

**Acceptance Criteria:**
- [ ] Cal.com inline embed renders inside `#agenda` section using `NEXT_PUBLIC_CALCOM_USERNAME`
- [ ] Embed loads lazily (intersection observer) so it doesn't hurt LCP
- [ ] WhatsApp button appears bottom-right on all pages, opens `https://wa.me/<number>?text=...` with pre-filled greeting
- [ ] WhatsApp button has aria-label and is keyboard accessible

**Verify:** Manual: scroll to #agenda, see Cal.com loading; click WhatsApp button, see prefilled chat open in new tab.

**Steps:**

- [ ] **Step 1: WhatsApp floating component**

`components/whatsapp-floating.tsx`:

```tsx
import { MessageCircle } from 'lucide-react';

export function WhatsAppFloating() {
  const number = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '34600000000').replace(/\D/g, '');
  const text = encodeURIComponent('Hola, vengo de la web de Cota. Tengo una pregunta sobre una reforma.');
  return (
    <a
      href={`https://wa.me/${number}?text=${text}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Hablar por WhatsApp"
      className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full bg-[#25d366] text-white flex items-center justify-center shadow-2xl hover:scale-105 transition-transform"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  );
}
```

- [ ] **Step 2: Mount globally in layout**

In `app/layout.tsx`, add to imports:

```tsx
import { WhatsAppFloating } from '@/components/whatsapp-floating';
```

And inside `<body>` (after `<CookieBanner />`):

```tsx
<WhatsAppFloating />
```

- [ ] **Step 3: Cal.com lazy embed**

`components/marketing/agenda-embed.tsx`:

```tsx
'use client';

import { useEffect, useRef, useState } from 'react';

export function AgendaEmbed() {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
          obs.disconnect();
        }
      },
      { rootMargin: '200px' }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const username = process.env.NEXT_PUBLIC_CALCOM_USERNAME ?? 'cota';

  return (
    <div ref={ref} className="mt-12 w-full min-h-[600px] rounded-xl border border-border overflow-hidden bg-card">
      {show ? (
        <iframe
          src={`https://cal.com/${username}?theme=dark&hideEventTypeDetails=false`}
          className="w-full h-[700px] border-0"
          title="Reservar sesión con Cota"
          loading="lazy"
        />
      ) : (
        <div className="flex items-center justify-center h-[600px] text-muted-foreground">
          Cargando agenda…
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Add embed to agenda block**

Modify `components/marketing/agenda-block.tsx` to import and render `<AgendaEmbed />` at the end of the inner div, before the closing `</section>`:

```tsx
import { AgendaEmbed } from './agenda-embed';
// ...
        <p className="mt-12 text-center text-sm text-muted-foreground">
          Solo trabajamos con un número limitado de proyectos al mes.
        </p>
        <AgendaEmbed />
      </div>
    </section>
```

- [ ] **Step 5: Build and verify**

```bash
npm run build && npm run dev
```
Visit home, scroll to #agenda. Cal.com embed loads when ~near viewport. WhatsApp button visible bottom-right on all pages.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: Cal.com agenda embed and floating WhatsApp button

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Task 10: SEO — metadata, OG image, sitemap, robots

**Goal:** Comprehensive SEO setup so cotamadrid.com ranks for "reforma piso madrid" and looks great when shared on WhatsApp / LinkedIn / X.

**Files:**
- Create: `app/sitemap.ts`, `app/robots.ts`, `app/opengraph-image.tsx`, `lib/seo.ts`
- Modify: `app/layout.tsx`, `app/page.tsx`, `app/diagnostico/page.tsx`, `app/informe/page.tsx`

**Acceptance Criteria:**
- [ ] `/sitemap.xml` lists all public pages
- [ ] `/robots.txt` allows crawling, points to sitemap
- [ ] OG image generated dynamically (Next.js `opengraph-image.tsx`) with brand visual
- [ ] Each page has unique `<title>` and meta description targeting its keyword
- [ ] Schema.org JSON-LD for LocalBusiness on home page
- [ ] Lighthouse SEO score ≥ 95 on home

**Verify:**
```bash
npm run build
curl http://localhost:3000/sitemap.xml
curl http://localhost:3000/robots.txt
```
Both return valid content.

**Steps:**

- [ ] **Step 1: Sitemap**

`app/sitemap.ts`:

```ts
import type { MetadataRoute } from 'next';

const SITE_URL = 'https://cotamadrid.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: SITE_URL, lastModified: now, changeFrequency: 'monthly', priority: 1 },
    { url: `${SITE_URL}/diagnostico`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/politica-privacidad`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/aviso-legal`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/cookies`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];
}
```

- [ ] **Step 2: Robots**

`app/robots.ts`:

```ts
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/informe'] },
    sitemap: 'https://cotamadrid.com/sitemap.xml',
  };
}
```

(Disallow `/informe` because it's a per-user transient page, not crawlable.)

- [ ] **Step 3: OG image generated dynamically**

`app/opengraph-image.tsx`:

```tsx
import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Cota — Reforma con criterio · Madrid';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          backgroundColor: '#0a0a0a',
          color: '#fafafa',
        }}
      >
        <div style={{ fontSize: 140, fontWeight: 300, letterSpacing: '-0.04em' }}>Cota</div>
        <div style={{ fontSize: 36, color: '#a3a3a3', marginTop: 16 }}>
          Reforma con criterio · Madrid
        </div>
        <div style={{ fontSize: 28, color: '#a3a3a3', marginTop: 60, maxWidth: 900 }}>
          Antes de empezar tu reforma, te decimos si es viable, cuánto cuesta y qué riesgos puede tener.
        </div>
      </div>
    ),
    size
  );
}
```

- [ ] **Step 4: SEO metadata helpers**

`lib/seo.ts`:

```ts
import type { Metadata } from 'next';

const SITE_URL = 'https://cotamadrid.com';
const SITE_NAME = 'Cota';

interface PageMetaInput {
  title: string;
  description: string;
  path?: string;
}

export function pageMeta({ title, description, path = '' }: PageMetaInput): Metadata {
  const url = `${SITE_URL}${path}`;
  return {
    title,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url,
      title,
      description,
      siteName: SITE_NAME,
      locale: 'es_ES',
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}
```

- [ ] **Step 5: Apply to each page**

In `app/page.tsx` (home), add at the top:

```tsx
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: 'Reforma integral de pisos en Madrid · Cota',
  description:
    'Antes de empezar tu reforma, te decimos si es viable, cuánto cuesta y qué riesgos puede tener. Consultoría premium en Madrid.',
  path: '/',
});
```

In `app/diagnostico/page.tsx`:

```tsx
import { pageMeta } from '@/lib/seo';
export const metadata = pageMeta({
  title: 'Diagnóstico gratuito de tu reforma · Cota',
  description: 'Analiza tu reforma en menos de 1 minuto: precio, duración, riesgos y viabilidad.',
  path: '/diagnostico',
});
```

In `app/informe/page.tsx`:

```tsx
import { pageMeta } from '@/lib/seo';
export const metadata = {
  ...pageMeta({
    title: 'Tu informe — Cota',
    description: 'Resultado personalizado de tu diagnóstico.',
    path: '/informe',
  }),
  robots: { index: false, follow: false },
};
```

- [ ] **Step 6: LocalBusiness JSON-LD on home**

Add to `app/page.tsx` body:

```tsx
import Script from 'next/script';

// inside the return, before <Hero />:
<Script
  id="ld-localbusiness"
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      '@id': 'https://cotamadrid.com/#business',
      name: 'Cota',
      legalName: 'PCH Obras',
      url: 'https://cotamadrid.com',
      areaServed: { '@type': 'City', name: 'Madrid' },
      description:
        'Consultoría y ejecución de reformas integrales de pisos en Madrid. Análisis previo de viabilidad, precio y riesgos.',
      priceRange: '€€€',
    }),
  }}
/>
```

- [ ] **Step 7: Build and verify**

```bash
npm run build && npm run dev
```
Visit `localhost:3000/sitemap.xml`, `localhost:3000/robots.txt`, `localhost:3000/opengraph-image`. All return 200. View source on home: confirm JSON-LD present.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: SEO metadata, sitemap, robots, OG image, JSON-LD

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Task 11: End-to-end wiring + lead delivery test

**Goal:** Wire the full flow with real env vars and verify a test lead arrives at both Resend and Google Sheets. Add Vercel Analytics.

**Files:**
- Modify: `app/layout.tsx`, `.env.local` (NOT committed)
- Create: `README.md` (with setup instructions for env vars)

**Acceptance Criteria:**
- [ ] Resend API key configured, test email arrives at the receiver inbox
- [ ] Google service account configured, test row appears in the Sheet
- [ ] Vercel Analytics installed and pulling data
- [ ] README documents every required env var with where to get it
- [ ] One full end-to-end test lead completed successfully

**Verify:** Manual: complete the wizard with real data, verify (1) email arrives, (2) Sheet row appears, (3) `/api/leads` returns 200.

**Steps:**

- [ ] **Step 1: Install Vercel Analytics**

```bash
npm install @vercel/analytics
```

- [ ] **Step 2: Mount in layout**

In `app/layout.tsx`:

```tsx
import { Analytics } from '@vercel/analytics/next';
// inside <body>, before </body>:
<Analytics />
```

- [ ] **Step 3: Set up Resend account**

Manual steps for the user (document in README):
1. Sign up at resend.com with `info@cotamadrid.com`
2. Verify the cotamadrid.com domain (DNS records)
3. Create API key
4. Add to `.env.local`:
   ```
   RESEND_API_KEY=re_xxx
   LEADS_TO_EMAIL=info@cotamadrid.com
   LEADS_FROM_EMAIL=Cota <leads@cotamadrid.com>
   ```

- [ ] **Step 4: Set up Google Sheets**

Manual steps:
1. Create a new Google Sheet named "Cota Leads" with first sheet renamed to "Leads"
2. Google Cloud Console → create project "cota-website"
3. Enable Google Sheets API
4. Create service account, generate JSON key
5. Share the Sheet with the service account email (Editor)
6. Add to `.env.local`:
   ```
   GOOGLE_SHEETS_ID=<from URL>
   GOOGLE_SERVICE_ACCOUNT_EMAIL=<from JSON>
   GOOGLE_SERVICE_ACCOUNT_KEY="<private_key from JSON, with \\n>"
   ```

- [ ] **Step 5: Write README with full setup**

`README.md`:

```markdown
# Cota Madrid — Website

Premium landing site for Cota reforms (PCH Obras).
Spec: [`docs/specs/2026-04-06-cota-madrid-design.md`](docs/specs/2026-04-06-cota-madrid-design.md)

## Local development

```bash
npm install
cp .env.local.example .env.local
# Fill in env vars (see below)
npm run dev
```

Open http://localhost:3000

## Required env vars

| Var | Where to get it |
|---|---|
| `RESEND_API_KEY` | resend.com → API Keys |
| `LEADS_TO_EMAIL` | Inbox where leads arrive (e.g. info@cotamadrid.com) |
| `LEADS_FROM_EMAIL` | Verified sender (e.g. `Cota <leads@cotamadrid.com>`) |
| `GOOGLE_SHEETS_ID` | From the Sheet URL |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | From the Google Cloud service account JSON |
| `GOOGLE_SERVICE_ACCOUNT_KEY` | Private key from JSON, escaped with `\\n` for newlines |
| `NEXT_PUBLIC_CALCOM_USERNAME` | cal.com username |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | International format with country code, no spaces |

## Editing pricing

All pricing rules live in `config/pricing.ts`, `config/wizard.ts`, `config/risks.ts`, `config/viability.ts`.
Edit, commit, push — Vercel redeploys in ~1 minute.

## Tests

```bash
npm test           # run once
npm run test:watch # watch mode
```

The calibration test (`tests/pricing/calibration.test.ts`) is the contract:
the Salamanca 80m² 1920 case must yield 96k–130k. If you change pricing
and break this test, recalibrate consciously.

## Deployment

Push to `main` → Vercel deploys preview. Manual promote to production via Vercel UI.
```

- [ ] **Step 6: End-to-end manual test**

```bash
npm run dev
```
Complete the wizard with real test contact. Verify:
1. Browser DevTools Network: `POST /api/leads` returns 200
2. Email arrives in `LEADS_TO_EMAIL` inbox within 10s
3. New row appears in the Google Sheet within 10s
4. The "Reply via WhatsApp" button in the email opens correctly

If any of these fail, debug:
- 422 = Zod validation; check payload shape
- 500 = check Vercel/local logs for which destination failed
- Email not arriving = check Resend dashboard for delivery status

- [ ] **Step 7: Commit**

```bash
git add README.md package.json package-lock.json app/layout.tsx
git commit -m "feat: Vercel Analytics + README with full env setup

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Task 12: QA pass — Lighthouse, mobile, accessibility, performance

**Goal:** Verify the site meets the success criteria from spec §11. Fix anything below threshold.

**Files:** Many small fixes across existing files; create no new ones unless needed.

**Acceptance Criteria:**
- [ ] Lighthouse mobile: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95
- [ ] Wizard completable in < 90s on mobile (manual test)
- [ ] Tested on real iPhone (Safari) and Android (Chrome) at minimum
- [ ] No console errors or warnings on any page
- [ ] All images have alt text; all interactive elements have labels
- [ ] Color contrast meets WCAG AA on all text
- [ ] No layout shift (CLS < 0.1) on hero load

**Verify:** Run Lighthouse on `/`, `/diagnostico`, and `/informe` (after wizard). All scores meet thresholds.

**Steps:**

- [ ] **Step 1: Run Lighthouse on production build locally**

```bash
npm run build && npm start
```
Open Chrome DevTools → Lighthouse → Mobile → Run on `/`, `/diagnostico`. Record scores.

- [ ] **Step 2: Fix any issues found**

Common findings and fixes:
- **CLS from hero font swap** → add `font-display: swap` (already set) and explicitly size hero text containers
- **LCP > 2.5s** → preload hero font, ensure no large images blocking
- **Missing aria-label** on icon buttons → add `aria-label` to WhatsApp button (already done) and any other icon-only elements
- **Insufficient color contrast** → muted-foreground may need to lighten on dark bg; bump to `oklch(0.7 0 0)` if needed
- **Missing alt** → audit all `<img>` tags; add alt text

For each finding, make the fix, re-run Lighthouse, confirm improvement.

- [ ] **Step 3: Real device test**

Get IP of dev machine: `ipconfig getifaddr en0` (Mac WiFi). Connect phone to same WiFi. Visit `http://<ip>:3000/diagnostico` from phone. Walk through the wizard end-to-end. Note any issues (touch targets too small, scroll glitches, keyboard covering input).

Fix issues found.

- [ ] **Step 4: Console + network audit**

Open browser DevTools, walk through the entire flow (home → wizard → informe). Check:
- Console: zero errors, zero warnings
- Network: no failed requests, no 404s
- Sources: no source map errors

- [ ] **Step 5: Commit all fixes**

```bash
git add -A
git commit -m "chore: QA pass - Lighthouse, accessibility, mobile fixes

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Task 13: Production deployment to cotamadrid.com

**Goal:** Connect the custom domain, configure SSL, push the final build, verify in production.

**Files:** None (Vercel UI configuration).

**Acceptance Criteria:**
- [ ] `cotamadrid.com` resolves to the Vercel deployment with valid SSL
- [ ] `cotamadrid.es` redirects to `cotamadrid.com`
- [ ] All env vars set in Vercel production environment
- [ ] One real test lead completes successfully in production
- [ ] Vercel Analytics shows the test visit

**Verify:** Open `https://cotamadrid.com` in incognito. Complete wizard. Lead arrives in production email + Sheet.

**Steps:**

- [ ] **Step 1: Add domains in Vercel**

In Vercel project → Settings → Domains:
- Add `cotamadrid.com` (primary)
- Add `cotamadrid.es` (redirect to cotamadrid.com)
- Vercel shows the DNS records to set at your registrar

- [ ] **Step 2: Configure DNS**

At the domain registrar (where cotamadrid.com is registered):
- Add the records Vercel provides (typically A `76.76.21.21` for apex and CNAME `cname.vercel-dns.com` for `www`)
- Wait for propagation (usually <10 min)

- [ ] **Step 3: Set production env vars in Vercel**

Vercel project → Settings → Environment Variables → add ALL the vars from `.env.local.example` for the **Production** environment. Use the same values as local. **Confirm `GOOGLE_SERVICE_ACCOUNT_KEY` newlines are escaped correctly** — this is the most common production breakage.

- [ ] **Step 4: Trigger production deploy**

```bash
git push origin main
```
Or use Vercel CLI: `npx vercel --prod`. Watch the build logs.

- [ ] **Step 5: Smoke test in production**

In an incognito window:
1. Visit `https://cotamadrid.com` → home loads
2. Visit `https://cotamadrid.es` → redirects to .com
3. Complete the wizard end-to-end with a test contact
4. Verify lead arrives in production inbox + production Sheet
5. Click WhatsApp button → opens correctly
6. Visit `/politica-privacidad`, `/aviso-legal`, `/cookies` → all load
7. Open Vercel Analytics dashboard → see your test visit

- [ ] **Step 6: Tag the release**

```bash
git tag -a v1.0.0 -m "MVP launch — Cota Madrid"
git push origin v1.0.0
```

- [ ] **Step 7: Commit any final tweaks**

If anything was patched during the smoke test, commit and push, let Vercel redeploy, retest.

```bash
git add -A
git commit -m "chore: production launch v1.0.0

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
git push
```

🎉 **Cota está en producción.**

---

## Spec Coverage Self-Review

| Spec section | Covered by task(s) |
|---|---|
| §1 Resumen ejecutivo | All (vision underlying every task) |
| §2 Marca y posicionamiento | Task 1 (design), Task 8 (copy), Task 13 (domain) |
| §3 Alcance MVP-B | Task index covers everything in "SI entra"; "NO entra" items absent (correct) |
| §4 Stack técnico | Task 0 (setup), all tasks use the stack |
| §5.1 Wizard preguntas | Task 3 (config), Task 6 (UI) |
| §5.2 Rangos €/m² | Task 3 (`config/pricing.ts`) |
| §5.3 Modificadores | Task 3 (`config/pricing.ts`) |
| §5.4 Fórmula + calibración | Task 4 (engine + calibration test) |
| §5.5 Reglas viabilidad | Task 3 (`config/viability.ts`), Task 4 (tests) |
| §5.6 Riesgos | Task 3 (`config/risks.ts`), Task 4 (tests), Task 7 (display) |
| §6 Captura/destino leads | Task 5 (full lead pipeline) |
| §7 Estructura proyecto | Task 0 + each task creates its slice |
| §8 Fases trabajo | This entire plan IS the refined fases |
| §9 Diferidos a V2 | Explicitly not built (correct) |
| §10 Riesgos del proyecto | Mitigated by tests (Task 4 calibration) and QA (Task 12) |
| §11 Criterios éxito MVP | Verified in Task 12 (QA) and Task 13 (smoke test) |

**Type consistency check:** All references to `WizardAnswers`, `PriceEstimate`, `Diagnosis`, `Lead`, `LeadRepository` use the same type names from `lib/pricing/types.ts` and `lib/leads/types.ts`. Function names consistent across tasks (`calculate`, `diagnose`, `evaluateRisks`, `evaluateViability`, `processLead`).

**Placeholder scan:** No "TBD" / "TODO" / "implement later" found. The legal page texts are intentionally marked "Pendiente de revisión legal" as per spec — this is content, not code, and tracked in Task 2 acceptance criteria.

**Plan ready for execution.**
