import type { ChatbotConfig } from './types';
import { DEFAULT_CONFIG } from '@/config/chatbot/defaults';

const KV_KEY = 'cota:chatbot:config';

let inMemoryConfig: ChatbotConfig | null = null;

function kvAvailable(): boolean {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

export function isPersistenceEnabled(): boolean {
  return kvAvailable();
}

async function getKv() {
  try {
    const mod = await import('@vercel/kv');
    return mod.kv;
  } catch {
    return null;
  }
}

export async function getConfig(): Promise<ChatbotConfig> {
  if (kvAvailable()) {
    try {
      const kv = await getKv();
      if (kv) {
        const stored = (await kv.get<ChatbotConfig>(KV_KEY)) ?? null;
        if (stored) return mergeWithDefaults(stored);
      }
    } catch (err) {
      console.warn('[chatbot/store] KV read failed, using defaults/in-memory', err);
    }
  }
  return inMemoryConfig ?? DEFAULT_CONFIG;
}

export async function setConfig(c: ChatbotConfig): Promise<{ persisted: boolean }> {
  const merged = mergeWithDefaults(c);
  if (kvAvailable()) {
    try {
      const kv = await getKv();
      if (kv) {
        await kv.set(KV_KEY, merged);
        inMemoryConfig = merged;
        return { persisted: true };
      }
    } catch (err) {
      console.warn('[chatbot/store] KV write failed, falling back to in-memory', err);
    }
  }
  inMemoryConfig = merged;
  console.warn('[chatbot/store] Persistence disabled — config stored in memory only.');
  return { persisted: false };
}

function mergeWithDefaults(c: Partial<ChatbotConfig>): ChatbotConfig {
  return {
    systemPrompt: c.systemPrompt ?? DEFAULT_CONFIG.systemPrompt,
    knowledge: c.knowledge ?? DEFAULT_CONFIG.knowledge,
    providers: c.providers ?? DEFAULT_CONFIG.providers,
  };
}
