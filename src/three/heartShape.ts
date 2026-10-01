/**
 * One heart shape, shared by the glass heart and the particles that form it,
 * so the two always line up when it forms and when it dissolves.
 *
 * Taubin's implicit heart surface (rewritten with y up):
 *   (x² + 9/4·z² + y² − 1)³ − x²·y³ − 9/80·z²·y³ = 0
 * It's star-shaped around the origin, so for any direction we can find the
 * surface by searching along a ray.
 */

const DEPTH = 0.78; // a little slimmer front-to-back than the classic shape

function inside(x: number, y: number, z: number) {
  const zz = z / DEPTH;
  const a = x * x + 2.25 * zz * zz + y * y - 1;
  return a * a * a - x * x * y * y * y - 0.1125 * zz * zz * y * y * y < 0;
}

/** Distance from the origin to the surface along unit direction (dx, dy, dz). */
export function heartRadius(dx: number, dy: number, dz: number) {
  let lo = 0;
  let hi = 1.7;
  for (let i = 0; i < 22; i++) {
    const mid = (lo + hi) / 2;
    if (inside(dx * mid, dy * mid, dz * mid)) lo = mid;
    else hi = mid;
  }
  return lo;
}

// The raw shape spans y ∈ [-0.99, 1.24]; centre it and normalise to a
// height of 1 so `scale` means "height in world units".
export const HEART_CENTER_Y = 0.12;
export const HEART_NORMALISE = 1 / 2.23;

/** Fill `out` with `count` points on (and just inside) the heart surface. */
export function sampleHeart(count: number, random = Math.random) {
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    // Uniform direction on the sphere.
    const u = random() * 2 - 1;
    const phi = random() * Math.PI * 2;
    const s = Math.sqrt(1 - u * u);
    const dx = s * Math.cos(phi);
    const dy = u;
    const dz = s * Math.sin(phi);
    const r = heartRadius(dx, dy, dz);
    // Mostly a fine shell, with a soft glowing core.
    const depth = random() < 0.82 ? 0.93 + random() * 0.07 : Math.cbrt(random()) * 0.9;
    out[i * 3] = dx * r * depth * HEART_NORMALISE;
    out[i * 3 + 1] = (dy * r * depth - HEART_CENTER_Y) * HEART_NORMALISE;
    out[i * 3 + 2] = dz * r * depth * HEART_NORMALISE;
  }
  return out;
}
