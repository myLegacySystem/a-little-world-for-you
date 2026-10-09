/**
 * Supabase, reached with plain fetch: the site only reads two small tables
 * and loads files by their public URL, so it needs no client library.
 *
 * Configured at build time by VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY
 * (.env.production for builds, .env.local to use Supabase in `npm run dev`).
 * The publishable (or legacy anon) key is meant for browsers; the secret or
 * service-role key never belongs here. Without both values the site uses /public.
 */

const PROJECT_URL = (import.meta.env.VITE_SUPABASE_URL ?? '').trim().replace(/\/+$/, '');
const KEY = (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? '').trim();

/** The public Storage bucket holding photos/ and songs/ (see supabase/setup.sql). */
export const BUCKET = 'birthday-assets';

export const supabaseEnabled = Boolean(PROJECT_URL && KEY);

/** Public URL of an object in the bucket, e.g. storageUrl('photos/photo-01.jpg'). */
export function storageUrl(path: string): string {
  // A full URL pasted from the dashboard works too.
  if (/^https?:\/\//.test(path)) return path;
  const clean = path
    .trim()
    .replace(/^\/+/, '')
    .replace(new RegExp(`^${BUCKET}/`), '');
  return `${PROJECT_URL}/storage/v1/object/public/${BUCKET}/${clean.split('/').map(encodeURIComponent).join('/')}`;
}

/** Rows from a table through the REST API; `query` is a PostgREST query string. */
export async function selectRows<T>(table: string, query: string, signal?: AbortSignal): Promise<T[]> {
  const headers: Record<string, string> = { apikey: KEY };
  // Legacy anon keys are JWTs and go in Authorization too; publishable keys (sb_publishable_…) don't.
  if (KEY.startsWith('eyJ')) headers.Authorization = `Bearer ${KEY}`;
  const res = await fetch(`${PROJECT_URL}/rest/v1/${table}?${query}`, { headers, signal });
  if (!res.ok) throw new Error(`${table}: ${res.status} ${await res.text()}`);
  return (await res.json()) as T[];
}
