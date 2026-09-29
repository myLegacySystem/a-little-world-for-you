/**
 * The mood of the world, as a handful of weights the effects read every frame.
 *
 * The journey is a single number: `scene index + progress through that scene`.
 * Keyframes below say what the world should feel like at each point; the
 * renderer eases towards the interpolated target so nothing ever snaps.
 */

export interface WorldState {
  /** 0 = grey, 1 = full colour spread through the world. */
  color: number;
  /** The first small light: a glowing point that grows. */
  light: number;
  /** Deep blue water. */
  ocean: number;
  /** How far we've sunk: darker, fewer rays. */
  depth: number;
  /** Stars reflected on water (the quote). */
  sparkle: number;
  /** Warm cream / peach / gold light (her soul). */
  warm: number;
  /** Night sky. */
  night: number;
  /** Quiet: fewer particles, dimmer stars (the personal wish). */
  hush: number;
  /** Everything together (the birthday). */
  finale: number;
}

export const emptyWorld: WorldState = {
  color: 0, light: 0, ocean: 0, depth: 0, sparkle: 0, warm: 0, night: 0, hush: 0, finale: 0,
};

/** Scene order — must match the order scenes are rendered in App. */
export const sceneOrder = ['intro', 'color', 'ocean', 'quote', 'soul', 'wishes', 'personal', 'birthday'] as const;
export type SceneId = (typeof sceneOrder)[number];

type Key = [at: number, state: Partial<WorldState>];

// Positions are `sceneIndex + progress` (0 = start of intro, 7 = start of birthday).
const keys: Key[] = [
  [0.0, {}],
  [0.6, {}],
  [0.8, { light: 0.35, color: 0.06 }],
  [1.0, { light: 0.7, color: 0.3 }],
  [1.45, { light: 0.85, color: 0.85 }],
  [1.95, { light: 0.5, color: 1 }],
  [2.1, { light: 0.25, color: 0.7, ocean: 0.6 }],
  [2.3, { color: 0.5, ocean: 1 }],
  [2.95, { color: 0.4, ocean: 1, depth: 0.55 }],
  [3.12, { color: 0.3, ocean: 1, depth: 0.8 }],
  // "the sparkle in her eyes" — stars reflected on the water.
  [3.17, { color: 0.3, ocean: 1, depth: 0.8, sparkle: 1 }],
  [3.26, { color: 0.3, ocean: 1, depth: 0.8, sparkle: 1 }],
  [3.36, { color: 0.3, ocean: 1, depth: 0.85, sparkle: 0.4 }],
  [3.7, { color: 0.35, ocean: 0.9, depth: 1, sparkle: 0.3 }],
  [3.95, { color: 0.4, ocean: 0.55, depth: 0.7, sparkle: 0.1, warm: 0.3 }],
  [4.15, { color: 0.4, ocean: 0.05, warm: 0.9 }],
  [4.8, { color: 0.45, warm: 1 }],
  [5.0, { color: 0.3, warm: 0.45, night: 0.6 }],
  [5.2, { color: 0.15, night: 1 }],
  [5.95, { color: 0.15, night: 1 }],
  [6.15, { color: 0.05, night: 1, hush: 1 }],
  [6.9, { color: 0.05, night: 1, hush: 1 }],
  [7.1, { color: 0.6, night: 0.7, finale: 0.4, light: 0.2 }],
  [7.35, { color: 1, night: 0.35, finale: 1, warm: 0.25, ocean: 0.12, light: 0.35 }],
  [8.0, { color: 1, night: 0.35, finale: 1, warm: 0.25, ocean: 0.12, light: 0.35 }],
];

const full = keys.map(([at, s]) => [at, { ...emptyWorld, ...s }] as const);

export function worldAt(pos: number): WorldState {
  if (pos <= full[0][0]) return { ...full[0][1] };
  for (let i = 0; i < full.length - 1; i++) {
    const [a, sa] = full[i];
    const [b, sb] = full[i + 1];
    if (pos <= b) {
      const t = smooth((pos - a) / (b - a));
      const out = { ...emptyWorld };
      (Object.keys(out) as (keyof WorldState)[]).forEach((k) => {
        out[k] = sa[k] + (sb[k] - sa[k]) * t;
      });
      return out;
    }
  }
  return { ...full[full.length - 1][1] };
}

function smooth(t: number) {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
}
