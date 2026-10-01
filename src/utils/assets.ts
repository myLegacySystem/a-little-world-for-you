/**
 * Asset URL resolution — the only place that knows where files live.
 *
 * Today: files in /public (served under the site's base path).
 * Later (Supabase Storage), change only these two functions, e.g.:
 *
 *   const STORAGE = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/birthday-assets`;
 *   export const getPhotoUrl = (photo: Photo) => `${STORAGE}/photos/${photo.id}.jpg`;
 *   export const getSongUrl  = (song: Song)   => `${STORAGE}/songs/${song.id}.mp3`;
 */

import type { Photo } from '../content/photos';
import type { Song } from '../content/songs';

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

const local = (path: string) => `${BASE}/${path.replace(/^\//, '')}`;

export function getPhotoUrl(photo: Pick<Photo, 'localPath'>): string {
  return local(photo.localPath);
}

export function getSongUrl(song: Pick<Song, 'localPath'>): string {
  return local(song.localPath);
}
