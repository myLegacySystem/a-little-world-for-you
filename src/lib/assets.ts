/**
 * Asset URL resolution.
 *
 * Components never build asset URLs themselves — they always go through
 * these two functions. Today they point at /public/assets. When moving to
 * Supabase Storage, change only this file (see supabase.md), e.g.:
 *
 *   const base = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/birthday-assets`;
 *   return `${base}/photos/${photo.file}`;
 */

import type { PhotoRef } from '../data/content';
import type { Song } from '../data/playlist';

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

export function getImageUrl(photo: Pick<PhotoRef, 'file'>): string {
  return `${BASE}/assets/images/${photo.file}`;
}

export function getSongUrl(song: Pick<Song, 'file'>): string {
  return `${BASE}/assets/music/${song.file}`;
}
