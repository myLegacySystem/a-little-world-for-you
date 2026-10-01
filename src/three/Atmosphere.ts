/**
 * Everything behind the particles: one full-screen shader that becomes each
 * part of the world in turn.
 *
 *   colorless paper → watercolor blooming from the heart, one hue at a time
 *   (blue, blush, lavender, buttercream, mint, warm light) → the sea rising
 *   over everything → deep water → twilight sky → dawn and warm light →
 *   a paler, quieter morning → every color together.
 */

import * as THREE from 'three';
import { noise } from './noise';
import { ocean } from './ocean';

const vertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const fragment = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform float uTime;
uniform float uAspect;
uniform vec2 uPointer;
uniform vec2 uHeartUv;
uniform float uColor;
uniform float uOcean;
uniform float uDepth;
uniform float uSparkle;
uniform float uNight;
uniform float uWarm;
uniform float uHush;
uniform float uFinale;
uniform float uGlass;

${noise}
${ocean}

const vec3 CREAM  = vec3(1.0, 0.976, 0.961);   // #FFF9F5
const vec3 BABY   = vec3(0.749, 0.906, 0.969); // #BFE7F7
const vec3 SKY    = vec3(0.561, 0.827, 0.957); // #8FD3F4
const vec3 BLUSH  = vec3(0.969, 0.784, 0.847); // #F7C8D8
const vec3 ROSE   = vec3(0.937, 0.663, 0.753); // #EFA9C0
const vec3 LAV    = vec3(0.863, 0.812, 0.961); // #DCCFF5
const vec3 BUTTER = vec3(1.0, 0.941, 0.780);   // #FFF0C7
const vec3 MINT   = vec3(0.804, 0.922, 0.867); // #CDEBDD

vec2 aspectP(vec2 uv) { return vec2((uv.x - 0.5) * uAspect, uv.y - 0.5); }

// One wash of watercolor. It is born at the heart and drifts out to its own
// part of the sky as it grows, ragged and slightly pooled at its edge.
vec3 wash(vec3 col, vec2 p, vec2 heart, vec2 home, vec3 hue, float amount, float seed, float t) {
  if (amount <= 0.0) return col;
  vec2 c = heart + home * smoothstep(0.0, 1.0, amount);
  float radius = amount * (0.22 + 0.62 * amount);
  float d = length(p - c) + (fbm(p * 2.1 + seed * 7.3 + t * 0.015) - 0.5) * 0.42;
  float m = smoothstep(radius, radius - 0.34, d);
  float edge = m * (1.0 - m) * 4.0;
  float grain = 0.85 + 0.25 * fbm(p * 9.0 + seed);
  col = mix(col, hue, m * 0.72 * grain);
  col = mix(col, hue * 0.93, edge * 0.14);
  return col;
}

vec3 watercolor(vec3 col, vec2 p, vec2 heart, float c, float t) {
  // Baby blue first, then blush, lavender, buttercream, mint.
  float k = c * 1.55;
  float wide = 0.5 * uAspect;
  col = wash(col, p, heart, vec2(-wide * 0.85, 0.2), BABY,   clamp(k - 0.00, 0.0, 1.0), 1.0, t);
  col = wash(col, p, heart, vec2(wide * 0.8, -0.02), BLUSH,  clamp(k - 0.12, 0.0, 1.0), 2.0, t);
  col = wash(col, p, heart, vec2(-wide * 0.55, -0.42), LAV,  clamp(k - 0.24, 0.0, 1.0), 3.0, t);
  col = wash(col, p, heart, vec2(wide * 0.55, 0.42), BUTTER, clamp(k - 0.36, 0.0, 1.0), 4.0, t);
  col = wash(col, p, heart, vec2(wide * 0.15, -0.55), MINT,  clamp(k - 0.46, 0.0, 1.0), 5.0, t);
  return col;
}

