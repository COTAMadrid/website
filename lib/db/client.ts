import { sql } from '@vercel/postgres';

export { sql };

export function isDbConfigured(): boolean {
  return !!(
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.DATABASE_URL
  );
}
