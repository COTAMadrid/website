export const SUPPORTED_PROVIDERS = [
  {
    id: 'openai',
    name: 'OpenAI',
    envVar: 'OPENAI_API_KEY',
    testModel: 'gpt-4o-mini',
    docsUrl: 'https://platform.openai.com/api-keys',
  },
  {
    id: 'claude',
    name: 'Anthropic Claude',
    envVar: 'ANTHROPIC_API_KEY',
    testModel: 'claude-sonnet-4-5',
    docsUrl: 'https://console.anthropic.com/',
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    envVar: 'GEMINI_API_KEY',
    testModel: 'gemini-2.0-flash',
    docsUrl: 'https://aistudio.google.com/apikey',
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    envVar: 'DEEPSEEK_API_KEY',
    testModel: 'deepseek-chat',
    docsUrl: 'https://platform.deepseek.com/',
  },
  {
    id: 'groq',
    name: 'Groq',
    envVar: 'GROQ_API_KEY',
    testModel: 'llama-3.3-70b-versatile',
    docsUrl: 'https://console.groq.com/keys',
  },
] as const;

export type ProviderId = (typeof SUPPORTED_PROVIDERS)[number]['id'];

export function getProviderMeta(id: string) {
  return SUPPORTED_PROVIDERS.find((p) => p.id === id);
}
