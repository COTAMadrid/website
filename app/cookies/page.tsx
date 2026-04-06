export const metadata = { title: 'Política de cookies — Cota' };

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="text-4xl mb-8">Política de cookies</h1>
      <div className="prose prose-invert max-w-none text-muted-foreground">
        <p className="text-warning">
          ⚠️ Pendiente de revisión legal antes de lanzamiento público.
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
