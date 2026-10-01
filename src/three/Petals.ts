/**
 * A few soft petals drifting down through the warm parts of the story.
 * Instanced quads; the petal shape is drawn in the fragment shader. Only a
 * handful at a time — never a shower.
 */

import * as THREE from 'three';

const vertex = /* glsl */ `
attribute vec3 aStart;
attribute vec4 aSeed;
uniform float uTime;
uniform float uAmount;
varying vec2 vUv;
varying float vShade;
varying float vTint;
varying float vAlpha;

mat3 rotation(vec3 axis, float a) {
  axis = normalize(axis);
  float s = sin(a), c = cos(a), oc = 1.0 - c;
  return mat3(
    oc * axis.x * axis.x + c,          oc * axis.x * axis.y - axis.z * s, oc * axis.z * axis.x + axis.y * s,
    oc * axis.x * axis.y + axis.z * s, oc * axis.y * axis.y + c,          oc * axis.y * axis.z - axis.x * s,
    oc * axis.z * axis.x - axis.y * s, oc * axis.y * axis.z + axis.x * s, oc * axis.z * axis.z + c);
}

void main() {
  vUv = uv;
  float t = uTime;
  float fall = 0.18 + aSeed.x * 0.22;
  vec3 c = aStart;
  c.y = mod(c.y - t * fall + 7.0, 14.0) - 7.0;
  c.x += sin(t * (0.25 + aSeed.y * 0.3) + aSeed.z * 6.283) * 0.8;
  c.z += cos(t * (0.2 + aSeed.x * 0.2) + aSeed.w * 6.283) * 0.4;

  // Flutter: tumble slowly around a tilted axis.
  mat3 R = rotation(vec3(aSeed.y - 0.5, 1.0, aSeed.z - 0.5), t * (0.6 + aSeed.w * 0.8) + aSeed.x * 10.0);
  float size = 0.09 + aSeed.w * 0.09;
  vec3 local = R * (position * vec3(size, size * 1.25, 1.0));
  vec4 mv = modelViewMatrix * vec4(c + local, 1.0);
  gl_Position = projectionMatrix * mv;

  vShade = 0.75 + 0.25 * abs((R * vec3(0.0, 0.0, 1.0)).z);
  vTint = aSeed.z;
  // Only some petals appear at lower amounts; all fade with distance.
  vAlpha = smoothstep(aSeed.x * 0.8, aSeed.x * 0.8 + 0.2, uAmount) * smoothstep(-14.0, -4.0, mv.z);
}
`;

const fragment = /* glsl */ `
precision mediump float;
varying vec2 vUv;
varying float vShade;
varying float vTint;
varying float vAlpha;
void main() {
  vec2 p = vUv - 0.5;
  // A petal: rounded, wider towards the top, with a small notch.
  float w = 0.22 + 0.2 * (p.y + 0.5);
  float d = length(vec2(p.x / w, p.y / 0.5));
  d += 0.25 * smoothstep(0.08, 0.0, abs(p.x)) * smoothstep(0.32, 0.5, p.y);
  float shape = smoothstep(1.0, 0.86, d);
  if (shape < 0.01) discard;
  vec3 blush = vec3(0.97, 0.78, 0.85);
  vec3 cream = vec3(1.0, 0.96, 0.93);
  vec3 col = vTint < 0.6 ? blush : vTint < 0.82 ? vec3(1.0, 0.93, 0.78) : vec3(0.88, 0.83, 0.97);
  col = mix(col, cream, smoothstep(-0.5, 0.45, p.y) * 0.55);
  col *= vShade;
  gl_FragColor = vec4(col, shape * vAlpha * 0.85);
}
`;

export class Petals {
  readonly mesh: THREE.Mesh;
  readonly uniforms = { uTime: { value: 0 }, uAmount: { value: 0 } };

  constructor(count: number) {
    const base = new THREE.PlaneGeometry(1, 1);
    const geo = new THREE.InstancedBufferGeometry();
    geo.index = base.index;
    geo.setAttribute('position', base.attributes.position);
    geo.setAttribute('uv', base.attributes.uv);
    const start = new Float32Array(count * 3);
    const seed = new Float32Array(count * 4);
    for (let i = 0; i < count; i++) {
      start[i * 3] = (Math.random() - 0.5) * 12;
      start[i * 3 + 1] = (Math.random() - 0.5) * 14;
      start[i * 3 + 2] = -Math.random() * 8 + 1.5;
      for (let j = 0; j < 4; j++) seed[i * 4 + j] = Math.random();
    }
    geo.setAttribute('aStart', new THREE.InstancedBufferAttribute(start, 3));
    geo.setAttribute('aSeed', new THREE.InstancedBufferAttribute(seed, 4));
    geo.instanceCount = count;
    const mat = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms: this.uniforms,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    this.mesh = new THREE.Mesh(geo, mat);
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = 6;
    base.dispose();
  }

  dispose() {
    this.mesh.geometry.dispose();
    (this.mesh.material as THREE.Material).dispose();
  }
}
