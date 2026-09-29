/**
 * Scroll director.
 *
 * Every scene is a tall section with a sticky "stage" inside. While a scene's
 * stage is pinned, its progress runs 0 → 1. The director measures sections,
 * listens to scroll once, and publishes:
 *   - per-scene progress (for text and photos)
 *   - the journey position (for the WebGL world)
 */

type Listener = (p: number) => void;

interface Entry {
  el: HTMLElement;
  index: number;
  top: number;
  length: number;
  progress: number;
  listeners: Set<Listener>;
}

const entries = new Map<string, Entry>();
const journeyListeners = new Set<(pos: number) => void>();
let journey = 0;
let started = false;
let frame = 0;

function measure() {
  const vh = window.innerHeight;
  entries.forEach((e) => {
    const rect = e.el.getBoundingClientRect();
    e.top = rect.top + window.scrollY;
    e.length = Math.max(1, rect.height - vh);
  });
  update();
}

function update() {
  frame = 0;
  const y = window.scrollY;
  let pos = 0;
  entries.forEach((e) => {
    const p = Math.min(1, Math.max(0, (y - e.top) / e.length));
    if (y >= e.top - 1) pos = Math.max(pos, e.index + p);
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
  // Fonts and images can shift layout; re-measure when they settle.
  document.fonts?.ready.then(measure);
  window.addEventListener('load', measure);
}

export function registerScene(id: string, index: number, el: HTMLElement) {
  start();
  const prev = entries.get(id);
  entries.set(id, { el, index, top: 0, length: 1, progress: -1, listeners: prev?.listeners ?? new Set() });
  measure();
  return () => {
    entries.delete(id);
  };
}

export function onSceneProgress(id: string, fn: Listener) {
  let e = entries.get(id);
  if (!e) {
    // Scene not mounted yet; keep the listener until it registers.
    e = { el: document.body, index: -1, top: 0, length: 1, progress: 0, listeners: new Set() };
    entries.set(id, e);
  }
  e.listeners.add(fn);
  if (e.progress >= 0) fn(e.progress);
  return () => {
    entries.get(id)?.listeners.delete(fn);
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
