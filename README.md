# A Little World For You

An interactive birthday experience: a small, living world that starts muted and colorless and slowly fills with color, light, music and a few carefully placed words.

Built with React, TypeScript, Vite and Three.js. Open → scroll → experience.

## Getting started

Requires Node.js 18+.

```bash
npm install
npm run dev       # start the dev server
npm run build     # type-check and build to dist/
npm run preview   # serve the production build
npm run lint      # run ESLint
```

## Deploying to GitHub Pages

The site must be **built** before it's served. Serving the repository files directly shows a blank page, because `index.html` points at the unbuilt `src/main.tsx`.

`.github/workflows/deploy.yml` builds the site and publishes `dist/` on every push to `main`. One-time setup:

1. In the repository on GitHub, open **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **GitHub Actions** (not "Deploy from a branch").
3. Push to `main`, or run the workflow by hand from the **Actions** tab.

The workflow sets `BASE_PATH=/<repo-name>/` so every asset URL works under `https://<user>.github.io/<repo-name>/`. Other hosts that serve from `/` need no setting.

## The journey

One continuous, scroll-driven story. Each scene is a tall section with a pinned stage; one WebGL canvas sits behind all of them and eases between moods as you scroll.

| # | Scene | World |
|---|-------|-------|
| 1 | **Intro**: "There was a time…" (the first lines arrive on their own) | Grey, near-monochrome dust |
| 2 | **Color**: the first photo, "You brought color…" | Color spreads like ink from one small light |
| 3 | **Ocean**: her eyes open like an iris and you fall into the sea | Deep blue water, light rays, caustics, rising motes |
| 4 | **Quote**: Natalie Newman, stanza by stanza, then the afterword | Stars reflected on water during "the sparkle in her eyes" |
| 5 | **Soul**: "It's your soul." | Warm cream, peach and gold light, golden dust |
| 6 | **Wishes**: five wishes, five stars, a constellation | Night sky |
| 7 | **Personal**: one star remains | Quiet night, most stars step back |
| 8 | **Birthday**: final photo, "Happy Birthday" | Everything together; stays alive at the end |

## Project structure

```text
public/assets/
  images/               photo-01.jpg … photo-05.jpg (placeholders)
  music/                song-01.mp3 … song-04.mp3 (placeholders, see CREDITS.md)
src/
  App.tsx               Scene order
  data/
    content.ts          ALL words, her name, birthday, quote, wishes, which photo goes where
    playlist.ts         Songs (title, artist, file) and default volume
  lib/
    assets.ts           getImageUrl() / getSongUrl(): the only place asset URLs are built
    world.ts            Mood keyframes along the journey (color, ocean, warm, night…)
    scroll.ts           Scroll director: per-scene progress + journey position
    device.ts           Reduced motion / low-power detection
  components/
    scenes/             IntroScene, ColorScene, OceanScene, QuoteScene, SoulScene,
                        WishesScene, PersonalScene, BirthdayScene (+ Scene wrapper)
    effects/            World (renderer), Atmosphere (background shader), Ocean (water GLSL),
                        ParticleField, StarField
    audio/              audioEngine (streaming + fades), MusicPlayer, Playlist
    ui/                 SceneText/Reveal, Photo, ProgressIndicator, Heart
  styles/global.css
```

## Replacing the placeholders

**Her name and birthday:** `src/data/content.ts` → `person.name`, `person.birthday`. All wording lives in the same file.

**Photos:** drop the real photos into `public/assets/images/` with the same names (`photo-01.jpg` … `photo-05.jpg`), or change the `file` values in `photos` in `content.ts`. Which photo appears where:

| Key | File | Where it appears | Best kind of photo |
|-----|------|------------------|--------------------|
| `arrival` | photo-01 | The moment color arrives | Any photo you love |
| `eyes` | photo-02 | Fills the screen and opens into the sea | A close portrait, eyes near the center |
| `thought` | photo-04 | "And when I read this, I thought of you." | Candid or thoughtful |
| `soul` | photo-03 | The warm scene | Warm, sunlit, laughing |
| `finale` | photo-05 | Stays with the birthday message | The one you want her to see last |

Portrait orientation (4:5) works best. Resize to about 1200px on the long edge and compress (e.g. JPEG quality 75–80, or WebP). Photos are faded in with soft edges, so no cropping is needed.

**Songs:** put the real songs in `public/assets/music/` as `song-01.mp3` …, and update titles and artists in `src/data/playlist.ts`. You can add or remove entries freely. Songs stream one at a time; nothing loads until the music starts.

## Music behaviour

Browsers only allow sound after a gesture, so a faint "tap anywhere for music" hint appears; the first tap or key press starts the playlist with a slow fade-in. The small pill in the corner opens play/pause, previous/next, a seek bar, volume and the playlist. Songs cross-fade and the music keeps playing through every scene.

## Accessibility and performance

- `prefers-reduced-motion`: text fades without drifting, floating and parallax stop, and the world moves very slowly.
- Phones and low-power devices get fewer particles and a lower pixel ratio. All particle motion runs on the GPU.
- Rendering pauses while the tab is hidden, and WebGL resources are disposed on unmount. Without WebGL, a CSS gradient that follows the journey is used instead.
- Photos load only when their scene approaches. Audio is `preload="none"`.
- Only the Latin subsets of the two fonts (Cormorant Garamond and Jost) are bundled.

## Moving assets to Supabase later

Components never build asset URLs directly; they go through `getImageUrl` and `getSongUrl` in `src/lib/assets.ts`. To switch to Supabase Storage, only that file needs to change (see [supabase.md](supabase.md)):

1. Upload the files to the `birthday-assets` bucket (`photos/`, `songs/`).
2. Add `VITE_SUPABASE_URL` (and `VITE_SUPABASE_ANON_KEY` if you use signed URLs) to `.env.local`.
3. Make `getImageUrl` / `getSongUrl` return `${VITE_SUPABASE_URL}/storage/v1/object/public/birthday-assets/photos/${file}` (or signed URLs).
4. Optionally load the photo and song lists from the `photos` / `songs` tables instead of `content.ts` / `playlist.ts`.

The audio element already sets `crossOrigin="anonymous"`, which Supabase Storage supports.

## Environment variables

None are needed yet. When Supabase is added, create a `.env.local` (already git-ignored):

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Never commit `.env` files or the Supabase service-role key.
