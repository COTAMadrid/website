export type ProviderId = 'openai' | 'claude' | 'gemini' | 'deepseek' | 'groq';

export interface Provider {
  id: ProviderId;
  name: string;
  model: string;
  enabled: boolean;
  apiKeyEnv: string;
}

export interface KnowledgeEntry {
  topic: string;
  content: string;
}

export interface ChatbotConfig {
  systemPrompt: string;
  knowledge: KnowledgeEntry[];
  providers: Provider[];
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
}

export interface ChatResponse {
  reply: string;
  providerUsed: string;
}

export interface ProviderAdapter {
  id: ProviderId;
  call(args: {
    model: string;
    apiKey: string;
    system: string;
    messages: ChatMessage[];
    signal: AbortSignal;
  }): Promise<string>;
}
