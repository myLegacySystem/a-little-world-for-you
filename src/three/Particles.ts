/**
 * The particles that carry the story.
 *
 * The same few thousand points change meaning as the journey goes on:
 *   grey dust → they gather into the heart and take on color →
 *   the heart dissolves and they become the sea → they rise and become
 *   stars → they fall away as warm golden dust → and gather into the heart again.
 *
 * Each particle has a home in every state (ambient, heart, sea, sky); the
 * vertex shader blends between them with a per-particle delay, so changes
 * ripple through the swarm instead of happening all at once. No CPU work per
 * frame beyond a few uniforms.
 */

import * as THREE from 'three';
import { sampleHeart } from './heartShape';

const vertex = /* glsl */ `
attribute vec3 aHeart;
attribute vec3 aSea;
attribute vec3 aSky;
attribute vec4 aSeed;

uniform float uTime;
uniform float uPixelRatio;
uniform float uSize;
uniform mat4 uHeartMatrix;
uniform vec3 uHeartCenter;
uniform float uHeart;
uniform float uSea;
uniform float uDepth;
uniform float uStars;
uniform float uColor;
uniform float uWarm;
uniform float uHush;
uniform float uBurst;
uniform float uFinale;
uniform float uDark;

varying vec3 vColor;
varying float vAlpha;
varying float vStar;

// The five colors, a touch deeper than the background so they read on cream.
vec3 palette(float h) {
  if (h < 0.22) return vec3(0.52, 0.80, 0.95);   // sky blue
  if (h < 0.42) return vec3(0.94, 0.62, 0.73);   // soft rose
  if (h < 0.62) return vec3(0.74, 0.66, 0.93);   // lavender
  if (h < 0.80) return vec3(0.99, 0.82, 0.52);   // buttercream / gold
  return vec3(0.60, 0.83, 0.72);                 // mint
}

float stagger(float w, float s) {
  return smoothstep(s * 0.45, s * 0.45 + 0.55, w);
}

void main() {
  float t = uTime;
  float s = aSeed.x;

  // Ambient: slow drifting dust.
  vec3 amb = position;
  amb.y = mod(amb.y + t * (0.025 + 0.045 * aSeed.y) + 7.0, 14.0) - 7.0;
  amb.x += sin(t * (0.08 + 0.12 * aSeed.z) + aSeed.w * 6.283) * 0.35;
  amb.z += cos(t * (0.07 + 0.09 * aSeed.y) + s * 6.283) * 0.25;

  // Heart: a point on the shape, shimmering very slightly.
  vec3 hp = aHeart * (1.0 + 0.025 * sin(t * 1.6 + s * 40.0));
  vec3 heart = (uHeartMatrix * vec4(hp, 1.0)).xyz;

  // Sea: suspended in the water, rising — faster as we sink deeper.
  vec3 sea = aSea;
  sea.y = mod(sea.y + t * (0.05 + 0.1 * aSeed.y) * (1.0 + uDepth * 1.6) + 6.0, 12.0) - 6.0;
  sea.x += sin(t * 0.18 + s * 30.0) * 0.3;

  // Sky: fixed stars, the slowest drift.
  vec3 sky = aSky;
  sky.x += sin(t * 0.01 + s * 6.0) * 0.15;

  float h = stagger(uHeart, s);
  float o = stagger(uSea, s);
  float k = stagger(uStars, aSeed.y);

  vec3 p = mix(amb, heart, h);
  // Dissolving: on the way from heart to sea, drift outward and swirl.
  float leaving = o * (1.0 - o) * 4.0 * uBurst * h;
  vec3 out_ = normalize(heart - uHeartCenter + vec3(1e-4));
  p = mix(p, sea, o);
  p += out_ * leaving * 1.1;
  p.xy += vec2(sin(s * 53.0 + t * 0.7), cos(s * 71.0 + t * 0.6)) * leaving * 0.35;
  // Rising: on the way from sea to sky, float upward first.
  float rising = k * (1.0 - k) * 4.0;
  p = mix(p, sky, k);
  p.y += rising * 1.5 * (1.0 - aSeed.y);

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;

  // Size: dust is soft and varied, the heart is fine glitter, stars are pin-points.
  float persp = 26.0 / max(0.5, -mv.z);
  float size = (0.9 + aSeed.w * 2.4) * persp;
  size = mix(size, (0.55 + aSeed.w * 0.9) * persp, h);
  size = mix(size, (0.9 + aSeed.w * 1.8) * persp, o);
  size = mix(size, 1.6 + pow(aSeed.w, 4.0) * 4.0, k);
  gl_PointSize = size * uPixelRatio * uSize;

  // Color.
  vec3 grey = vec3(0.66, 0.70, 0.75);
  vec3 col = mix(grey, palette(aSeed.z), uColor);
  vec3 rose = mix(vec3(1.0, 0.62, 0.74), vec3(0.98, 0.76, 0.84), aSeed.y);
  vec3 heartCol = aSeed.z < 0.1 ? vec3(0.80, 0.74, 0.96) : aSeed.z < 0.17 ? vec3(0.66, 0.86, 0.96) : rose;
  col = mix(col, mix(grey, heartCol, max(uColor, 0.35)), h);
  col = mix(col, vec3(0.84, 0.95, 1.0), o);
  col = mix(col, aSeed.w > 0.85 ? vec3(1.0, 0.88, 0.72) : vec3(1.0, 0.98, 0.93), k);
  col = mix(col, vec3(0.99, 0.82, 0.55), uWarm * (1.0 - h) * (1.0 - k));
  vColor = col;

  // Opacity.
  float tw = 0.65 + 0.35 * sin(t * (0.5 + aSeed.x * 1.6) + aSeed.w * 40.0);
  float a = mix(0.3, 0.5, uColor);
  a = mix(a, mix(0.8, 0.42, uFinale * 0.5 + step(0.5, uColor) * 0.5), h);
  a = mix(a, 0.65, o);
  a = mix(a, tw, k);
  a *= 1.0 - uHush * 0.75 * (1.0 - h);
  // Fade dust with distance (not stars — they're meant to be far).
  a *= mix(smoothstep(-32.0, -6.0, mv.z), 1.0, k) * smoothstep(-0.4, -1.8, mv.z);
  vAlpha = a;
  vStar = k;
}
`;

