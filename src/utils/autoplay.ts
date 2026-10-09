/**
 * Autoplay: the story moves on its own.
 *
 * Every line of text (and a few wordless moments) registers a beat: the place
 * in its scene where it appears. Autoplay glides from beat to beat and stays on
 * each one long enough to read it, so nothing is missed and nobody has to
 * scroll. Previous / next step one beat at a time. Scrolling by hand takes
 * over; once she lets go and stays still for a moment, autoplay carries on
 * from wherever she is. Pausing hands the page back to her completely.
 */

import { sceneIndex, type SceneId } from '../scenes/config';
import { scrollFor } from './scroll';

// ── Pacing (seconds) ──────────────────────────────────────────────────────
/** A line drifting in before it can be read. */
const LEAD = 1.4;
/** Reading: a little to settle, then per word, and per extra line. */
const READ_BASE = 1;
const READ_WORD = 0.32;
const READ_LINE = 0.17;
/** Gliding between beats: a base, plus this much per screen height travelled. */
const GLIDE_BASE = 0.9;
const GLIDE_PER_SCREEN = 1.25;
const GLIDE_MAX = 6;
/** Previous / next: a quicker glide. */
const STEP_BASE = 0.6;
const STEP_PER_SCREEN = 0.5;
const STEP_MAX = 2.5;
/** After scrolling by hand, carry on once she's been still this long. */
const RESUME_AFTER = 3;

/** Land this many pixels past a beat, so `p >= at` is true on arrival. */
const NUDGE = 2;
/** Positions this close (px) count as the same place. */
const NEAR = 6;

export function readingTime(text: string) {
  const words = text.replace(/[*🩷—…]/gu, ' ').trim().split(/\s+/).filter(Boolean).length;
  const lines = text.split('\n').length;
  return READ_BASE + words * READ_WORD + (lines - 1) * READ_LINE;
}

// ── Beats ────────────────────────────────────────────────────────────────

interface Mark {
  scene: SceneId;
  at: number;
  seconds: number;
  text: boolean;
}

interface Beat {
  scene: SceneId;
  at: number;
  /** How long to stay, in seconds. */
  hold: number;
  text: boolean;
}

const marks = new Set<Mark>();
let compiled: Beat[] | null = null;

/**
 * Registers a place autoplay stops at: `what` is the text that appears there
 * (it stays long enough to read it) or a number of seconds to look.
 */
export function addBeat(scene: SceneId, at: number, what: string | number) {
  if (!what) return () => {};
  const mark: Mark =
    typeof what === 'string'
      ? { scene, at, seconds: readingTime(what), text: true }
      : { scene, at, seconds: what, text: false };
  marks.add(mark);
  compiled = null;
  return () => {
    marks.delete(mark);
    compiled = null;
  };
}

/** Beats in journey order; lines that arrive together are read together. */
function beats() {
  if (compiled) return compiled;
  const sorted = [...marks].sort((a, b) => sceneIndex(a.scene) - sceneIndex(b.scene) || a.at - b.at);
  const out: Beat[] = [];
  for (const m of sorted) {
    const last = out[out.length - 1];
    if (last && last.scene === m.scene && m.at - last.at < 0.005) {
      last.at = m.at;
      last.hold += m.seconds + (m.text && !last.text ? LEAD : 0);
      last.text ||= m.text;
    } else {
      out.push({ scene: m.scene, at: m.at, hold: m.seconds + (m.text ? LEAD : 0), text: m.text });
    }
  }
  compiled = out;
  return out;
}

function beatY(i: number) {
  const b = beats()[i];
  const y = b ? scrollFor(b.scene, b.at) : null;
  if (y === null) return null;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  return Math.max(0, Math.min(max, y + NUDGE));
}

/** The first beat at or after scroll position `y`. */
function firstFrom(y: number) {
  const n = beats().length;
  for (let i = 0; i < n; i++) if ((beatY(i) ?? -Infinity) >= y - NEAR) return i;
  return n;
}

