/**
 * The order of the journey and how long each part lasts (in screen heights
 * of scrolling). Scenes, the WebGL timeline and the scroll director all read
 * from here, so re-ordering or lengthening a part happens in one place.
 */
export const SCENES = [
  { id: 'opening', length: 3.2 },
  { id: 'color', length: 3.6 },
  { id: 'heart', length: 3.2 },
  { id: 'memories', length: 3.6 },
  { id: 'eyes', length: 4.8 },
  { id: 'fall', length: 4.6 },
  { id: 'quote', length: 5.4 },
  { id: 'response', length: 4 },
  { id: 'soul', length: 5 },
  { id: 'dreams', length: 4.2 },
  { id: 'personal', length: 4.8 },
  { id: 'birthday', length: 7 },
] as const;

export type SceneId = (typeof SCENES)[number]['id'];

export const sceneIndex = (id: SceneId) => SCENES.findIndex((s) => s.id === id);

/**
 * Journey position for a moment inside a scene.
 *
 * The journey runs `index → index + 1` across a scene's whole section. Its
 * pinned part (where `p` goes 0 → 1) is the first (L − 1) / L of that; the
 * rest is the hand-off while the next scene scrolls in.
 */
export function journeyAt(id: SceneId, p: number) {
  const i = sceneIndex(id);
  const L = SCENES[i].length;
  return i + (p * (L - 1)) / L;
}
