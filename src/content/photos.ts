/**
 * The photographs. Only five — each one has a place in the story.
 *
 * With Supabase configured, each place shows the file named by the `photos`
 * row whose sort_order is its number (1 = PHOTO_01 … 5 = PHOTO_05); see
 * supabase.md. Places without a row use `localPath`. Components never read
 * either directly; they go through getPhotoUrl() in utils/assets.ts.
 */

import { TEXT } from './text';

export interface Photo {
  /** Stable identifier. */
  id: string;
  /** Path under /public. */
  localPath: string;
  alt: string;
  /** Which part of the photo to keep when cropped (CSS object-position). */
  focus?: string;
  /** Where it appears — documentation only. */
  role?: string;
}

export const PHOTOS = {
  PHOTO_01: {
    id: 'photo-01',
    localPath: '/assets/images/photo-01.jpg',
    alt: TEXT.PHOTO_01_ALT,
    focus: '50% 40%',
    role: 'Memories — the larger print, just after color arrives.',
  },
  PHOTO_02: {
    id: 'photo-02',
    localPath: '/assets/images/photo-02.jpg',
    alt: TEXT.PHOTO_02_ALT,
    focus: '50% 40%',
    role: 'Memories — the smaller print beside it.',
  },
  PHOTO_03: {
    id: 'photo-03',
    localPath: '/assets/images/photo-03.jpg',
    alt: TEXT.PHOTO_03_ALT,
    focus: '50% 38%',
    role: 'Her eyes — a wide cinematic crop that pulls you into the sea. A close portrait works best.',
  },
  PHOTO_04: {
    id: 'photo-04',
    localPath: '/assets/images/photo-04.jpg',
    alt: TEXT.PHOTO_04_ALT,
    focus: '50% 35%',
    role: 'Her soul — warm light and petals. Something candid and sunlit.',
  },
  PHOTO_05: {
    id: 'photo-05',
    localPath: '/assets/images/photo-05.jpg',
    alt: TEXT.PHOTO_05_ALT,
    focus: '50% 40%',
    role: 'The birthday — stays on screen at the very end, with the heart.',
  },
} as const satisfies Record<string, Photo>;
