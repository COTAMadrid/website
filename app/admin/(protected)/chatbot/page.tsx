import { ChatbotConfigEditor } from './editor';
import { getConfig, isPersistenceEnabled } from '@/lib/chatbot/store';

export const dynamic = 'force-dynamic';

export default async function AdminChatbotPage() {
  const config = await getConfig();
  const persistence = isPersistenceEnabled();
  return (
    <div className="max-w-3xl mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Configuración del chatbot</h1>
        <p className="text-sm text-muted-foreground">
          System prompt, base de conocimiento y cadena de proveedores.
        </p>
      </header>
      {!persistence && (
        <div className="mb-6 rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800 px-4 py-3 text-sm text-amber-900 dark:text-amber-200">
          Persistencia desactivada — configura Vercel KV (KV_REST_API_URL y KV_REST_API_TOKEN) para
          guardar los cambios entre despliegues.
        </div>
      )}
      <ChatbotConfigEditor initial={config} />
    </div>
  );
}
