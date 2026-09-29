/** 0 before `a`, 1 after `b`, smooth in between. */
export function ramp(p: number, a: number, b: number) {
  const t = Math.min(1, Math.max(0, (p - a) / (b - a)));
  return t * t * (3 - 2 * t);
}
