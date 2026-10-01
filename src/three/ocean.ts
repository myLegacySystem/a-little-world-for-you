/**
 * The sea — being drawn into her eyes.
 *
 * GLSL used by the Atmosphere shader: luminous sky-blue near the surface,
 * deepening blues as we sink (never black), slow light rays, swaying caustics
 * and — for the quote — stars reflected on the water as soft glints.
 */
export const ocean = /* glsl */ `
float caustic(vec2 p, float t) {
  float c = 0.0;
  vec2 q = p * 3.0;
  for (int i = 0; i < 3; i++) {
    q += vec2(sin(q.y * 1.3 + t * 0.32), cos(q.x * 1.1 - t * 0.28)) * 0.45;
    c += abs(sin(q.x + q.y));
  }
  return pow(1.0 - c / 3.0, 5.0);
}

vec3 glints(vec2 uv, vec2 p, float t, float band) {
  vec2 q = vec2(p.x * 26.0 + sin(uv.y * 24.0 + t * 0.5) * 0.35, uv.y * 40.0);
  vec2 cell = floor(q);
  vec2 f = fract(q) - 0.5;
  float h = hash(cell);
  vec2 off = vec2(hash(cell + 3.1), hash(cell + 7.7)) - 0.5;
  vec2 dd = (f - off * 0.6) * vec2(1.0, 1.6);
  float g = exp(-dot(dd, dd) * 90.0);
  float tw = pow(max(0.0, sin(t * (0.5 + h * 1.2) + h * 40.0)), 10.0);
  return vec3(0.92, 0.97, 1.0) * g * step(0.8, h) * tw * band;
}

// Round twinkles for the sky (the water's glints are stretched by ripples).
float twinkles(vec2 p, float t, float band) {
  vec2 q = p * 22.0;
  vec2 cell = floor(q);
  vec2 f = fract(q) - 0.5;
  float h = hash(cell + 11.0);
  vec2 off = vec2(hash(cell + 5.3), hash(cell + 9.1)) - 0.5;
  vec2 dd = f - off * 0.6;
  float g = exp(-dot(dd, dd) * 160.0);
  float tw = pow(max(0.0, sin(t * (0.4 + h * 0.9) + h * 30.0)), 6.0);
  return g * step(0.86, h) * tw * band;
}

vec3 oceanColor(vec2 uv, vec2 p, float t, float depth, float sparkle, vec2 pointer) {
  float y = uv.y;
  vec3 surface = mix(vec3(0.56, 0.83, 0.96), vec3(0.20, 0.52, 0.76), depth);   // #8FD3F4 → deeper
  vec3 middle  = mix(vec3(0.24, 0.58, 0.80), vec3(0.10, 0.33, 0.56), depth);
  vec3 deep    = mix(vec3(0.11, 0.37, 0.60), vec3(0.05, 0.18, 0.35), depth);
  vec3 col = mix(deep, middle, smoothstep(0.0, 0.55, y));
  col = mix(col, surface, smoothstep(0.45, 1.05, y));

  float swell = fbm(vec2(p.x * 1.4 + t * 0.035, y * 2.0 - t * 0.045));
  col += vec3(0.03, 0.08, 0.11) * (swell - 0.5);

  // Light rays slanting down from the surface.
  float rx = p.x + (1.0 - y) * 0.32 + pointer.x * 0.04;
  float rays = pow(0.5 + 0.5 * sin(rx * 8.0 + sin(t * 0.12) * 1.4), 7.0);
  rays += pow(0.5 + 0.5 * sin(rx * 4.7 - t * 0.08 + 2.0), 9.0) * 0.8;
  rays *= smoothstep(0.05, 1.0, y) * (1.0 - depth * 0.7);
  col += vec3(0.75, 0.92, 1.0) * rays * 0.16;

  col += vec3(0.8, 0.95, 1.0) * caustic(p + vec2(0.0, t * 0.01), t) * smoothstep(0.4, 1.0, y) * 0.28 * (1.0 - depth * 0.65);

  col += glints(uv, p, t, smoothstep(0.62, 0.05, y)) * sparkle * 1.5;
  return col;
}
`;