const fragment = /* glsl */ `
precision mediump float;
varying vec3 vColor;
varying float vAlpha;
varying float vStar;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float soft = smoothstep(0.5, 0.0, d);
  soft *= soft;
  float star = max(smoothstep(0.22, 0.0, d), soft * 0.3);
  float shape = mix(soft, star, vStar);
  if (shape * vAlpha < 0.004) discard;
  gl_FragColor = vec4(vColor, vAlpha * shape);
}
`;

export class Particles {
  readonly points: THREE.Points;
  readonly uniforms = {
    uTime: { value: 0 },
    uPixelRatio: { value: 1 },
    uSize: { value: 1 },
    uHeartMatrix: { value: new THREE.Matrix4() },
    uHeartCenter: { value: new THREE.Vector3() },
    uHeart: { value: 0 },
    uSea: { value: 0 },
    uDepth: { value: 0 },
    uStars: { value: 0 },
    uColor: { value: 0 },
    uWarm: { value: 0 },
    uHush: { value: 0 },
    uBurst: { value: 0 },
    uFinale: { value: 0 },
    uDark: { value: 0 },
  };

  constructor(count: number) {
    const ambient = new Float32Array(count * 3);
    const sea = new Float32Array(count * 3);
    const sky = new Float32Array(count * 3);
    const seeds = new Float32Array(count * 4);
    for (let i = 0; i < count; i++) {
      ambient[i * 3] = (Math.random() - 0.5) * 18;
      ambient[i * 3 + 1] = (Math.random() - 0.5) * 14;
      ambient[i * 3 + 2] = -Math.random() * 14 + 2;

      sea[i * 3] = (Math.random() - 0.5) * 16;
      sea[i * 3 + 1] = (Math.random() - 0.5) * 12;
      sea[i * 3 + 2] = -Math.random() * 11 + 2;

      // Stars live far away, mostly in the upper sky.
      sky[i * 3] = (Math.random() - 0.5) * 52;
      sky[i * 3 + 1] = -5 + Math.pow(Math.random(), 0.7) * 19;
      sky[i * 3 + 2] = -16 - Math.random() * 10;

      for (let j = 0; j < 4; j++) seeds[i * 4 + j] = Math.random();
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(ambient, 3));
    geo.setAttribute('aHeart', new THREE.BufferAttribute(sampleHeart(count), 3));
    geo.setAttribute('aSea', new THREE.BufferAttribute(sea, 3));
    geo.setAttribute('aSky', new THREE.BufferAttribute(sky, 3));
    geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 4));
    const mat = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms: this.uniforms,
      transparent: true,
      depthWrite: false,
    });
    this.points = new THREE.Points(geo, mat);
    this.points.frustumCulled = false;
    this.points.renderOrder = 5;
  }

  dispose() {
    this.points.geometry.dispose();
    (this.points.material as THREE.Material).dispose();
  }
}