/** The first beat clearly after `y`. */
function firstAfter(y: number) {
  const n = beats().length;
  for (let i = 0; i < n; i++) if ((beatY(i) ?? -Infinity) > y + NEAR) return i;
  return n;
}

/** The last beat clearly before `y`. */
function lastBefore(y: number) {
  for (let i = beats().length - 1; i >= 0; i--) if ((beatY(i) ?? Infinity) < y - NEAR) return i;
  return -1;
}

// ── Motion ───────────────────────────────────────────────────────────────

type Phase = 'still' | 'glide' | 'hold';

let started = false;
let playing = false;
/** She scrolled by hand while playing: waiting for her to let go. */
let held = false;
let phase: Phase = 'still';
/** The beat we're gliding to or staying on; -1 when she has scrolled away. */
let target = -1;
let from = 0;
let progress = 0;
let duration = 1;
/** Seconds left on the current beat (kept when paused mid-beat). */
let remaining = 0;
/** Where we last put the page, to tell our scrolling from hers. */
let lastSet = 0;
let touching = false;
let touchX = 0;
let touchY = 0;
let idle = 0;
let raf = 0;
let lastFrame = 0;

const easeInOut = (t: number) => 0.5 - Math.cos(Math.PI * t) / 2;

function scrollToY(y: number) {
  window.scrollTo(0, y);
  lastSet = window.scrollY;
}

function wake() {
  if (raf) return;
  lastFrame = performance.now();
  raf = requestAnimationFrame(frame);
}

function frame(now: number) {
  raf = 0;
  // Real time, even on a slow phone; a long gap means the page was hidden
  // (rAF sleeps in background tabs), and time stood still meanwhile.
  const gap = Math.max(0, (now - lastFrame) / 1000);
  const dt = gap > 1 ? 0 : Math.min(0.25, gap);
  lastFrame = now;

  if (phase === 'glide') {
    const to = beatY(target);
    if (to === null) {
      phase = 'still';
    } else {
      progress = Math.min(1, progress + dt / duration);
      scrollToY(from + (to - from) * easeInOut(progress));
      if (progress >= 1) arrive();
    }
  } else if (phase === 'hold') {
    remaining -= dt;
    if (remaining <= 0) {
      if (target + 1 < beats().length) goTo(target + 1, 'calm');
      else finish();
    }
  } else if (playing && held) {
    if (!touching) idle += dt;
    if (idle >= RESUME_AFTER) {
      held = false;
      carryOn();
    }
  } else if (playing && target < 0) {
    carryOn();
  }

  if (!raf && (phase !== 'still' || (playing && held))) raf = requestAnimationFrame(frame);
  emit();
}

function goTo(i: number, pace: 'calm' | 'step') {
  const to = beatY(i);
  if (to === null) return;
  target = i;
  from = window.scrollY;
  const dist = Math.abs(to - from);
  if (dist < NEAR) {
    arrive();
    return;
  }
  const screens = dist / window.innerHeight;
  duration =
    pace === 'calm'
      ? Math.min(GLIDE_MAX, GLIDE_BASE + screens * GLIDE_PER_SCREEN)
      : Math.min(STEP_MAX, STEP_BASE + screens * STEP_PER_SCREEN);
  progress = 0;
  phase = 'glide';
  wake();
}

/** Continues from wherever the page is now. */
function carryOn() {
  const i = firstFrom(window.scrollY);
  if (i < beats().length) goTo(i, 'calm');
  else finish();
}

function arrive() {
  const y = beatY(target);
  if (y !== null) scrollToY(y);
  remaining = beats()[target]?.hold ?? 0;
  phase = playing ? 'hold' : 'still';
  if (playing) wake();
  emit();
}

/** The last beat is over: the page belongs to her again. */
function finish() {
  phase = 'still';
  remaining = 0;
  playing = false;
  emit();
}

