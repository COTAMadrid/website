import { LeadsTable } from './table';

export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <div className="max-w-6xl">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Leads recibidos</h1>
        <p className="text-sm text-muted-foreground">
          Solicitudes capturadas desde el formulario de diagnóstico
          (Google Sheets).
        </p>
      </header>
      <LeadsTable />
    </div>
  );
}
