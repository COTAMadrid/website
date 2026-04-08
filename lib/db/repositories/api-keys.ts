import { sql, isDbConfigured } from '../client';
import { encryptSecret, decryptSecret, lastFour } from '@/lib/admin/secrets';
import type { ProviderId } from '@/config/api-keys-defaults';

export interface ApiKeyMeta {
  provider: string;
  last_4: string;
  updated_at: string | null;
  has_value: boolean;
}

export async function listKeys(): Promise<ApiKeyMeta[]> {
  if (!isDbConfigured()) {
    throw new Error('Base de datos no configurada (POSTGRES_URL)');
  }
  try {
    const { rows } = await sql`
      SELECT provider, last_4, updated_at FROM api_keys ORDER BY provider ASC
    `;
    return rows.map((r) => ({
      provider: String(r.provider),
      last_4: String(r.last_4 ?? '****'),
      updated_at:
        r.updated_at instanceof Date
          ? r.updated_at.toISOString()
          : r.updated_at
            ? String(r.updated_at)
            : null,
      has_value: true,
    }));
  } catch (err) {
    // Table may not exist yet — surface so the UI can ask to init DB.
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(`No se pudo leer api_keys: ${msg}`);
  }
}

export async function getKeyPlaintext(
  provider: ProviderId | string
): Promise<string | null> {
  if (!isDbConfigured()) return null;
  try {
    const { rows } = await sql`
      SELECT ciphertext, iv, tag FROM api_keys WHERE provider = ${provider} LIMIT 1
    `;
    if (rows.length === 0) return null;
    const r = rows[0];
    return decryptSecret(
      String(r.ciphertext),
      String(r.iv),
      String(r.tag)
    );
  } catch {
    // DB unreachable, table missing, or decryption failure — caller falls back to env var.
    return null;
  }
}

export async function setKey(
  provider: ProviderId | string,
  plaintext: string
): Promise<void> {
  if (!isDbConfigured()) {
    throw new Error('Base de datos no configurada (POSTGRES_URL)');
  }
  if (!plaintext || plaintext.trim().length < 8) {
    throw new Error('La API key parece demasiado corta');
  }
  const { ciphertext, iv, tag } = encryptSecret(plaintext);
  const l4 = lastFour(plaintext);
  await sql`
    INSERT INTO api_keys (provider, ciphertext, iv, tag, last_4, updated_at)
    VALUES (${provider}, ${ciphertext}, ${iv}, ${tag}, ${l4}, NOW())
    ON CONFLICT (provider) DO UPDATE SET
      ciphertext = EXCLUDED.ciphertext,
      iv = EXCLUDED.iv,
      tag = EXCLUDED.tag,
      last_4 = EXCLUDED.last_4,
      updated_at = NOW()
  `;
}

export async function deleteKey(
  provider: ProviderId | string
): Promise<void> {
  if (!isDbConfigured()) {
    throw new Error('Base de datos no configurada (POSTGRES_URL)');
  }
  await sql`DELETE FROM api_keys WHERE provider = ${provider}`;
}
