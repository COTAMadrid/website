import { DbInitButton } from './init-button';
import { isDbConfigured } from '@/lib/db/client';

export const dynamic = 'force-dynamic';

export default function Page() {
  const dbReady = isDbConfigured();
  return (
    <div className="max-w-2xl">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Base de datos</h1>
        <p className="text-sm text-muted-foreground">
          Inicializa el esquema de tablas en Vercel Postgres. Operación
          idempotente: puede ejecutarse varias veces sin riesgo.
        </p>
      </header>
      {!dbReady ? (
        <div className="rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800 px-4 py-3 text-sm text-amber-900 dark:text-amber-200">
          Define <code className="font-mono">POSTGRES_URL</code> en tu entorno
          antes de inicializar el esquema.
        </div>
      ) : (
        <DbInitButton />
      )}
    </div>
  );
}
