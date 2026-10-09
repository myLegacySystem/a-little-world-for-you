# Progress — A little world, made for you

## V2 — cinematic pass (latest)

Built on top of the first version — same stack, content files, scroll director, timeline and anchors. What changed:

**Story order** (`src/scenes/config.ts`): opening → color → **heart** (new, no words) → memories → eyes → fall (now ends by surfacing into stars) → quote (now an almost-white pause) → **response** (new: my words after the quote, in rose light) → soul → dreams → personal → birthday.

**The world** (`three/timeline.ts`, `three/Atmosphere.ts`): new moods — `heartLight` (a soft pink light before the heart has a shape), `mist` (the quote's white pause), `rose` (warm pink for my own words and the personal wish), `ghost` (faint heart-shaped light in the personal wish), and camera travel: `dolly` (moving forward through the particles; rushes when she's "pulled into the sea") and `sink` (falling through the water; reversing it rises). Leaving the sea, the surface now sinks away below and we come up into the night sky. At the birthday, the stars become particles, the particles become light, and the heart re-forms.

**The heart** is discovered: dust → pink light → particles gather → shape → glass forms → in its own scene we drift closer while it breathes → it dissolves into the sea → it reforms at the end, beside the final photograph.

**Photographs in the world** (`three/Memories.ts`, `utils/photoAnchor.ts`): photos are now drawn by WebGL as real objects where their layout box is. They materialise from glowing specks, sit on cream print paper with grain and a soft shadow, float slightly and lean toward the pointer. The DOM `<img>` stays (invisible) for alt text and as the fallback without WebGL. Textures load only near the screen and are disposed when removed.

**Particles**: depth-of-field bokeh away from the heart's plane, travel with the camera, drift softly away from the mouse (desktop only), rose tints, stars that stay visible on light skies as tiny gold/rose lights.

**Type**: the quote is "remembered" — each line focuses in as its letters settle; attribution is small and quiet. The birthday title is the largest type of the whole piece (`.t-hero`).

**Mouse**: a faint light follows the pointer; particles part around it; photos tilt toward it; the heart sways with it. Nothing depends on it; touch devices simply scroll.

**Validation**: `npm run typecheck`, `npm run lint`, `npm run build` pass. Full scroll walk in headless Chromium at 1280×800, 390×844 (touch) and reduced motion: no console errors (other than expected 404s for the two song files not yet added). Music: enter by keyboard, pause, next, missing-song fallback.

---


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
| 4 | `EyesScene` | **Wow 3:** the heart dissolves; its particles swirl out and become the sea, which rises over everything. The words carry us forward, and the camera is pulled into the sea. (The photo of her eyes seen through the water was removed.) Music becomes softly muffled underwater. |
| 5 | `FallScene` | Deeper and calmer; particles rise past as we sink. |
| 6 | `QuoteScene` | Natalie Newman's quote in deep water (stars reflected on it at "the sparkle in her eyes"), then the afterword. **Wow 4:** the particles rise and become stars as the sea darkens into a twilight sky. |
| 7 | `DreamsScene` | Night sky; each wish lights a star in a small constellation. |
| 8 | `SoulScene` | Dawn: cream, buttercream sun, blush; petals drift; a hand-drawn sprig draws itself. |
| 9 | `PersonalScene` | The quietest moment: pale lavender morning. At "close to my heart too" the particles begin to gather again. |
| 10 | `BirthdayScene` | **Wow 5:** the heart reforms, larger and clearer than before, beside the final photograph, among every color of the story. "Happy Birthday" stays while her names take turns beneath it (MadamJi → Purnpoli → Ukdicha Modak → Kaju Katli), each with a small 🩷 at the end. It stays: the page ends here and the world keeps breathing. |

## Project structure

