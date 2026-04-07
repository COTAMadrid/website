import type { ProviderAdapter } from '../types';

export const claudeAdapter: ProviderAdapter = {
  id: 'claude',
  async call({ model, apiKey, system, messages, signal }) {
    const userAssistant = messages
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .map((m) => ({ role: m.role, content: m.content }));
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      signal,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model,
        max_tokens: 1024,
        system,
        messages: userAssistant,
        temperature: 0.4,
      }),
    });
    if (!res.ok) throw new Error(`Claude ${res.status}: ${await res.text()}`);
    const data = await res.json();
    const text = data?.content?.[0]?.text;
    if (!text) throw new Error('Claude: empty response');
    return text;
  },
};
