# Progress — A little world, made for you

_Last updated: first polished iteration of the pastel redesign._

## Status

A complete, working first version. The whole experience scrolls from the threshold to the final birthday scene on desktop and phone, with music, the 3D heart and all transformations in place. Build, typecheck and lint pass; no browser console errors in desktop, mobile or reduced-motion runs.

Placeholder photos and songs are in use. Real ones can be dropped in without touching code (see below).

## The journey

| # | Scene (`src/scenes/`) | What happens in the world (`src/three/timeline.ts`) |
|---|---|---|
| – | Threshold (`components/IntroGate.tsx`) | Pale, nearly colorless paper. "A little world, made for you." → Enter starts the music. |
| 1 | `OpeningScene` | Grey dust drifting. The quiet lines arrive on their own. At "And then you came into my life." the dust starts to gather. |
| 2 | `ColorScene` | **Wow 1:** watercolor blooms out of the heart, one hue at a time: baby blue → blush → lavender → buttercream → mint → warm light. **Wow 2:** the particles gather into the heart, gain color, and the pink glass heart emerges. |
| 3 | `MemoriesScene` | Two photos set down like prints; the heart rests beside them. |
| 4 | `EyesScene` | **Wow 3:** the heart dissolves; its particles swirl out and become the sea, which rises over everything. Her eyes surface in the water, and the camera is pulled in through them. Music becomes softly muffled underwater. |
| 5 | `FallScene` | Deeper and calmer; particles rise past as we sink. |
| 6 | `QuoteScene` | Natalie Newman's quote in deep water (stars reflected on it at "the sparkle in her eyes"), then the afterword. **Wow 4:** the particles rise and become stars as the sea darkens into a twilight sky. |
| 7 | `DreamsScene` | Night sky; each wish lights a star in a small constellation. |
| 8 | `SoulScene` | Dawn: cream, buttercream sun, blush; petals drift; a hand-drawn sprig draws itself. |
| 9 | `PersonalScene` | The quietest moment: pale lavender morning. At "close to my heart too" the particles begin to gather again. |
| 10 | `BirthdayScene` | **Wow 5:** the heart reforms, larger and clearer than before, beside the final photograph, among every color of the story. It stays: the page ends here and the world keeps breathing. |

## Project structure

```text
src/
  content/
    text.ts        Every user-facing string (TEXT.*). The only place to change wording.
    photos.ts      PHOTOS.PHOTO_01…05 — id, localPath, alt, focus, role
    songs.ts       SONGS.SONG_01…04, PLAYLIST, DEFAULT_VOLUME
  scenes/
    config.ts      Scene order + lengths (screen heights). Single source for scroll + world.
    Scene.tsx      Tall section + sticky stage; provides scene progress (0→1)
    *Scene.tsx     The ten scenes (layout + when each line appears)
  three/
    World.tsx      The one WebGL canvas: renderer, loop, easing, heart placement, cleanup
    timeline.ts    The mood of the world along the journey (keyframes, carry-forward)
    Atmosphere.ts  Full-screen background shader: paper, watercolor, sea, twilight, dawn, finale
    ocean.ts       Ocean GLSL (rays, caustics, glints, twinkles)
    Particles.ts   The story particles: ambient ↔ heart ↔ sea ↔ stars, all on the GPU
    Heart.ts       Glass heart (2-pass translucent shader), inner glow, orbiting sparkles
    heartShape.ts  One implicit heart shape shared by the mesh and the particles
    Petals.ts      Instanced drifting petals
    noise.ts       Shared GLSL noise
  components/      IntroGate, Reveal, Words, Photo, HeartAnchor, Botanical, MusicControl, Thread, InlineHeart
  audio/
    audioEngine.ts Streaming playback, fades, underwater low-pass, quiet dip, soft level
  hooks/           useEntered, useMediaQuery
  utils/           assets (resolvers), scroll (director), heartAnchor, device, experience, math
  styles/global.css
public/assets/
  images/          photo-01.jpg … photo-05.jpg (placeholders)
  music/           song-01.mp3 … song-04.mp3 (placeholder piano, see CREDITS.md)
```

## Commands

```bash
npm install
npm run dev        # develop
npm run build      # typecheck + production build → dist/
npm run preview    # serve the build
npm run typecheck
npm run lint
```

Deploys to GitHub Pages via `.github/workflows/deploy.yml` on every push to `main` (Pages source must be "GitHub Actions").

Add `?debug` to the URL to expose the live world state as `window.__world` in the console.

## How content is organized

- **Text:** `src/content/text.ts` holds every visible string, as a typed `as const` object. Change `TEXT.BIRTHDAY_TITLE` and the title changes everywhere; no other file needs editing. Formatting conventions inside strings: `\n` = a designed line break, `*words*` = italics, a trailing `🩷` is drawn as a small soft pink heart. The page `<title>` and `<noscript>` message are injected into `index.html` at build time from `TEXT.PAGE_TITLE` and `TEXT.NO_JAVASCRIPT`. Empty strings hide a line (e.g. `BIRTHDAY_EYEBROW`).
- **Photos:** `src/content/photos.ts`. Components only ever call `getPhotoUrl(photo)` (`src/utils/assets.ts`). Alt text comes from `TEXT.PHOTO_0X_ALT`.
- **Songs:** `src/content/songs.ts`. The audio engine only calls `getSongUrl(song)`. Order is `PLAYLIST`.
- **Story timing:** when each line appears is in its scene file (`at` / `out` = scene progress 0–1). What the world looks like at each moment is in `src/three/timeline.ts`. Scene lengths are in `src/scenes/config.ts`.

