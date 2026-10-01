/**
 * The mood of the world along the journey.
 *
 * Each key says "at this moment of this scene, the world feels like this".
 * Values carry forward until changed, and the renderer eases between them, so
 * nothing ever snaps. This is the one place to tune the visual story.
 */

import { journeyAt, type SceneId } from '../scenes/config';

export interface WorldState {
  /** Watercolor arriving: 0 = colorless paper, 1 = all five colors. */
  color: number;
  /** Particles gathering into the heart. */
  heart: number;
  /** The glass heart itself. */
  glass: number;
  /** How much the heart particles swirl outward as it dissolves. */
  burst: number;
  /** Water rising until everything is sea (background). */
  ocean: number;
  /** Particles living in the water. */
  sea: number;
  /** How deep we've sunk. */
  depth: number;
  /** Stars reflected on the water. */
  sparkle: number;
  /** Particles becoming stars. */
  stars: number;
  /** The twilight sky behind them. */
  night: number;
  /** Warm cream / buttercream / blush light. */
  warm: number;
  /** Drifting petals. */
  petals: number;
  /** A quieter, paler world (the personal wish). */
  hush: number;
  /** Everything together (the birthday). */
  finale: number;
  /** 0 = light background (dark text), 1 = deep background (light text). */
  dark: number;
  /** The first soft pink light, before the heart has a shape. */
  heartLight: number;
  /** Warm rose light (my own words; the personal wish). */
  rose: number;
  /** Faint heart-shaped light patterns. */
  ghost: number;
  /** An almost-white pause (the quote). */
  mist: number;
  /** Camera travelling forward through the particles (cumulative). */
  dolly: number;
  /** Camera sinking through the water (cumulative; back down = rising). */
  sink: number;
}

export const EMPTY: WorldState = {
  color: 0, heart: 0, glass: 0, burst: 0, ocean: 0, sea: 0, depth: 0, sparkle: 0,
  stars: 0, night: 0, warm: 0, petals: 0, hush: 0, finale: 0, dark: 0,
  heartLight: 0, rose: 0, ghost: 0, mist: 0, dolly: 0, sink: 0,
};

type Key = [scene: SceneId, p: number, state: Partial<WorldState>];

