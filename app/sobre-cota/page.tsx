import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  Ear,
  Search,
  FileText,
  HardHat,
  ClipboardCheck,
  Shield,
  ScrollText,
  AlertTriangle,
  Wallet,
  FileSignature,
} from 'lucide-react';
import { Navbar } from '@/components/marketing/navbar';
import { Divider } from '@/components/marketing/divider';

export const metadata: Metadata = {
  title: 'Sobre Cota Madrid · Reformar con criterio',
  description:
    'Cota Madrid nace de PCH Obras, con más de una década reformando viviendas en la Comunidad de Madrid. Una empresa pensada para hacer reformas con seriedad, claridad y atención al detalle.',
  alternates: { canonical: 'https://cotamadrid.es/sobre-cota' },
};

const VALORES = [
  {
    n: '01',
    title: 'Seriedad',
    body: 'Trabajamos con compromiso real. Lo que decimos tiene que sostenerse en obra.',
  },
  {
    n: '02',
    title: 'Transparencia',
    body: 'Hablamos claro sobre alcance, tiempos, costes y decisiones. Sin rodeos.',
  },
  {
    n: '03',
    title: 'Asesoramiento',
    body: 'Cada proyecto tiene sus condiciones. Te ayudamos a tomar buenas decisiones.',
  },
  {
    n: '04',
    title: 'Detalle',
    body: 'Atención a cada fase del proyecto, desde la planificación hasta el acabado final.',
  },
  {
    n: '05',
    title: 'Responsabilidad',
    body: 'Asumimos cada obra como un trabajo que exige criterio, orden y seguimiento.',
  },
  {
    n: '06',
    title: 'Cercanía',
    body: 'Queremos que te sientas acompañado, informado y bien atendido durante todo el proceso.',
  },
] as const;

const PASOS = [
  {
    n: '01',
    icon: Ear,
    title: 'Escuchamos',
    body: 'Entendemos qué necesitas, qué esperas del proyecto y qué aspectos son importantes para ti.',
  },
  {
    n: '02',
    icon: Search,
    title: 'Analizamos',
    body: 'Estudiamos el espacio, valoramos opciones y detectamos los puntos críticos desde el inicio.',
  },
  {
    n: '03',
    icon: FileText,
    title: 'Proponemos',
    body: 'Te presentamos una solución clara y coherente, pensada para tu caso. No una respuesta genérica.',
  },
  {
    n: '04',
    icon: HardHat,
    title: 'Ejecutamos',
    body: 'Coordinamos cada fase con control, seguimiento y atención a lo que ocurre en obra.',
  },
  {
    n: '05',
    icon: ClipboardCheck,
    title: 'Revisamos',
    body: 'Una obra no termina cuando se acaba. Termina cuando todo está como debe estar.',
  },
] as const;

