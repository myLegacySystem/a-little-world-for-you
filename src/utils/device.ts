/**
 * Device capabilities, read once at startup. `lite` trims particle counts and
 * pixel ratio on phones and low-power machines so the world stays smooth.
 */

const mq = (q: string) => typeof window !== 'undefined' && window.matchMedia(q).matches;

export const reducedMotion = mq('(prefers-reduced-motion: reduce)');
export const coarsePointer = mq('(pointer: coarse)');

const nav = typeof navigator !== 'undefined' ? (navigator as Navigator & { deviceMemory?: number }) : undefined;
const cores = nav?.hardwareConcurrency || 4;
const memory = nav?.deviceMemory ?? 4;

export const lite = coarsePointer || cores <= 4 || memory <= 2;

export function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}
