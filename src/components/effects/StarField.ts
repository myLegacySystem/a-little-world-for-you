/**
 * The night sky: a dome of small stars, each twinkling at its own pace.
 * A few warmer ones are slightly larger.
 */

import * as THREE from 'three';

const vertex = /* glsl */ `
attribute vec3 aSeed;
uniform float uTime;
uniform float uPixelRatio;
uniform float uVisible;
uniform float uHush;
varying float vAlpha;
varying vec3 vColor;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  float big = step(0.96, aSeed.x);
  gl_PointSize = (1.0 + aSeed.y * 1.6 + big * 2.2) * uPixelRatio;
  float tw = 0.55 + 0.45 * sin(uTime * (0.4 + aSeed.z * 1.6) + aSeed.x * 50.0);
  // Appear one by one rather than all at once.
  float appear = smoothstep(aSeed.y * 0.8, aSeed.y * 0.8 + 0.2, uVisible);
  // In the quiet moment most stars step back.
  float quiet = mix(1.0, step(0.55, aSeed.z) * 0.6, uHush);
  vAlpha = tw * appear * quiet * (0.55 + big * 0.45);
  vColor = mix(vec3(0.85, 0.9, 1.0), vec3(1.0, 0.86, 0.66), big + step(0.8, aSeed.z) * 0.5);
}
`;

const fragment = /* glsl */ `
precision mediump float;
varying float vAlpha;
varying vec3 vColor;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.05, d);
  gl_FragColor = vec4(vColor, vAlpha * a);
}
`;

export class StarField {
  readonly points: THREE.Points;
  readonly uniforms = {
    uTime: { value: 0 },
    uPixelRatio: { value: 1 },
    uVisible: { value: 0 },
    uHush: { value: 0 },
  };

  constructor(count: number) {
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 1] = (Math.random() - 0.35) * 40;
      positions[i * 3 + 2] = -18 - Math.random() * 10;
      seeds[i * 3] = Math.random();
      seeds[i * 3 + 1] = Math.random();
      seeds[i * 3 + 2] = Math.random();
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 3));
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