const KEYS: Key[] = [
  // COLOR — before: grey-cream stillness, loose dust.
  ['opening', 0, {}],
  ['opening', 0.5, {}],
  // "And then you came into my life." — the whole world reacts: a first
  // light, a first tint, the dust begins to lean toward one place.
  ['opening', 0.6, { heart: 0.06, color: 0.05, heartLight: 0.2, dolly: 0.3 }],
  ['opening', 1, { heart: 0.14, color: 0.14, heartLight: 0.32, dolly: 0.6 }],

  // Color awakens, one hue at a time, from that light outward.
  ['color', 0.12, { color: 0.3, heart: 0.22 }],
  ['color', 0.5, { color: 0.62, heart: 0.36, heartLight: 0.55 }],
  ['color', 0.62, { color: 0.86 }],
  ['color', 1, { color: 1, heart: 0.5, heartLight: 0.7, dolly: 1 }],

  // SHE → HEART — no words: the particles gather, the shape is discovered,
  // the glass forms, and we drift closer while it breathes.
  ['heart', 0.08, { heart: 0.6 }],
  ['heart', 0.3, { heart: 0.92, glass: 0.25 }],
  ['heart', 0.5, { heart: 1, glass: 1, heartLight: 0.5 }],
  ['heart', 1, { heartLight: 0.35, dolly: 2.4 }],

  // Memories: the heart rests among the photographs.
  ['memories', 0, { heartLight: 0.2 }],
  ['memories', 1, { dolly: 3 }],

  // HER EYES → OCEAN — the heart dissolves; water rises over everything;
  // her eyes surface in it, and we're pulled in through them.
  ['eyes', 0.06, {}],
  ['eyes', 0.12, { ocean: 0.08, sea: 0.1, burst: 1, glass: 0.75 }],
  ['eyes', 0.24, { ocean: 0.45, sea: 0.55, glass: 0.1, dark: 0.2, color: 0.85, heartLight: 0 }],
  ['eyes', 0.34, { ocean: 0.82, sea: 0.9, glass: 0, dark: 0.75 }],
  ['eyes', 0.42, { ocean: 1, sea: 1, dark: 1, color: 0.6 }],
  ['eyes', 0.6, { depth: 0.05, dolly: 3.4 }],
  // "It's like being pulled into the sea." — the water rushes past.
  ['eyes', 0.78, { dolly: 7.5, sink: 1.5 }],
  ['eyes', 1, { depth: 0.25, burst: 0.3, dolly: 8, sink: 2.5 }],

  // Falling: deeper and calmer…
  ['fall', 0, { heart: 0, burst: 0 }],
  ['fall', 0.55, { depth: 1, sink: 7 }],
  // …then the particles turn upward, we follow them, the surface sinks away
  // below us and the water becomes a night full of stars.
  ['fall', 0.68, { night: 1, stars: 0.25, sink: 5.5 }],
  ['fall', 0.86, { ocean: 0.4, stars: 0.75, sink: 3 }],
  ['fall', 1, { ocean: 0, stars: 1, sea: 0.6, sink: 2 }],

  // The quote: the night dissolves into an almost-white pause.
  ['quote', 0, {}],
  ['quote', 0.1, { mist: 1, night: 0, stars: 0.2, sea: 0, dark: 0, depth: 0 }],
  ['quote', 0.2, { stars: 0 }],
  ['quote', 1, {}],

  // My response: warmer, pinker light.
  ['response', 0.12, { mist: 0, rose: 1, color: 0.9 }],
  ['response', 1, {}],

  // Her soul: warm gold, petals.
  ['soul', 0.15, { rose: 0, warm: 1, petals: 0.7 }],
  ['soul', 0.85, { petals: 1 }],
  ['soul', 1, { petals: 0.6 }],

  // DREAMS → FUTURE: a pastel night sky.
  ['dreams', 0, {}],
  ['dreams', 0.15, { warm: 0, night: 1, stars: 1, dark: 1, petals: 0 }],
  ['dreams', 1, {}],

  // The personal wish: warm again, pink particles, faint heart-shaped light.
  ['personal', 0, {}],
  ['personal', 0.14, { night: 0, stars: 0, rose: 0.6, hush: 0.55, dark: 0, ghost: 0.25 }],
  ['personal', 0.75, { ghost: 0.45 }],
  // "…close to my heart too." — the light remembers the heart.
  ['personal', 0.9, { ghost: 0.9, stars: 0.4, heartLight: 0.3 }],
  ['personal', 1, { ghost: 1, stars: 0.6, heart: 0.15, heartLight: 0.45 }],

  // HEART → BIRTHDAY: the stars become particles, the particles become light,
  // the light gathers — and the heart forms again, fuller than before.
  ['birthday', 0, { stars: 0.6, heart: 0.25 }],
  ['birthday', 0.08, { stars: 0.15, heart: 0.85, glass: 0.3, finale: 0.7, rose: 0.2, hush: 0, ghost: 0.3, color: 1 }],
  ['birthday', 0.16, { stars: 0, heart: 1, glass: 1, finale: 1, rose: 0, ghost: 0, heartLight: 0.3, petals: 0.5 }],
  ['birthday', 1, {}],
];

// Resolve carry-forward values and journey positions once.
const RESOLVED = (() => {
  let current: WorldState = { ...EMPTY };
  return KEYS.map(([scene, p, s]) => {
    current = { ...current, ...s };
    return { at: journeyAt(scene, p), state: current };
  }).sort((a, b) => a.at - b.at);
})();

const FIELDS = Object.keys(EMPTY) as (keyof WorldState)[];

export function worldAt(pos: number): WorldState {
  const first = RESOLVED[0];
  const last = RESOLVED[RESOLVED.length - 1];
  if (pos <= first.at) return { ...first.state };
  if (pos >= last.at) return { ...last.state };
  for (let i = 0; i < RESOLVED.length - 1; i++) {
    const a = RESOLVED[i];
    const b = RESOLVED[i + 1];
    if (pos <= b.at) {
      const span = b.at - a.at || 1;
      const x = Math.min(1, Math.max(0, (pos - a.at) / span));
      const t = x * x * (3 - 2 * x);
      const out = { ...EMPTY };
      for (const k of FIELDS) out[k] = a.state[k] + (b.state[k] - a.state[k]) * t;
      return out;
    }
  }
  return { ...last.state };
}

export function easeWorld(current: WorldState, target: WorldState, k: number) {
  for (const f of FIELDS) current[f] += (target[f] - current[f]) * k;
}
