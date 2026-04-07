import type { ChatMessage, ChatbotConfig } from './types';
import { PROVIDER_ADAPTERS } from './providers';
import { buildSystemPrompt } from './build-prompt';

const TIMEOUT_MS = 12_000;

export interface ChainResult {
  reply: string;
  providerUsed: string;
}

export async function runChain(
  messages: ChatMessage[],
  config: ChatbotConfig
): Promise<ChainResult> {
  const system = buildSystemPrompt(config);
  const errors: string[] = [];

  for (const provider of config.providers) {
    if (!provider.enabled) continue;
    const apiKey = process.env[provider.apiKeyEnv];
    if (!apiKey) {
      errors.push(`${provider.id}: missing ${provider.apiKeyEnv}`);
      continue;
    }
    const adapter = PROVIDER_ADAPTERS[provider.id];
    if (!adapter) {
      errors.push(`${provider.id}: no adapter`);
      continue;
    }
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const reply = await adapter.call({
        model: provider.model,
        apiKey,
        system,
        messages,
        signal: controller.signal,
      });
      clearTimeout(timer);
      return { reply, providerUsed: provider.id };
    } catch (err) {
      clearTimeout(timer);
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(`${provider.id}: ${msg}`);
      // try next
    }
  }

  throw new Error(
    `Todos los proveedores fallaron o no están configurados. ${errors.join(' | ')}`
  );
}
