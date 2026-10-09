/**
 * Photographs that live inside the WebGL world.
 *
 * A <Photo inWorld> keeps its normal box in the layout (with alt text for
 * screen readers) and registers it here; the world draws the photograph as a
 * real object at that box's position — emerging from specks of light,
 * floating, catching the pointer — and the DOM image stays invisible.
 */

export interface WorldPhoto {
  key: string;
  el: HTMLElement;
  url: string;
  /** 0 → 1 presence, set by the scene as it scrolls. */
  visible: number;
  /** Tilt of the print in degrees (matches the layout's rotation). */
  tilt: number;
}

const photos = new Map<string, WorldPhoto>();
let version = 0;

export function setWorldPhoto(photo: WorldPhoto) {
  if (!photos.has(photo.key)) version++;
  photos.set(photo.key, photo);
}

export function removeWorldPhoto(key: string) {
  if (photos.delete(key)) version++;
}

export function worldPhotos() {
  return photos;
}

/** Changes whenever a photo is added or removed. */
export function worldPhotosVersion() {
  return version;
}

/** Whether the world can draw photographs (WebGL is running). */
let worldReady = false;
export function setWorldReady(ready: boolean) {
  worldReady = ready;
  document.documentElement.classList.toggle('has-world', ready);
}
export function isWorldReady() {
  return worldReady;
}
