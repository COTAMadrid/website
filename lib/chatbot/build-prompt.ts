import type { ChatbotConfig } from './types';

export function buildSystemPrompt(config: ChatbotConfig): string {
  const kb = config.knowledge
    .map((k, i) => `${i + 1}. ${k.topic}\n${k.content}`)
    .join('\n\n');
  return `${config.systemPrompt}\n\n# Base de conocimiento\n\n${kb}`;
}
