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
}

export const EMPTY: WorldState = {
  color: 0, heart: 0, glass: 0, burst: 0, ocean: 0, sea: 0, depth: 0, sparkle: 0,
  stars: 0, night: 0, warm: 0, petals: 0, hush: 0, finale: 0, dark: 0,
};

type Key = [scene: SceneId, p: number, state: Partial<WorldState>];

const KEYS: Key[] = [
  // Before: grey-cream stillness, loose dust.
  ['opening', 0, {}],
  ['opening', 0.5, {}],
  // "And then you came into my life." — dust starts to gather, a first tint.
  ['opening', 0.62, { heart: 0.1, color: 0.03 }],
  ['opening', 1, { heart: 0.26, color: 0.1 }],

  // Color arrives, one hue at a time; the heart takes shape and gains color.
  ['color', 0, { heart: 0.3, color: 0.12 }],
  ['color', 0.12, { heart: 0.42, color: 0.24 }],
  ['color', 0.45, { heart: 0.72, color: 0.55, glass: 0.12 }],
  ['color', 0.58, { heart: 0.9, color: 0.78, glass: 0.45 }],
  ['color', 0.85, { heart: 1, color: 1, glass: 1 }],

  // Memories: the world is colorful; the heart rests among the photographs.
  ['memories', 1, {}],

  // Her eyes: the heart dissolves; water rises over everything; her eyes
  // surface in it, and then we're pulled in.
  ['eyes', 0.06, {}],
  ['eyes', 0.12, { ocean: 0.08, sea: 0.1, burst: 1, glass: 0.75 }],
  ['eyes', 0.24, { ocean: 0.45, sea: 0.55, glass: 0.1, dark: 0.2, color: 0.85 }],
  ['eyes', 0.34, { ocean: 0.82, sea: 0.9, glass: 0, dark: 0.75 }],
  ['eyes', 0.42, { ocean: 1, sea: 1, dark: 1, color: 0.6 }],
  ['eyes', 0.6, { depth: 0.05 }],
  ['eyes', 1, { depth: 0.25, burst: 0.3 }],

  // Falling: deeper, calmer.
  ['fall', 0, { heart: 0, burst: 0 }],
  ['fall', 1, { depth: 1 }],

  // The quote: deep water, then stars reflected on it…
  ['quote', 0.1, { sparkle: 0 }],
  ['quote', 0.15, { sparkle: 1 }],
  ['quote', 0.22, { sparkle: 1 }],
  ['quote', 0.3, { sparkle: 0.35 }],
  // …and the particles begin to rise towards the sky.
  ['quote', 0.55, { stars: 0 }],
  ['quote', 1, { stars: 0.55, night: 0.45, sparkle: 0.1 }],

  // Dreams: the sea has darkened into a night sky.
  ['dreams', 0, { stars: 0.75, night: 0.75, sparkle: 0 }],
  ['dreams', 0.15, { stars: 1, night: 1 }],
  ['dreams', 0.2, { ocean: 0, depth: 1 }],
  ['dreams', 1, {}],

  // Her soul: dawn; stars fall away into warm golden light and petals.
  ['soul', 0, {}],
  ['soul', 0.12, { stars: 0.45, night: 0.4, warm: 0.7, dark: 0.25, sea: 0.5 }],
  ['soul', 0.22, { stars: 0, night: 0, warm: 1, dark: 0, sea: 0, petals: 0.7, depth: 0 }],
  ['soul', 0.85, { petals: 1 }],
  ['soul', 1, { petals: 0.6 }],

  // The personal wish: quieter, paler. At "close to my heart" it begins again.
  ['personal', 0, { warm: 0.9, hush: 0.3, petals: 0.4 }],
  ['personal', 0.15, { warm: 0.6, hush: 1, petals: 0.05 }],
  ['personal', 0.78, { color: 0.5 }],
  ['personal', 0.9, { heart: 0.4, color: 0.65 }],
  ['personal', 1, { heart: 0.6, glass: 0.25, color: 0.75 }],

  // Birthday: everything together, the heart whole again.
  ['birthday', 0, { heart: 0.7, glass: 0.4, hush: 0.5, warm: 0.5, finale: 0.4, color: 0.85 }],
  ['birthday', 0.12, { heart: 1, glass: 1, hush: 0, warm: 0.2, finale: 1, color: 1, petals: 0.5 }],
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
