# A Little World For You

An interactive birthday experience: a small, living world that starts muted and colorless and slowly fills with color, light, music and a few carefully placed words.

Built with React, TypeScript, Vite and Three.js.

> **Status:** work in progress. The data layer, asset helpers and placeholder assets are in place; the scenes, components and styles are still being built.

## Getting started

Requires Node.js 18+.

```bash
npm install
npm run dev       # start the dev server
npm run build     # type-check and build to dist/
npm run preview   # serve the production build
npm run lint      # run ESLint
```

## Project structure

```text
index.html            Entry HTML (mounts src/main.tsx)
public/assets/
  images/             Placeholder photos (photo-01.jpg ... photo-05.jpg)
  music/              Placeholder songs (song-01.mp3 ... song-04.mp3)
src/
  components/         audio/, effects/, scenes/, ui/
  data/
    content.ts        Text content and photo references
    playlist.ts       Song list
  lib/
    assets.ts         getImageUrl() / getSongUrl(): the only place asset URLs are built
  styles/
sd.md                 Creative and build brief
supabase.md           Plan for moving assets to Supabase Storage later
```

## Assets

Components never build asset URLs directly; they go through `getImageUrl` and `getSongUrl` in `src/lib/assets.ts`. Right now these point at `public/assets`. To switch to Supabase Storage later, only that file needs to change (see [supabase.md](supabase.md)).

## Environment variables

None are needed yet. When Supabase is added, create a `.env.local` (already git-ignored) with:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Never commit `.env` files or the Supabase service-role key.
