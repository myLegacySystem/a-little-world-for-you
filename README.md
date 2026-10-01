# A Little World For You

A private birthday experience: a small world that begins pale and colorless, fills with watercolor, forms a soft pink glass heart, dissolves into the sea, rises into stars, warms into dawn, and comes together again for her birthday. Words, photographs and music carry the rest.

Built with React, TypeScript, Vite and Three.js. Open → Enter → scroll.

See **[progress.md](progress.md)** for the full picture: the scene-by-scene journey, architecture, decisions, and what's left.

## Getting started

Requires Node.js 18+.

```bash
npm install
npm run dev        # start the dev server
npm run build      # typecheck and build to dist/
npm run preview    # serve the production build
npm run typecheck
npm run lint
```

## Changing the content

| What | Where |
|------|-------|
| Every word on the page (including "Happy Birthday" and the names that flip after it) | `src/content/text.ts` |
| Photos (5) | `public/assets/images/photo-01.jpg` … `photo-05.jpg`, described in `src/content/photos.ts` |
| Songs | `public/assets/music/perfect.mp3`, `i-wanna-be-yours.mp3` (titles and order in `src/content/songs.ts`; placeholder piano plays until they're added) |
| When each line appears | the scene files in `src/scenes/` (`at` / `out`) |
| How the world looks along the way | `src/three/timeline.ts` |
| Scene order and length | `src/scenes/config.ts` |

In `text.ts`, `\n` makes a designed line break, `*words*` are set in italics, and a trailing 🩷 is drawn as a small soft pink heart.

Components never build file paths themselves. They call `getPhotoUrl` / `getSongUrl` in `src/utils/assets.ts`, which is the only file to change when the assets move to Supabase Storage (see [supabase.md](supabase.md)).

## Deploying to GitHub Pages

The site must be **built** before it's served. Serving the repository files directly shows a blank page, because `index.html` points at the unbuilt `src/main.tsx`.

`.github/workflows/deploy.yml` builds the site and publishes `dist/` on every push to `main`. One-time setup:

1. In the repository on GitHub, open **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **GitHub Actions** (not "Deploy from a branch").
3. Push to `main`, or run the workflow by hand from the **Actions** tab.

The workflow sets `BASE_PATH=/<repo-name>/` so every asset URL works under `https://<user>.github.io/<repo-name>/`. Other hosts that serve from `/` need no setting.

## Environment variables

None are needed yet. When Supabase is added, create a `.env.local` (already git-ignored):

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Never commit `.env` files or the Supabase service-role key.
