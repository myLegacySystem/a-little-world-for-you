/**
 * The playlist. Only soft songs.
 *
 * To add a song: put the MP3 in /public/assets/music/ with the file name given
 * in `localPath` (or change the path), and it plays — no other changes. The
 * player consumes these objects through getSongUrl() in utils/assets.ts, so
 * moving the files to Supabase later needs no UI changes.
 *
 * A song whose file isn't there yet is skipped quietly. If none of PLAYLIST
 * can be played, the soft placeholder piano pieces play instead.
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
  SONG_01: { id: 'perfect', title: 'Perfect', artist: 'Ed Sheeran', localPath: '/assets/music/perfect.mp3' },
  SONG_02: {
    id: 'i-wanna-be-yours',
    title: 'I Wanna Be Yours',
    artist: 'Arctic Monkeys',
    localPath: '/assets/music/i-wanna-be-yours.mp3',
  },

  // Placeholder piano (see /public/assets/music/CREDITS.md). Used only while
  // the real songs above are missing; delete once they're in.
  PLACEHOLDER_01: { id: 'song-01', title: 'First Light', artist: 'Placeholder piano', localPath: '/assets/music/song-01.mp3' },
  PLACEHOLDER_02: { id: 'song-02', title: 'Deep Water', artist: 'Placeholder piano', localPath: '/assets/music/song-02.mp3' },
  PLACEHOLDER_03: { id: 'song-03', title: 'Warm Afternoon', artist: 'Placeholder piano', localPath: '/assets/music/song-03.mp3' },
  PLACEHOLDER_04: { id: 'song-04', title: 'One Star', artist: 'Placeholder piano', localPath: '/assets/music/song-04.mp3' },
} as const satisfies Record<string, Song>;

/** Play order. */
export const PLAYLIST: readonly Song[] = [SONGS.SONG_01, SONGS.SONG_02];

/** Plays only if nothing in PLAYLIST can be found. */
export const FALLBACK_PLAYLIST: readonly Song[] = [
  SONGS.PLACEHOLDER_01,
  SONGS.PLACEHOLDER_02,
  SONGS.PLACEHOLDER_03,
  SONGS.PLACEHOLDER_04,
];

/** Volume the music settles at (0–1). Soft by design. */
export const DEFAULT_VOLUME = 0.7;
