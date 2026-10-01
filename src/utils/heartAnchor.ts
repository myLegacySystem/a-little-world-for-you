/**
 * Where the 3D heart should sit on screen.
 *
 * Scenes place an invisible <HeartAnchor> in their layout; the WebGL world
 * reads the anchor rectangles each frame and glides the heart there. Layout
 * (and therefore mobile/desktop composition) stays in CSS, not in 3D maths.
 */

const anchors = new Map<number, HTMLElement>();

export function setHeartAnchor(sceneIndex: number, el: HTMLElement | null) {
  if (el) anchors.set(sceneIndex, el);
  else anchors.delete(sceneIndex);
}

export function getHeartAnchor(sceneIndex: number) {
  return anchors.get(sceneIndex);
}