export default function Page() {
  return (
    <>
      <Navbar />
      <main className="relative overflow-hidden bg-background text-foreground">
        {/* Decorative background — technical grid + soft glows.
            Fixed so it scrolls with the page subtly without being heavy. */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-0">
          {/* Fine technical grid */}
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                'linear-gradient(to right, oklch(0.78 0.12 80) 1px, transparent 1px), linear-gradient(to bottom, oklch(0.78 0.12 80) 1px, transparent 1px)',
              backgroundSize: '64px 64px',
              maskImage:
                'radial-gradient(ellipse at center, black 30%, transparent 85%)',
              WebkitMaskImage:
                'radial-gradient(ellipse at center, black 30%, transparent 85%)',
            }}
          />
          {/* Coarser cross grid for depth */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                'linear-gradient(to right, oklch(0.95 0.02 80) 1px, transparent 1px), linear-gradient(to bottom, oklch(0.95 0.02 80) 1px, transparent 1px)',
              backgroundSize: '256px 256px',
            }}
          />
          {/* Warm gold glow top-right */}
          <div
            className="absolute -top-32 right-[-10%] size-[42rem] rounded-full opacity-[0.10] blur-3xl"
            style={{ background: 'oklch(0.78 0.14 80)' }}
          />
          {/* Cream glow bottom-left */}
          <div
            className="absolute bottom-[-10%] left-[-10%] size-[36rem] rounded-full opacity-[0.08] blur-3xl"
            style={{ background: 'oklch(0.92 0.04 75)' }}
          />
          {/* Subtle vertical accent line, like a measure ref */}
          <div
            className="absolute left-1/2 top-0 h-full w-px opacity-[0.06]"
            style={{ background: 'oklch(0.78 0.12 80)' }}
          />
        </div>

        {/* HERO */}
        <section className="relative z-[1] px-6 pt-40 pb-20 md:pt-48 md:pb-28">
          <div className="mx-auto max-w-5xl">
            <div className="mb-6 flex items-center gap-4">
              <span className="h-px w-10 bg-accent" />
              <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">
                Sobre Cota Madrid
              </span>
            </div>
            <h1 className="font-serif text-[2.6rem] leading-[1.02] tracking-[-0.03em] md:text-[4.5rem] lg:text-[5.25rem] text-balance">
              Reformar con <span className="italic text-accent">criterio</span>,
              no con prisa.
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-foreground/75 md:text-xl">
              Cota Madrid nace de una idea simple: hacer reformas en serio. Con
              más de una década de experiencia previa transformando viviendas
              en la Comunidad de Madrid, decidimos construir una forma de
              trabajar distinta — pensada antes de empezar y cuidada hasta el
              último detalle.
            </p>

            {/* Chips */}
            <div className="mt-10 flex flex-wrap gap-3">
              {[
                '+10 años de experiencia',
                'Comunidad de Madrid',
                'Respaldados por PCH Obras',
              ].map((chip) => (
                <span
                  key={chip}
                  className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/5 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-accent"
                >
                  <span className="size-1.5 rounded-full bg-accent" />
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </section>

        <Divider variant="measure" label="Manifiesto · 01" />

        {/* MANIFIESTO */}
        <section className="relative z-[1] px-6 py-20 md:py-28">
          <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-12 md:gap-16">
            <div className="md:col-span-5">
              <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-foreground/55">
                Quiénes somos
              </div>
              <h2 className="mt-4 font-serif text-[2.2rem] leading-[1.05] tracking-[-0.025em] md:text-[3rem] text-balance">
                Una decisión simple: hacer reformas en serio.
              </h2>
            </div>
            <div className="md:col-span-7 space-y-6 text-base leading-relaxed text-foreground/75 md:text-lg">
              <p>
                Después de años dentro del sector, vimos demasiados proyectos
                mal planteados desde el inicio. Presupuestos poco definidos,
                procesos confusos, decisiones tomadas con prisa y clientes
                obligados a avanzar sin tener toda la información.
              </p>
              <p>
                Cota Madrid existe porque quisimos construir otra forma de
                trabajar. Una empresa en la que el cliente entiende el proyecto
                desde el primer momento, en la que cada paso tiene sentido,
                cada propuesta se explica y cada obra se aborda con orden y
                atención al detalle.
              </p>
              <p className="font-serif text-xl italic text-foreground md:text-2xl">
                Para nosotros, reformar no es encadenar oficios. Es asumir la
                responsabilidad de transformar un espacio con criterio.
              </p>
            </div>
          </div>
        </section>

        {/* PULL QUOTE */}
        <section className="relative z-[1] px-6 py-24 md:py-32">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-px w-24 bg-accent/40"
          />
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-8 flex items-center justify-center gap-4">
              <span className="h-px w-10 bg-accent/60" />
              <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
                Cómo entendemos una reforma
              </span>
              <span className="h-px w-10 bg-accent/60" />
            </div>
            <p className="font-serif text-[2rem] leading-[1.15] tracking-[-0.02em] md:text-[3rem] text-balance">
              &ldquo;Una reforma no empieza cuando entra el primer operario.
              Empieza antes — cuando alguien se sienta a entender bien el
              proyecto.&rdquo;
            </p>
            <p className="mt-10 max-w-2xl mx-auto text-base text-foreground/65 md:text-lg">
              Por eso damos tanta importancia al estudio previo, al
              asesoramiento y a la definición clara del proyecto. Cuando esa
              base está bien resuelta, la obra avanza con más lógica, menos
              incertidumbre y mejores resultados.
            </p>
          </div>
        </section>

        <Divider variant="crosses" />

        {/* VALORES */}
        <section className="relative z-[1] px-6 py-20 md:py-28 bg-[var(--color-cream)]/85 text-[var(--color-cream-foreground)]">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 max-w-2xl">
              <div className="mb-6 flex items-center gap-4">
                <span className="h-px w-10 bg-[color:oklch(0.55_0.12_75)]/70" />
                <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-[color:oklch(0.55_0.12_75)]">
                  Nuestros valores
                </span>
              </div>
              <h2 className="font-serif text-[2.2rem] leading-[1.05] tracking-[-0.025em] md:text-[3rem]">
                Seis principios que sostienen cada obra.
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
              {VALORES.map((v) => (
                <article
                  key={v.n}
                  className="group relative border border-[var(--color-cream-border)] bg-white/70 p-6 shadow-editorial backdrop-blur-[1px] transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl"
                >
                  <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-[color:oklch(0.55_0.12_75)]">
                    {v.n}
                  </div>
                  <div className="mt-3 h-px w-10 bg-[color:oklch(0.55_0.12_75)]/60" />
                  <h3 className="mt-5 font-serif text-2xl tracking-[-0.01em]">
                    {v.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--color-cream-muted)]">
                    {v.body}
                  </p>
                  <div
                    aria-hidden
                    className="absolute -bottom-2 -right-2 h-10 w-10 border-b border-r border-[color:oklch(0.55_0.12_75)]/60"
                  />
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CÓMO TRABAJAMOS */}
        <section className="relative z-[1] px-6 py-20 md:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="mb-14 max-w-2xl">
              <div className="mb-6 flex items-center gap-4">
                <span className="h-px w-10 bg-accent" />
                <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">
                  Nuestra forma de trabajar
                </span>
              </div>
              <h2 className="font-serif text-[2.2rem] leading-[1.05] tracking-[-0.025em] md:text-[3rem] text-balance">
                Cinco fases. Una sola lógica: pensar antes de ejecutar.
              </h2>
            </div>

            <ol className="grid grid-cols-1 gap-6 md:grid-cols-5">
              {PASOS.map((p) => {
                const Icon = p.icon;
                return (
                  <li
                    key={p.n}
                    className="relative rounded-lg border border-border/60 bg-card/30 p-6 transition-colors hover:border-accent/40 hover:bg-card/50"
                  >
                    <div className="flex size-11 items-center justify-center rounded-md bg-accent/10 text-accent ring-1 ring-accent/30">
                      <Icon className="size-5" strokeWidth={1.75} />
                    </div>
                    <div className="mt-5 font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/55">
                      Fase {p.n}
                    </div>
                    <h3 className="mt-2 font-serif text-xl tracking-[-0.01em]">
                      {p.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-foreground/70">
                      {p.body}
                    </p>
                  </li>
                );
              })}
            </ol>

            <p className="mt-12 mx-auto max-w-2xl text-center font-serif text-xl italic text-foreground/85 md:text-2xl">
              No trabajamos desde la improvisación. Trabajamos desde el criterio.
            </p>
          </div>
        </section>

        {/* GARANTÍAS Y COBERTURA */}
        <section className="relative z-[1] px-6 py-20 md:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="mb-14 max-w-2xl">
              <div className="mb-6 flex items-center gap-4">
                <span className="h-px w-10 bg-accent" />
                <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">
                  Garantías y cobertura
                </span>
              </div>
              <h2 className="font-serif text-[2.2rem] leading-[1.05] tracking-[-0.025em] md:text-[3rem] text-balance">
                Lo que cubrimos antes, durante y después de la obra.
              </h2>
              <p className="mt-5 text-base text-foreground/65 md:text-lg">
                Una reforma seria no se vende solo en m². Se vende en
                garantías por escrito, en seguros, en cómo gestionamos los
                imprevistos y en quién responde si algo no encaja.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {[
                {
                  icon: Shield,
                  title: 'Garantía LOE de 10 años en estructura',
                  body: 'Conforme a la Ley de Ordenación de la Edificación. Respondemos durante una década por los elementos estructurales que toquemos.',
                },
                {
                  icon: ScrollText,
                  title: 'Seguro de responsabilidad civil',
                  body: 'Contamos con póliza de RC profesional vigente para cubrir daños a la vivienda, a vecinos y a terceros durante la ejecución de la obra.',
                },
                {
                  icon: AlertTriangle,
                  title: 'Gestión transparente de imprevistos',
                  body: 'Si aparece una sorpresa estructural u oculta, paramos, te explicamos las opciones por escrito y solo seguimos cuando lo apruebas.',
                },
                {
                  icon: Wallet,
                  title: 'Pagos por hitos verificables',
                  body: 'No pedimos pagos a cuenta sin contraprestación. Cada hito de pago se ata a una fase entregada y revisable, no a una fecha del calendario.',
                },
                {
                  icon: FileSignature,
                  title: 'Tramitación de licencias urbanísticas',
                  body: 'Nos encargamos de las licencias y comunicaciones previas que requiere el Ayuntamiento de Madrid según el alcance de cada obra.',
                },
                {
                  icon: ClipboardCheck,
                  title: 'Revisión post-obra a los 30 días',
                  body: 'Volvemos a la vivienda una vez instalado para revisar acabados, comprobar funcionamiento y resolver cualquier ajuste pendiente.',
                },
              ].map((g) => {
                const Icon = g.icon;
                return (
                  <article
                    key={g.title}
                    className="flex gap-4 rounded-lg border border-border/60 bg-card/30 p-5 md:p-6 transition-colors hover:border-accent/40"
                  >
                    <div className="shrink-0 flex size-11 items-center justify-center rounded-md bg-accent/10 text-accent ring-1 ring-accent/30">
                      <Icon className="size-5" strokeWidth={1.75} />
                    </div>
                    <div>
                      <h3 className="font-serif text-xl tracking-[-0.01em]">
                        {g.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-foreground/70">
                        {g.body}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>

            <p className="mt-10 max-w-3xl text-sm text-foreground/55 italic">
              La cobertura concreta de cada proyecto se documenta en el
              presupuesto firmado. Pídenos una copia del seguro de RC en
              cualquier momento — lo enseñamos sin problema.
            </p>
          </div>
        </section>

        {/* CIERRE + CTA */}
        <section className="relative z-[1] px-6 py-24 md:py-32">
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-accent/[0.04] to-transparent"
          />
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-8 flex items-center justify-center gap-4">
              <span className="h-px w-10 bg-accent" />
              <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">
                Y por eso estamos aquí
              </span>
              <span className="h-px w-10 bg-accent" />
            </div>
            <h2 className="font-serif text-[2.2rem] leading-[1.08] tracking-[-0.025em] md:text-[3rem] text-balance">
              La confianza no se pide. Se construye en cada decisión.
            </h2>
            <p className="mt-8 text-lg leading-relaxed text-foreground/75">
              En Cota Madrid entendemos la confianza como una consecuencia del
              trabajo bien hecho. Si estás pensando en reformar, empieza por lo
              que más vale: una conversación clara antes de tomar decisiones.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/diagnostico"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-mono text-[11px] uppercase tracking-[0.22em] text-accent-foreground transition-transform hover:-translate-y-0.5"
              >
                Empezar mi diagnóstico
                <ArrowRight className="size-3.5" />
              </Link>
              <Link
                href="/#agenda"
                className="inline-flex items-center gap-2 rounded-full border border-accent/40 px-6 py-3 font-mono text-[11px] uppercase tracking-[0.22em] text-accent transition-colors hover:bg-accent/10"
              >
                Reservar una sesión
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