```text
src/
  content/
    text.ts        Every user-facing string (TEXT.*). The only place to change wording.
    photos.ts      PHOTOS.PHOTO_01, 02, 04, 05 — id, place, localPath, alt, focus, role
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
  images/          photo-01, 02, 04, 05.jpg (placeholders)
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
- **Names:** `TEXT.BIRTHDAY_NAMES` — the names that flip after `TEXT.BIRTHDAY_TITLE`. Add, remove or reorder; one name stays still, none shows just the title.
- **Songs:** `src/content/songs.ts`. The audio engine only calls `getSongUrl(song)`. `PLAYLIST` is "Perfect" (Ed Sheeran) and "I Wanna Be Yours" (Arctic Monkeys), expected at `public/assets/music/perfect.mp3` and `i-wanna-be-yours.mp3`. Any song whose file is missing is skipped; if none can play, `FALLBACK_PLAYLIST` (the placeholder piano) plays instead.
- **Story timing:** when each line appears is in its scene file (`at` / `out` = scene progress 0–1). What the world looks like at each moment is in `src/three/timeline.ts`. Scene lengths are in `src/scenes/config.ts`.

## Replacing placeholders

| Key | File | Where | Best kind of photo |
|---|---|---|---|
| `PHOTO_01` | photo-01.jpg | Memories, the larger print | Any photo you love |
| `PHOTO_02` | photo-02.jpg | Memories, the smaller print | A second moment |
| `PHOTO_04` | photo-04.jpg | Soul: print with petals and a sprig | Warm, candid, sunlit |
| `PHOTO_05` | photo-05.jpg | Birthday: stays with the heart at the end | The one she should see last |

Portrait 4:5 works best; about 1200–1600px on the long edge, JPEG quality ~80. Use `focus` in `photos.ts` (CSS `object-position`) to keep the important part in frame.

The real photos and songs go to Supabase: upload them and they replace these places (see `supabase.md`); the files in `public/` stay as the fallback.

Songs: the `songs` table is the playlist. Without Supabase, `PLAYLIST` in `songs.ts` expects `perfect.mp3` and `i-wanna-be-yours.mp3` in `public/assets/music/`. The placeholder piano (`song-01…04.mp3`, `FALLBACK_PLAYLIST`) plays only when nothing else can.

Note on copyright: these are commercial recordings. Don't commit the MP3s to this public repository; keep them in Supabase Storage.

## Supabase (live content)

Steps to go live: [supabase.md](supabase.md). Setup SQL: `supabase/setup.sql`.

- `src/utils/supabase.ts` reads tables over the REST API with plain `fetch` (no client library) and builds public Storage URLs. Config: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` in `.env.production` (public values; read by every build, not by `npm run dev`).
- `loadAssets()` in `src/utils/assets.ts` runs before the first render (`main.tsx`): `photos` rows fill the four places by `sort_order` (= `place` in `photos.ts`: 1, 2, 4, 5); `songs` rows become the playlist. Anything missing, unreadable, or slower than 5 s falls back to `public/`.
- The audio engine picks its playlist when the music first starts (`getPlaylist()`), after that load.
- Tested against a local mock of the REST and Storage endpoints (publishable and legacy JWT keys, partial tables, odd file paths, a missing song, Supabase down, a hanging server), and the SQL against Postgres 16 with stand-ins for Supabase's storage tables (rows built from the uploaded files, re-runnable, stale rows switched off; the anon role reads active rows only and can't write). Not yet run against the real project.

The audio element and photo loaders use `crossOrigin="anonymous"`, so Web Audio (fades, underwater filter) and WebGL textures work with Storage URLs.

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

- **Real content:** her photos and songs are in Supabase (see supabase.md); the placeholders in `public/` are only the fallback. Optionally a small line above the title (`BIRTHDAY_EYEBROW`), e.g. the date.
- `MEMORIES_01` ("Some moments stay with me.") and the photo captions (`i.`, `ii.`) are placeholder copy I added; change or empty them in `text.ts`.
- Check `focus` in `photos.ts` against the real photos so the crops keep faces in frame.
- Tested in headless Chromium (software WebGL) at 1280×800 and 390×844. Worth a final check on a real iPhone (Safari) and Android before sharing.
- Placeholder music: four soft piano pieces rendered from the Salamander Grand Piano samples (CC BY 3.0); credit in `public/assets/music/CREDITS.md`. Remove that file when the real songs replace them.
