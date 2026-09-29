/**
 * The playlist. Only soft songs.
 *
 * `file` is resolved through getSongUrl() — a local path today,
 * a Supabase Storage URL later. Titles here are placeholders.
 */

export interface Song {
  id: string;
  title: string;
  artist?: string;
  file: string;
}

export const playlist: Song[] = [
  { id: 'song-01', title: 'First Light', artist: 'Placeholder piano', file: 'song-01.mp3' },
  { id: 'song-02', title: 'Deep Water', artist: 'Placeholder piano', file: 'song-02.mp3' },
  { id: 'song-03', title: 'Warm Afternoon', artist: 'Placeholder piano', file: 'song-03.mp3' },
  { id: 'song-04', title: 'One Star', artist: 'Placeholder piano', file: 'song-04.mp3' },
];

/** Master volume the music settles at (0–1). Soft by design. */
export const defaultVolume = 0.6;
