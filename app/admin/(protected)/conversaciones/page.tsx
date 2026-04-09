import { ConversacionesClient } from './client';

export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <div className="max-w-7xl">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Conversaciones con Lucia</h1>
        <p className="text-sm text-muted-foreground">
          Historial de chats del asesor virtual. Click en una fila para ver
          el hilo completo.
        </p>
      </header>
      <ConversacionesClient />
    </div>
  );
}
