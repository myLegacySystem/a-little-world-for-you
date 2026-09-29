/**
 * The sea — being drawn into her eyes.
 *
 * GLSL used by the Atmosphere shader: a deep blue gradient, slow light rays
 * from the surface, caustics swaying, and (for the quote) stars reflected on
 * the water as tiny glints.
 */
export const ocean = /* glsl */ `
float caustic(vec2 p, float t) {
  float c = 0.0;
  vec2 q = p * 3.2;
  for (int i = 0; i < 3; i++) {
    q += vec2(sin(q.y * 1.3 + t * 0.35), cos(q.x * 1.1 - t * 0.3)) * 0.45;
    c += abs(sin(q.x + q.y));
  }
  return pow(1.0 - c / 3.0, 5.0);
}

vec3 oceanShimmer(vec2 uv, vec2 p, float t) {
  // Soft glints on a slowly rippling grid — stars reflected on water.
  vec2 q = vec2(p.x * 26.0 + sin(uv.y * 24.0 + t * 0.5) * 0.35, uv.y * 40.0);
  vec2 cell = floor(q);
  vec2 f = fract(q) - 0.5;
  float h = hash(cell);
  vec2 off = vec2(hash(cell + 3.1), hash(cell + 7.7)) - 0.5;
  vec2 dd = (f - off * 0.6) * vec2(1.0, 1.6);
  float glint = exp(-dot(dd, dd) * 90.0);
  float tw = pow(max(0.0, sin(t * (0.5 + h * 1.2) + h * 40.0)), 10.0);
  float band = smoothstep(0.6, 0.08, uv.y);
  return vec3(0.85, 0.92, 1.0) * glint * step(0.82, h) * tw * band;
}

vec3 oceanColor(vec2 uv, vec2 p, float t, float depth, float sparkle, vec2 pointer) {
  float y = uv.y;
  vec3 deep = mix(vec3(0.004, 0.035, 0.085), vec3(0.0, 0.015, 0.045), depth);
  vec3 shallow = mix(vec3(0.05, 0.28, 0.46), vec3(0.02, 0.12, 0.25), depth);
  vec3 col = mix(deep, shallow, pow(y, 1.6 + depth * 1.5));

  // Slow swell.
  float swell = fbm(vec2(p.x * 1.5 + t * 0.04, y * 2.0 - t * 0.05));
  col += vec3(0.02, 0.07, 0.11) * (swell - 0.5);

  // Light rays from the surface, fading as we sink.
  float rx = p.x + (1.0 - y) * 0.35 + pointer.x * 0.05;
  float rays = 0.0;
  rays += pow(0.5 + 0.5 * sin(rx * 9.0 + sin(t * 0.13) * 1.5), 8.0);
  rays += pow(0.5 + 0.5 * sin(rx * 5.3 - t * 0.09 + 2.0), 10.0) * 0.8;
  rays *= smoothstep(0.1, 1.0, y) * (1.0 - depth * 0.75);
  col += vec3(0.30, 0.55, 0.70) * rays * 0.18;

  // Caustic light near the top.
  col += vec3(0.35, 0.65, 0.80) * caustic(p + vec2(0.0, t * 0.01), t) * smoothstep(0.45, 1.0, y) * 0.22 * (1.0 - depth * 0.6);

  // Stars reflected on water.
  col += oceanShimmer(uv, p, t) * sparkle * 1.4;
  col += vec3(0.5, 0.6, 0.9) * sparkle * 0.04 * smoothstep(0.7, 0.0, y);
  return col;
}
`;
