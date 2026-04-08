import { isDbConfigured } from '@/lib/db/client';
import { ApiKeysEditor } from './editor';

export const dynamic = 'force-dynamic';

export default function Page() {
  const dbReady = isDbConfigured();
  const masterKeyReady = !!process.env.MASTER_ENCRYPTION_KEY;
  return (
    <div className="max-w-4xl">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">API Keys</h1>
        <p className="text-sm text-muted-foreground">
          Gestiona las claves de acceso a los proveedores de IA del chatbot.
        </p>
      </header>

      <div className="mb-6 rounded-lg border border-blue-300 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-800 px-4 py-3 text-sm text-blue-900 dark:text-blue-200">
        Las API keys se guardan encriptadas (AES-256-GCM) en la base de datos.
        Nunca se muestran de vuelta: solo se conservan los últimos 4 caracteres
        para identificarlas. Si pierdes una, debes reintroducirla.
      </div>

      {!dbReady && (
        <div className="mb-6 rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800 px-4 py-3 text-sm text-amber-900 dark:text-amber-200">
          Base de datos no configurada — define <code className="font-mono">POSTGRES_URL</code>.
        </div>
      )}

      {!masterKeyReady && (
        <div className="mb-6 rounded-lg border border-red-300 bg-red-50 dark:bg-red-950/30 dark:border-red-800 px-4 py-3 text-sm text-red-900 dark:text-red-200">
          Falta <code className="font-mono">MASTER_ENCRYPTION_KEY</code> (64
          caracteres hex). Hasta configurarla, no se pueden guardar nuevas
          claves.
        </div>
      )}

      <ApiKeysEditor />
    </div>
  );
}