void main() {
  vec2 uv = vUv;
  vec2 p = aspectP(uv);
  vec2 heart = aspectP(uHeartUv);
  float t = uTime;

  // 1. Before: pale, almost colorless paper with a slow mist.
  vec3 paper = mix(vec3(0.945, 0.945, 0.94), vec3(0.925, 0.937, 0.95), uv.y);
  paper += (fbm(p * 1.4 + t * 0.008) - 0.5) * 0.025;
  vec3 col = mix(paper, CREAM, uColor);

  // 2. Color arrives as watercolor, blooming out from the heart.
  col = watercolor(col, p, heart, uColor, t);
  // Warm light around the heart once it's there.
  float dh = length(p - heart);
  col += vec3(1.0, 0.93, 0.9) * exp(-dh * dh * 6.0) * uGlass * 0.12;

  // 3. The sea, rising from below until it's everywhere.
  if (uOcean > 0.001) {
    float line = mix(-0.12, 1.22, uOcean) + sin(p.x * 3.2 + t * 0.7) * 0.012 + (fbm(vec2(p.x * 2.0, t * 0.1)) - 0.5) * 0.05;
    float under = smoothstep(line + 0.012, line - 0.012, uv.y);
    // Above the water, the air turns to soft sky blue.
    vec3 air = mix(col, mix(BABY, CREAM, smoothstep(0.4, 1.0, uv.y) * 0.5), smoothstep(0.0, 0.5, uOcean) * 0.7);
    vec3 sea = oceanColor(uv, p, t, uDepth, uSparkle, uPointer);
    col = mix(air, sea, under);
    // The bright meniscus where the surface is.
    col += vec3(1.0) * exp(-abs(uv.y - line) * 140.0) * 0.35 * step(0.001, uOcean) * step(uOcean, 0.999);
  }

  // 4. Twilight: the sea has become sky.
  if (uNight > 0.001) {
    vec3 n = mix(vec3(0.95, 0.75, 0.82), vec3(0.72, 0.65, 0.88), smoothstep(0.0, 0.22, uv.y));
    n = mix(n, vec3(0.26, 0.29, 0.56), smoothstep(0.18, 0.6, uv.y));
    n = mix(n, vec3(0.10, 0.13, 0.32), smoothstep(0.55, 1.0, uv.y));
    n += LAV * pow(fbm(p * 1.3 + vec2(t * 0.004, 0.0)), 3.0) * 0.18 * smoothstep(0.2, 0.8, uv.y);
    col = mix(col, n, uNight);
  }

  // 5. Warm light: dawn cream, buttercream sun, blush pooling.
  if (uWarm > 0.001) {
    vec3 w = mix(mix(CREAM, BLUSH, 0.25), CREAM, smoothstep(0.0, 0.7, uv.y));
    vec2 sun = vec2(0.42 * uAspect + 0.05 * sin(t * 0.05), 0.32 + 0.03 * sin(t * 0.07));
    w = mix(w, BUTTER, exp(-length(p - sun) * 1.8) * 0.9);
    w += vec3(1.0, 0.95, 0.85) * exp(-length(p - sun) * 5.0) * 0.12;
    vec2 pool = vec2(-0.45 * uAspect + 0.06 * cos(t * 0.04), -0.32);
    w = mix(w, BLUSH, exp(-length(p - pool) * 2.2) * 0.6);
    w = mix(w, MINT, exp(-length(p - vec2(0.3 * uAspect, -0.5)) * 3.0) * 0.25);
    w += (fbm(p * 2.0 + t * 0.02) - 0.5) * 0.03;
    col = mix(col, w, uWarm);
  }

  // 6. Hush: a pale lavender morning, very still.
  if (uHush > 0.001) {
    vec3 h = mix(vec3(0.99, 0.94, 0.95), vec3(0.94, 0.92, 0.98), uv.y);
    h += (fbm(p * 1.2 + t * 0.006) - 0.5) * 0.02;
    col = mix(col, h, uHush * 0.85);
  }

  // 7. Finale: every color the story gathered, around the heart.
  if (uFinale > 0.001) {
    vec3 f = mix(CREAM, mix(BABY, CREAM, 0.4), smoothstep(0.3, 1.0, uv.y));
    f = watercolor(f, p * 0.85, heart * 0.85, 0.95 + 0.04 * sin(t * 0.1), t * 0.6);
    f = mix(f, BUTTER, exp(-dh * 2.2) * 0.5);
    f += vec3(1.0, 0.95, 0.92) * exp(-dh * dh * 5.0) * 0.18;
    // A memory of the sea along the bottom, and of the stars above.
    f = mix(f, mix(SKY, BABY, 0.5), smoothstep(0.16, 0.0, uv.y) * (0.35 + 0.08 * sin(p.x * 4.0 + t * 0.5)));
    f += vec3(1.0, 0.86, 0.62) * twinkles(p, t, smoothstep(0.55, 1.0, uv.y)) * 0.55;
    col = mix(col, f, uFinale);
  }

  // Soft vignette + a whisper of grain, like printed paper.
  col *= 1.0 - 0.07 * pow(length(uv - 0.5) * 1.3, 2.0);
  col += (hash(uv * 911.0 + fract(t * 0.37)) - 0.5) * 0.022;
  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;

export class Atmosphere {
  readonly mesh: THREE.Mesh;
  readonly uniforms = {
    uTime: { value: 0 },
    uAspect: { value: 1 },
    uPointer: { value: new THREE.Vector2() },
    uHeartUv: { value: new THREE.Vector2(0.5, 0.6) },
    uColor: { value: 0 },
    uOcean: { value: 0 },
    uDepth: { value: 0 },
    uSparkle: { value: 0 },
    uNight: { value: 0 },
    uWarm: { value: 0 },
    uHush: { value: 0 },
    uFinale: { value: 0 },
    uGlass: { value: 0 },
  };

  constructor() {
    const material = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms: this.uniforms,
      depthWrite: false,
      depthTest: false,
    });
    this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    this.mesh.frustumCulled = false;
  }

  dispose() {
    this.mesh.geometry.dispose();
    (this.mesh.material as THREE.Material).dispose();
  }
}
