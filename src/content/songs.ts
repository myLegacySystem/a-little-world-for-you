/**
 * The playlist. Only soft songs.
 *
 * Replace the files in /public/assets/music/ (or change `localPath`) and the
 * titles below. The player consumes these objects through getSongUrl() in
 * utils/assets.ts, so moving the files to Supabase later needs no UI changes.
 */

export interface Song {
  /** Stable identifier (also the Supabase object name later). */
  id: string;
  title: string;
  artist?: string;
  /** Path under /public. */
  localPath: string;
}

export const SONGS = {
  SONG_01: { id: 'song-01', title: 'First Light', artist: 'Placeholder piano', localPath: '/assets/music/song-01.mp3' },
  SONG_02: { id: 'song-02', title: 'Deep Water', artist: 'Placeholder piano', localPath: '/assets/music/song-02.mp3' },
  SONG_03: { id: 'song-03', title: 'Warm Afternoon', artist: 'Placeholder piano', localPath: '/assets/music/song-03.mp3' },
  SONG_04: { id: 'song-04', title: 'One Star', artist: 'Placeholder piano', localPath: '/assets/music/song-04.mp3' },
} as const satisfies Record<string, Song>;

/** Play order. */
export const PLAYLIST: readonly Song[] = [SONGS.SONG_01, SONGS.SONG_02, SONGS.SONG_03, SONGS.SONG_04];

/** Volume the music settles at (0–1). Soft by design. */
export const DEFAULT_VOLUME = 0.7;
