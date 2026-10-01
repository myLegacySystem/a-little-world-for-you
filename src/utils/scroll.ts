/**
 * Scroll director.
 *
 * Every scene is a tall section with a sticky stage. The director measures
 * sections, listens to scroll once, and publishes:
 *   - per-scene progress p (0 → 1 while the stage is pinned) for text/photos
 *   - the journey position (continuous, scene index + fraction) for the world
 */

type Listener = (p: number) => void;

interface Entry {
  el: HTMLElement | null;
  index: number;
  top: number;
  height: number;
  progress: number;
  listeners: Set<Listener>;
}

const entries = new Map<string, Entry>();
const journeyListeners = new Set<(pos: number) => void>();
let journey = 0;
let started = false;
let frame = 0;

function measure() {
  entries.forEach((e) => {
    if (!e.el) return;
    const rect = e.el.getBoundingClientRect();
    e.top = rect.top + window.scrollY;
    e.height = rect.height;
  });
  update();
}

function update() {
  frame = 0;
  const y = window.scrollY;
  const vh = window.innerHeight;
  let pos = 0;
  entries.forEach((e) => {
    if (!e.el) return;
    const pinned = Math.max(1, e.height - vh);
    const p = Math.min(1, Math.max(0, (y - e.top) / pinned));
    if (y >= e.top - 1) pos = Math.max(pos, e.index + Math.min(1, (y - e.top) / e.height));
    if (Math.abs(p - e.progress) > 0.0005 || (p !== e.progress && (p === 0 || p === 1))) {
      e.progress = p;
      e.listeners.forEach((l) => l(p));
    }
  });
  if (pos !== journey) {
    journey = pos;
    journeyListeners.forEach((l) => l(pos));
  }
}

function onScroll() {
  if (!frame) frame = requestAnimationFrame(update);
}

function start() {
  if (started) return;
  started = true;
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', measure);
  document.fonts?.ready.then(measure);
  window.addEventListener('load', measure);
}

function entry(id: string) {
  let e = entries.get(id);
  if (!e) {
    e = { el: null, index: -1, top: 0, height: 1, progress: -1, listeners: new Set() };
    entries.set(id, e);
  }
  return e;
}

export function registerScene(id: string, index: number, el: HTMLElement) {
  start();
  const e = entry(id);
  e.el = el;
  e.index = index;
  measure();
  return () => {
    e.el = null;
  };
}

export function onSceneProgress(id: string, fn: Listener) {
  const e = entry(id);
  e.listeners.add(fn);
  if (e.progress >= 0) fn(e.progress);
  return () => {
    e.listeners.delete(fn);
  };
}

export function getJourney() {
  return journey;
}

export function onJourney(fn: (pos: number) => void) {
  start();
  journeyListeners.add(fn);
  fn(journey);
  return () => {
    journeyListeners.delete(fn);
  };
}

export function remeasure() {
  measure();
}