## Replacing placeholders

| Key | File | Where | Best kind of photo |
|---|---|---|---|
| `PHOTO_01` | photo-01.jpg | Memories, the larger print | Any photo you love |
| `PHOTO_02` | photo-02.jpg | Memories, the smaller print | A second moment |
| `PHOTO_03` | photo-03.jpg | Eyes: wide crop seen through water, then you're pulled in | A close portrait, eyes near the centre |
| `PHOTO_04` | photo-04.jpg | Soul: print with petals and a sprig | Warm, candid, sunlit |
| `PHOTO_05` | photo-05.jpg | Birthday: stays with the heart at the end | The one she should see last |

Portrait 4:5 works best; about 1200–1600px on the long edge, JPEG quality ~80. Use `focus` in `photos.ts` (CSS `object-position`) to keep the important part in frame.

Songs: replace `public/assets/music/song-0X.mp3` (or add entries), then edit titles in `songs.ts`.

## Supabase later (not implemented)

1. Upload to a `birthday-assets` bucket (`photos/`, `songs/`) — see `supabase.md`.
2. Add `VITE_SUPABASE_URL` (and `VITE_SUPABASE_ANON_KEY` if using signed URLs) to `.env.local`.
3. Change only `getPhotoUrl` / `getSongUrl` in `src/utils/assets.ts` to return Storage URLs (examples in the file's header comment).
4. Optionally build `PHOTOS` / `PLAYLIST` from the `photos` / `songs` tables instead of the local objects; components don't change.

The audio element already uses `crossOrigin="anonymous"` so Web Audio (fades, underwater filter) keeps working with Storage URLs.

## Important decisions

- **One continuous world.** A single WebGL canvas sits behind all scenes; scenes never talk to it. The world follows a continuous journey position (scene index + fraction, including hand-offs between scenes) and eases toward `timeline.ts`, so transitions overlap instead of cutting.
- **Same particles, changing meaning.** Each particle has a home as dust, on the heart, in the sea and in the sky; the shader blends with per-particle delays. This is what lets the heart dissolve into the sea and the sea rise into stars.
- **Layout decides where the heart goes.** Scenes place an invisible `<HeartAnchor>`; the world reads its rectangle each frame and glides the heart there. Mobile and desktop compositions live in CSS. Off-screen anchors are ignored, and the heart snaps into place while invisible so it always forms where it should.
- **Text tone follows the world.** The world sets `--dark` on `<html>`; ink color mixes from deep slate to cream for water and night. Scenes on water also use `.on-dark` so text stays readable during transitions.
- **Reveals are time-based.** Scroll decides *when* a line appears; CSS decides *how* (calm, line by line), so fast scrolling never makes text jerk.
- **Music needs one tap.** The threshold's Enter button is that gesture. Web Audio adds an underwater low-pass, a small dip in the quiet scene, and a barely-there link between loudness and the heart's glow (no visualizer).

## Performance and accessibility

- Particles: 5,200 desktop / 2,600 phones and low-power / 1,600 reduced motion. Pixel ratio capped (2 desktop, 1.5 lite).
- All particle, petal and heart motion runs in shaders; per-frame CPU work is a handful of uniforms.
- Heart and petals aren't drawn when invisible; ocean/night/warm/finale shader branches are skipped when their weight is zero; rendering stops while the tab is hidden; all GPU resources are disposed on unmount; WebGL context loss falls back to a CSS gradient.
- Photos load only when their scene approaches (IntersectionObserver); songs stream with `preload="none"`.
- Reduced motion: no drifting text, slower world, fewer particles, no decorative CSS animation.
- Semantic sections with labels, real buttons, alt text, keyboard-reachable Enter and music controls, focus styles.

## Known issues / remaining

- **Real content needed:** five photos, the real songs and their titles. Optionally a small line above the title (`BIRTHDAY_EYEBROW`), e.g. her name or the date.
- `MEMORIES_01` ("Some moments stay with me.") and the photo captions (`i.`, `ii.`) are placeholder copy I added; change or empty them in `text.ts`.
- The placeholder photos are soft gradients; the photo treatments (print, cinema crop, soft focus) will look best once real photos are in. Check `focus` for the eyes photo especially.
- Tested in headless Chromium (software WebGL) at 1280×800 and 390×844. Worth a final check on a real iPhone (Safari) and Android before sharing.
- Placeholder music: four soft piano pieces rendered from the Salamander Grand Piano samples (CC BY 3.0); credit in `public/assets/music/CREDITS.md`. Remove that file when the real songs replace them.
