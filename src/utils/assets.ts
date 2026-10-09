/**
 * Asset URL resolution — the only place that knows where files live.
 *
 * Without Supabase configured: files in /public (served under the site's base path).
 *
 * With Supabase (see supabase.md), loadAssets() reads two tables before the
 * first render:
 *   photos — `sort_order` is the photo's place in the story (`place` in
 *            content/photos.ts) and `file_path` its object in the bucket.
 *   songs  — the playlist, in `sort_order`.
 * Only `active` rows count. A place with no row, or a table that can't be
 * read, falls back to the local files, so the site always works.
 */

import { PHOTOS, type Photo } from '../content/photos';
import { PLAYLIST, type Song } from '../content/songs';
import { selectRows, storageUrl, supabaseEnabled } from './supabase';

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

const local = (path: string) => `${BASE}/${path.replace(/^\//, '')}`;

/** How long the first render waits for Supabase before using the local files. */
const TIMEOUT_MS = 5000;

interface PhotoRow {
  file_path: string;
  sort_order: number;
}

interface SongRow {
  title: string;
  artist: string | null;
  file_path: string;
}

/** Photo id → Storage URL, for the places the photos table fills. */
const storedPhotos = new Map<string, string>();
/** The playlist from the songs table, when it has any songs. */
let storedPlaylist: readonly Song[] | null = null;

export async function loadAssets(): Promise<void> {
  if (!supabaseEnabled) return;
  const abort = new AbortController();
  const timer = window.setTimeout(() => abort.abort(), TIMEOUT_MS);
  const [photos, songs] = await Promise.allSettled([
    // Newest first, so a newer row for the same place wins.
    selectRows<PhotoRow>('photos', 'select=file_path,sort_order&active=eq.true&order=sort_order,id.desc', abort.signal),
    selectRows<SongRow>('songs', 'select=title,artist,file_path&active=eq.true&order=sort_order,id', abort.signal),
  ]);
  window.clearTimeout(timer);

  if (photos.status === 'fulfilled') {
    const places: readonly Photo[] = Object.values(PHOTOS);
    for (const row of photos.value) {
      const photo = places.find((p) => p.place === row.sort_order);
      if (photo && row.file_path && !storedPhotos.has(photo.id)) storedPhotos.set(photo.id, storageUrl(row.file_path));
    }
  } else {
    console.warn('Supabase photos unavailable; using the local photos.', photos.reason);
  }

  if (songs.status === 'fulfilled') {
    const list = songs.value.filter((row) => row.file_path);
    if (list.length) {
      storedPlaylist = list.map((row) => ({
        id: row.file_path,
        title: row.title,
        artist: row.artist ?? undefined,
        storagePath: row.file_path,
      }));
    }
  } else {
    console.warn('Supabase songs unavailable; using the local playlist.', songs.reason);
  }
}

export function getPhotoUrl(photo: Pick<Photo, 'id' | 'localPath'>): string {
  return storedPhotos.get(photo.id) ?? local(photo.localPath);
}

export function getSongUrl(song: Song): string {
  return 'storagePath' in song ? storageUrl(song.storagePath) : local(song.localPath);
}

/** Play order: the songs table if it has songs, otherwise PLAYLIST. */
export function getPlaylist(): readonly Song[] {
  return storedPlaylist ?? PLAYLIST;
}
