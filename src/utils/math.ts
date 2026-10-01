export const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));

/** 0 before `a`, 1 after `b`, smooth in between. */
export function ramp(p: number, a: number, b: number) {
  const t = clamp((p - a) / (b - a));
  return t * t * (3 - 2 * t);
}

/** Rises over [a, b], falls over [c, d]. */
export function window4(p: number, a: number, b: number, c: number, d: number) {
  return ramp(p, a, b) * (1 - ramp(p, c, d));
}
