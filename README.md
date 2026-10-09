# A Little World For You

A private birthday experience: a small world that begins pale and colorless, fills with watercolor, forms a soft pink glass heart, dissolves into the sea, rises into stars, warms into dawn, and comes together again for her birthday. Words, photographs and music carry the rest.

Built with React, TypeScript, Vite and Three.js. Open → Enter → the story plays by itself, stopping on every line long enough to read it (pause, previous and next sit at the bottom; scrolling by hand works too).

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
| Photos (4) | Supabase Storage + the `photos` table (see [supabase.md](supabase.md)); placeholders in `public/assets/images/`, places described in `src/content/photos.ts` |
| Songs | Supabase Storage + the `songs` table (see [supabase.md](supabase.md)); without it, `PLAYLIST` in `src/content/songs.ts` and `public/assets/music/` (placeholder piano plays when nothing else can) |
| When each line appears | the scene files in `src/scenes/` (`at` / `out`) |
| How long autoplay stays on each line, and how fast it moves | the pacing numbers at the top of `src/utils/autoplay.ts` |
| Where autoplay pauses with no words (the heart forming, photos arriving…) | the `<Beat at seconds>` lines in the scene files |
| How the world looks along the way | `src/three/timeline.ts` |
| Scene order and length | `src/scenes/config.ts` |

In `text.ts`, `\n` makes a designed line break, `*words*` are set in italics, and a trailing 🩷 is drawn as a small soft pink heart.

Components never build file paths themselves. They call `getPhotoUrl` / `getSongUrl` in `src/utils/assets.ts`, the only place that knows whether a file comes from Supabase or from `public/`.

## Deploying to GitHub Pages

The site must be **built** before it's served. Serving the repository files directly shows a blank page, because `index.html` points at the unbuilt `src/main.tsx`.

`.github/workflows/deploy.yml` builds the site and publishes `dist/` on every push to `main`. One-time setup:

1. In the repository on GitHub, open **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **GitHub Actions** (not "Deploy from a branch").
3. Push to `main`, or run the workflow by hand from the **Actions** tab.

The workflow sets `BASE_PATH=/<repo-name>/` so every asset URL works under `https://<user>.github.io/<repo-name>/`. Other hosts that serve from `/` need no setting.

## Going live

Photos and songs come from Supabase. The whole checklist (SQL to run, where to upload, how to check) is in **[supabase.md](supabase.md)**.

## Environment variables

| Name | Value |
|------|-------|
| `VITE_SUPABASE_URL` | Supabase Project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable / anon key |

Both are public by design and committed in `.env.production`, which every build (including GitHub Pages) reads. `npm run dev` doesn't read it and uses the placeholders in `public/`; to develop against Supabase, put the same two lines in `.env.local` (git-ignored). Without them the site uses the files in `public/`.

Never put the Supabase secret / service-role key in this repository or the site.
