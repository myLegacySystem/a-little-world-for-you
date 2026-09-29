/**
 * The sky/water/light behind everything: one full-screen shader that blends
 * between the moods of the journey.
 *
 *   grey stillness → ink-like colour spreading from one small light →
 *   deep ocean (with light rays and caustics) → stars on water →
 *   warm golden light → night sky → all of it together.
 */

import * as THREE from 'three';
import { noise } from './shaders/noise';
import { ocean } from './Ocean';

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
uniform vec2 uLightPos;
uniform float uColor;
uniform float uLight;
uniform float uOcean;
uniform float uDepth;
uniform float uSparkle;
uniform float uWarm;
uniform float uNight;
uniform float uFinale;

${noise}
${ocean}

// Palette — soft blue, muted violet, gentle pink, warm yellow, subtle green.
const vec3 BLUE   = vec3(0.49, 0.60, 0.80);
const vec3 VIOLET = vec3(0.58, 0.50, 0.76);
const vec3 PINK   = vec3(0.86, 0.60, 0.69);
const vec3 YELLOW = vec3(0.93, 0.80, 0.56);
const vec3 GREEN  = vec3(0.58, 0.77, 0.64);

vec3 palette(vec2 p, float t) {
  float a = fbm(p * 1.3 + vec2(t * 0.02, -t * 0.015));
  float b = fbm(p * 1.1 + vec2(-t * 0.017, t * 0.021) + 5.2);
  vec3 c = mix(BLUE, VIOLET, smoothstep(0.3, 0.7, a));
  c = mix(c, PINK, smoothstep(0.45, 0.75, b));
  c = mix(c, YELLOW, smoothstep(0.55, 0.8, a * b * 1.9));
  c = mix(c, GREEN, smoothstep(0.62, 0.85, 1.0 - b) * 0.6);
  return c;
}

void main() {
  vec2 uv = vUv;
  vec2 p = vec2((uv.x - 0.5) * uAspect, uv.y - 0.5);
  float t = uTime;

  // 1. Before: near-monochrome, the faintest slow haze.
  vec3 col = mix(vec3(0.063, 0.067, 0.086), vec3(0.090, 0.098, 0.137), uv.y);
  col += (fbm(p * 1.6 + t * 0.01) - 0.5) * 0.035;

  // 2. Colour arriving like ink in water, spreading out from the first light.
  vec2 lp = vec2((uLightPos.x - 0.5) * uAspect, uLightPos.y - 0.5);
  float d = length(p - lp);
  float edge = fbm(p * 2.2 + vec2(t * 0.03, t * 0.02)) - 0.5;
  float radius = uColor * (0.25 + 1.3 * uColor);
  float ink = smoothstep(radius + 0.08, radius - 0.35, d + edge * 0.55);
  vec3 bloom = palette(p + uPointer * 0.05, t) * (0.34 + 0.12 * fbm(p * 3.0 - t * 0.02));
  col = mix(col, bloom, ink * min(1.0, uColor * 1.6));

  // The light itself: a small glowing point that grows into a field.
  float glow = exp(-d * d / (0.0015 + 0.09 * uLight * uLight)) * uLight;
  col += vec3(1.0, 0.92, 0.80) * glow * 0.55;
  col += vec3(0.95, 0.85, 0.75) * exp(-d * 18.0) * uLight * 0.35;

  // 3. Ocean.
  if (uOcean > 0.001) {
    vec3 sea = oceanColor(uv, p, t, uDepth, uSparkle, uPointer);
    col = mix(col, sea, uOcean);
  }

  // 4. Warm light — cream, peach and soft gold pooling slowly.
  if (uWarm > 0.001) {
    vec3 w = mix(vec3(0.22, 0.14, 0.11), vec3(0.40, 0.27, 0.19), uv.y);
    vec2 s1 = vec2(0.55 * uAspect * sin(t * 0.05), 0.35 + 0.05 * sin(t * 0.07));
    vec2 s2 = vec2(-0.4 * uAspect * cos(t * 0.04), -0.1 + 0.08 * cos(t * 0.06));
    w += vec3(0.98, 0.78, 0.55) * exp(-length(p - s1) * 2.4) * 0.45;
    w += vec3(0.96, 0.66, 0.58) * exp(-length(p - s2) * 2.8) * 0.3;
    w += vec3(1.0, 0.92, 0.78) * (fbm(p * 2.0 + t * 0.03) - 0.4) * 0.12;
    col = mix(col, w, uWarm);
  }

  // 5. Night sky (the stars themselves are particles drawn on top).
  if (uNight > 0.001) {
    vec3 n = mix(vec3(0.020, 0.028, 0.070), vec3(0.055, 0.075, 0.160), uv.y);
    n += vec3(0.30, 0.25, 0.45) * pow(fbm(p * 1.4 + vec2(t * 0.004, 0.0)), 3.0) * 0.35;
    n += vec3(0.9, 0.7, 0.5) * exp(-length(p - vec2(0.0, -0.75)) * 2.2) * 0.06;
    col = mix(col, n, uNight);
  }

  // 6. Finale: the whole palette, living together, low and warm.
  if (uFinale > 0.001) {
    vec3 f = mix(vec3(0.035, 0.045, 0.10), vec3(0.09, 0.08, 0.16), uv.y);
    vec3 pal = palette(p * 0.9 + uPointer * 0.04, t * 1.2);
    float veil = smoothstep(0.35, 0.9, fbm(p * 1.2 + vec2(t * 0.012, -t * 0.01)));
    f = mix(f, pal * 0.42, veil * 0.75);
    f += vec3(1.0, 0.85, 0.7) * exp(-length(p - vec2(0.0, 0.05)) * 2.0) * 0.12;
    f += oceanShimmer(uv, p, t) * 0.25;
    col = mix(col, f, uFinale);
  }

  // Vignette + a touch of grain so the gradients stay silky.
  col *= 1.0 - 0.35 * pow(length(uv - 0.5) * 1.25, 2.2);
  col += (hash(uv * 911.0 + fract(t * 0.3)) - 0.5) * 0.018;
  gl_FragColor = vec4(max(col, 0.0), 1.0);
}
`;

export class Atmosphere {
  readonly mesh: THREE.Mesh;
  readonly uniforms = {
    uTime: { value: 0 },
    uAspect: { value: 1 },
    uPointer: { value: new THREE.Vector2() },
    uLightPos: { value: new THREE.Vector2(0.5, 0.56) },
    uColor: { value: 0 },
    uLight: { value: 0 },
    uOcean: { value: 0 },
    uDepth: { value: 0 },
    uSparkle: { value: 0 },
    uWarm: { value: 0 },
    uNight: { value: 0 },
    uFinale: { value: 0 },
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
