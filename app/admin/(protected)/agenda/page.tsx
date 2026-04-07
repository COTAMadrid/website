import { getAgendaAvailability } from '@/lib/db/repositories/agenda';
import { isDbConfigured } from '@/lib/db/client';
import { AgendaEditor } from './editor';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const availability = await getAgendaAvailability();
  const dbReady = isDbConfigured();
  return (
    <div className="max-w-3xl">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Disponibilidad de la agenda</h1>
        <p className="text-sm text-muted-foreground">
          Franjas horarias, fechas bloqueadas y días de la semana no
          disponibles.
        </p>
      </header>
      {!dbReady && (
        <div className="mb-6 rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800 px-4 py-3 text-sm text-amber-900 dark:text-amber-200">
          Base de datos no configurada — los cambios no se podrán guardar
          hasta definir <code className="font-mono">POSTGRES_URL</code>.
        </div>
      )}
      <AgendaEditor initial={availability} />
    </div>
  );
}
