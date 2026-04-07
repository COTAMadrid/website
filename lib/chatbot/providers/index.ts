import type { ProviderAdapter, ProviderId } from '../types';
import { openaiAdapter } from './openai';
import { claudeAdapter } from './claude';
import { geminiAdapter } from './gemini';
import { deepseekAdapter } from './deepseek';
import { groqAdapter } from './groq';

export const PROVIDER_ADAPTERS: Record<ProviderId, ProviderAdapter> = {
  openai: openaiAdapter,
  claude: claudeAdapter,
  gemini: geminiAdapter,
  deepseek: deepseekAdapter,
  groq: groqAdapter,
};
