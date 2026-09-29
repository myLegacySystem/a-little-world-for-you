/**
 * Slow drifting motes. Grey dust at first; they take on colour as she
 * arrives, turn into underwater particles in the sea, golden dust in the warm
 * light, and nearly vanish under the night sky.
 *
 * All motion happens in the vertex shader — no per-frame CPU work.
 */

import * as THREE from 'three';

const vertex = /* glsl */ `
attribute vec4 aSeed;
uniform float uTime;
uniform float uPixelRatio;
uniform float uColor;
uniform float uOcean;
uniform float uWarm;
uniform float uNight;
uniform float uFinale;
uniform float uHush;
varying vec3 vColor;
varying float vAlpha;

vec3 pal(float h) {
  vec3 c = mix(vec3(0.60, 0.70, 0.92), vec3(0.72, 0.62, 0.90), smoothstep(0.0, 0.25, h));
  c = mix(c, vec3(0.96, 0.70, 0.80), smoothstep(0.25, 0.5, h));
  c = mix(c, vec3(1.0, 0.88, 0.62), smoothstep(0.5, 0.75, h));
  c = mix(c, vec3(0.68, 0.88, 0.74), smoothstep(0.75, 1.0, h));
  return c;
}

void main() {
  vec3 pos = position;
  float t = uTime;
  // Rise slowly (faster underwater), sway gently, wrap around.
  float speed = (0.015 + aSeed.x * 0.03) * (1.0 + uOcean * 1.5 - uNight * 0.7);
  pos.y = mod(pos.y + t * speed + 6.0, 12.0) - 6.0;
  pos.x += sin(t * (0.1 + aSeed.y * 0.2) + aSeed.z * 6.28) * (0.3 + uOcean * 0.3);
  pos.z += cos(t * (0.08 + aSeed.z * 0.15) + aSeed.y * 6.28) * 0.3;

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mv;
  float size = (1.0 + aSeed.w * 2.4) * (1.0 + uWarm * 0.8 + uFinale * 0.3);
  gl_PointSize = size * uPixelRatio * (24.0 / -mv.z);

  vec3 grey = vec3(0.62, 0.64, 0.70);
  vec3 c = mix(grey, pal(aSeed.z), uColor);
  c = mix(c, vec3(0.62, 0.85, 1.0), uOcean * 0.85);
  c = mix(c, vec3(1.0, 0.84, 0.58), uWarm);
  vColor = c;

  float twinkle = 0.65 + 0.35 * sin(t * (0.5 + aSeed.x) + aSeed.w * 30.0);
  float a = (0.28 + uColor * 0.25 + uOcean * 0.2 + uWarm * 0.25) * twinkle;
  a *= 1.0 - uNight * 0.75;
  a *= 1.0 - uHush * 0.8;
  a *= smoothstep(-12.0, -2.0, mv.z) * smoothstep(-0.5, -2.5, mv.z);
  vAlpha = a;
}
`;

const fragment = /* glsl */ `
precision mediump float;
varying vec3 vColor;
varying float vAlpha;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.0, d);
  a *= a;
  gl_FragColor = vec4(vColor, vAlpha * a);
}
`;

export class ParticleField {
  readonly points: THREE.Points;
  readonly uniforms = {
    uTime: { value: 0 },
    uPixelRatio: { value: 1 },
    uColor: { value: 0 },
    uOcean: { value: 0 },
    uWarm: { value: 0 },
    uNight: { value: 0 },
    uFinale: { value: 0 },
    uHush: { value: 0 },
  };

  constructor(count: number) {
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count * 4);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 2] = -Math.random() * 10 + 1;
      for (let j = 0; j < 4; j++) seeds[i * 4 + j] = Math.random();
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 4));
    const mat = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms: this.uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    this.points = new THREE.Points(geo, mat);
    this.points.frustumCulled = false;
  }

  dispose() {
    this.points.geometry.dispose();
    (this.points.material as THREE.Material).dispose();
  }
}