/** She scrolled the page herself. */
function takeOver() {
  idle = 0;
  target = -1;
  phase = 'still';
  if (playing) {
    held = true;
    wake();
  }
  emit();
}

// ── Listening to her ─────────────────────────────────────────────────────

const onControls = (e: Event) => e.target instanceof Element && !!e.target.closest('.story, .music');

function listen() {
  window.addEventListener(
    'scroll',
    () => {
      if (Math.abs(window.scrollY - lastSet) > 3) takeOver();
      emit();
    },
    { passive: true },
  );
  window.addEventListener('wheel', (e) => !onControls(e) && takeOver(), { passive: true });
  window.addEventListener(
    'touchstart',
    (e) => {
      touching = !onControls(e);
      touchX = e.touches[0]?.clientX ?? 0;
      touchY = e.touches[0]?.clientY ?? 0;
    },
    { passive: true },
  );
  // A tap leaves the story alone; a drag takes over.
  window.addEventListener(
    'touchmove',
    (e) => {
      const t = e.touches[0];
      if (touching && t && Math.hypot(t.clientX - touchX, t.clientY - touchY) > 10) takeOver();
    },
    { passive: true },
  );
  const release = () => {
    touching = false;
    idle = 0;
  };
  window.addEventListener('touchend', release, { passive: true });
  window.addEventListener('touchcancel', release, { passive: true });
  window.addEventListener('keydown', (e) => {
    if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || !(e.target instanceof Element)) return;
    if (e.target.closest('input, textarea, select, [contenteditable]')) return;
    switch (e.key) {
      case ' ':
        if (e.target.closest('button')) return;
        toggle();
        break;
      case 'ArrowDown':
      case 'ArrowRight':
      case 'PageDown':
        next();
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
      case 'PageUp':
        prev();
        break;
      default:
        return;
    }
    e.preventDefault();
  });
}

// ── Controls ─────────────────────────────────────────────────────────────

function play() {
  if (playing) return;
  playing = true;
  held = false;
  if (phase === 'still' && target >= 0) {
    // Paused on a line: finish reading it (or start it, if we stepped here).
    const y = beatY(target);
    if (y !== null && Math.abs(window.scrollY - y) < NEAR && remaining > 0) {
      remaining = Math.max(remaining, 1.5);
      phase = 'hold';
    } else {
      goTo(target, 'calm');
    }
  }
  wake();
  emit();
}

/** Stops on the line that's coming (or showing) and stays there. */
function pause() {
  if (!playing) return;
  playing = false;
  held = false;
  if (phase === 'hold') phase = 'still';
  emit();
}

function toggle() {
  if (playing) pause();
  else play();
}

function next() {
  held = false;
  if (phase === 'glide') {
    // Hurry to the line that's coming.
    goTo(target, 'step');
    return;
  }
  const i = target >= 0 ? target + 1 : firstAfter(window.scrollY);
  if (i < beats().length) goTo(i, 'step');
}

function prev() {
  held = false;
  const i = target >= 0 ? target - 1 : lastBefore(window.scrollY);
  if (i >= 0) goTo(i, 'step');
}

// ── State for the controls ───────────────────────────────────────────────

interface Snapshot {
  playing: boolean;
  /** The last beat has been reached: the story is complete. */
  done: boolean;
}

let snapshot: Snapshot = { playing: false, done: false };
const listeners = new Set<() => void>();

function emit() {
  const last = beatY(beats().length - 1);
  const done = started && last !== null && window.scrollY >= last - NEAR && phase !== 'glide';
  if (snapshot.playing === playing && snapshot.done === done) return;
  snapshot = { playing, done };
  listeners.forEach((l) => l());
}

export const autoplay = {
  subscribe(fn: () => void) {
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  },
  getSnapshot: () => snapshot,
  /** Begins playing (once she has entered). */
  start() {
    if (started) return;
    started = true;
    listen();
    play();
  },
  toggle: () => toggle(),
  next: () => next(),
  prev: () => prev(),
};
