/**
 * The heart. 🩷
 *
 * Soft pink glass: translucent body, a faint lavender / baby-blue sheen at
 * the edges, a gentle inner glow and a few tiny sparkles orbiting it. It
 * breathes very slightly and sways — never spins.
 */

import * as THREE from 'three';
import { HEART_CENTER_Y, HEART_NORMALISE, heartRadius } from './heartShape';

const glassVertex = /* glsl */ `
varying vec3 vNormal;
varying vec3 vView;
varying vec3 vLocal;
void main() {
  vLocal = position;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vView = normalize(-mv.xyz);
  vNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * mv;
}
`;

const glassFragment = /* glsl */ `
precision highp float;
uniform float uOpacity;
uniform float uTime;
uniform float uGlow;
uniform float uBack;
varying vec3 vNormal;
varying vec3 vView;
varying vec3 vLocal;

const vec3 ROSE   = vec3(1.0, 0.714, 0.788);   // #FFB6C9
const vec3 BLUSH  = vec3(0.969, 0.784, 0.847); // #F7C8D8
const vec3 PETAL  = vec3(1.0, 0.839, 0.886);   // #FFD6E2
const vec3 LAVEND = vec3(0.863, 0.812, 0.961); // #DCCFF5
const vec3 BABY   = vec3(0.749, 0.906, 0.969); // #BFE7F7

void main() {
  vec3 N = normalize(vNormal);
  if (uBack > 0.5) N = -N;
  vec3 V = normalize(vView);
  float facing = clamp(dot(N, V), 0.0, 1.0);
  float fres = pow(1.0 - facing, 2.4);

  // Light: one soft key from the upper left.
  vec3 L = normalize(vec3(-0.45, 0.75, 0.55));
  float diffuse = clamp(dot(N, L) * 0.5 + 0.5, 0.0, 1.0);

  // Body: rose in shadow, petal pink where the light falls.
  vec3 body = mix(mix(ROSE, LAVEND, 0.18), PETAL, diffuse);
  body = mix(body, BLUSH, 0.2 + 0.1 * sin(uTime * 0.4 + vLocal.x * 3.0));

  // A soft sheen that drifts between lavender and baby blue at the edges.
  float drift = 0.5 + 0.5 * sin(fres * 5.0 + vLocal.x * 2.4 - vLocal.y * 1.6 + uTime * 0.25);
  vec3 sheen = mix(mix(LAVEND, BABY, drift), vec3(1.0), 0.3);
  vec3 col = mix(body, sheen, smoothstep(0.3, 0.95, fres) * 0.75);

  vec3 H = normalize(L + V);
  float spec = pow(max(dot(N, H), 0.0), 80.0);
  float soft = pow(max(dot(N, H), 0.0), 10.0);
  // A second, smaller highlight from the lower right, like a window reflection.
  float spec2 = pow(max(dot(N, normalize(normalize(vec3(0.6, -0.3, 0.7)) + V)), 0.0), 120.0);
  col += vec3(1.0) * (spec * 1.1 + spec2 * 0.5 + soft * 0.1);
  // A thin bright rim, as light catches the edge of glass.
  col += vec3(1.0, 0.97, 0.99) * pow(fres, 5.0) * 0.55;

  // Inner glow, as if lit from inside.
  col += vec3(1.0, 0.88, 0.92) * pow(facing, 3.0) * (0.1 + uGlow * 0.15);

  float alpha = (0.44 + 0.46 * fres + spec * 0.6 + spec2 * 0.3) * uOpacity;
  if (uBack > 0.5) { col = mix(col, ROSE * 0.92, 0.5); alpha *= 0.5; }
  gl_FragColor = vec4(col, alpha);
}
`;

const glowVertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const glowFragment = /* glsl */ `
precision mediump float;
uniform float uOpacity;
uniform float uGlow;
varying vec2 vUv;
void main() {
  float d = length(vUv - 0.5) * 2.0;
  float g = exp(-d * d * 3.2) * (0.38 + uGlow * 0.12);
  vec3 col = mix(vec3(1.0, 0.86, 0.9), vec3(1.0, 0.72, 0.8), d);
  gl_FragColor = vec4(col, g * uOpacity);
}
`;

const orbitVertex = /* glsl */ `
attribute vec4 aOrbit;
uniform float uTime;
uniform float uPixelRatio;
varying float vTw;
void main() {
  float a = aOrbit.x + uTime * (0.12 + aOrbit.y * 0.18);
  float r = 0.62 + aOrbit.z * 0.32;
  vec3 p = vec3(cos(a) * r, sin(a * 1.3 + aOrbit.w * 6.0) * 0.12, sin(a) * r * 0.55);
  // Tilt each little orbit differently.
  float t = aOrbit.w * 1.4 - 0.7;
  p = vec3(p.x, p.y * cos(t) - p.z * sin(t), p.y * sin(t) + p.z * cos(t));
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  vTw = 0.55 + 0.45 * sin(uTime * (1.0 + aOrbit.y * 2.0) + aOrbit.x * 20.0);
  gl_PointSize = (1.5 + aOrbit.z * 2.0) * uPixelRatio * (6.0 / -mv.z);
}
`;

const orbitFragment = /* glsl */ `
precision mediump float;
uniform float uOpacity;
varying float vTw;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float core = smoothstep(0.5, 0.0, d);
  vec3 col = mix(vec3(1.0, 0.78, 0.86), vec3(1.0), core * core);
  gl_FragColor = vec4(col, core * vTw * uOpacity * 0.9);
}
`;

function buildGeometry(detail: number) {
  const geo = new THREE.SphereGeometry(1, detail, Math.round(detail * 0.75));
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i).normalize();
    const r = heartRadius(v.x, v.y, v.z);
    pos.setXYZ(i, v.x * r * HEART_NORMALISE, (v.y * r - HEART_CENTER_Y) * HEART_NORMALISE, v.z * r * HEART_NORMALISE);
  }
  geo.computeVertexNormals();
  return geo;
}

export class Heart {
  readonly group = new THREE.Group();
  /** Rotates/breathes; particles forming the heart follow this matrix. */
  readonly body = new THREE.Group();
  private readonly materials: THREE.ShaderMaterial[] = [];
  private readonly geometries: THREE.BufferGeometry[] = [];
  private readonly shared = {
    uOpacity: { value: 0 },
    uTime: { value: 0 },
    uGlow: { value: 0 },
    uPixelRatio: { value: 1 },
  };

  constructor(lite: boolean, pixelRatio: number) {
    this.shared.uPixelRatio.value = pixelRatio;
    const geo = buildGeometry(lite ? 96 : 150);
    this.geometries.push(geo);

    const makeGlass = (back: boolean) => {
      const m = new THREE.ShaderMaterial({
        vertexShader: glassVertex,
        fragmentShader: glassFragment,
        uniforms: { ...this.shared, uBack: { value: back ? 1 : 0 } },
        transparent: true,
        depthWrite: false,
        side: back ? THREE.BackSide : THREE.FrontSide,
      });
      this.materials.push(m);
      return m;
    };
    const back = new THREE.Mesh(geo, makeGlass(true));
    const front = new THREE.Mesh(geo, makeGlass(false));
    back.renderOrder = 2;
    front.renderOrder = 3;

    const glowGeo = new THREE.PlaneGeometry(2.6, 2.6);
    this.geometries.push(glowGeo);
    const glowMat = new THREE.ShaderMaterial({
      vertexShader: glowVertex,
      fragmentShader: glowFragment,
      uniforms: this.shared,
      transparent: true,
      depthWrite: false,
    });
    this.materials.push(glowMat);
    const glow = new THREE.Mesh(glowGeo, glowMat);
    glow.position.z = -0.35;
    glow.renderOrder = 1;

    const count = lite ? 40 : 70;
    const orbit = new Float32Array(count * 4);
    for (let i = 0; i < orbit.length; i++) orbit[i] = Math.random();
    const orbitGeo = new THREE.BufferGeometry();
    orbitGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    orbitGeo.setAttribute('aOrbit', new THREE.BufferAttribute(orbit, 4));
    this.geometries.push(orbitGeo);
    const orbitMat = new THREE.ShaderMaterial({
      vertexShader: orbitVertex,
      fragmentShader: orbitFragment,
      uniforms: this.shared,
      transparent: true,
      depthWrite: false,
    });
    this.materials.push(orbitMat);
    const sparkles = new THREE.Points(orbitGeo, orbitMat);
    sparkles.frustumCulled = false;
    sparkles.renderOrder = 4;

    this.body.add(back, front);
    this.group.add(glow, this.body, sparkles);
    this.group.visible = false;
  }

  update(time: number, opacity: number, glow: number, sway: number, burst: number) {
    this.shared.uTime.value = time;
    this.shared.uOpacity.value = opacity;
    this.shared.uGlow.value = glow;
    this.group.visible = opacity > 0.003;
    // Breathing: barely there — a slow inhale, a slower exhale.
    const breath = 1 + 0.018 * Math.sin(time * 1.05) + 0.006 * Math.sin(time * 2.1) + glow * 0.012;
    // As it dissolves, it opens up slightly into the particles.
    const open = 1 + burst * (1 - opacity) * 0.18;
    this.body.scale.setScalar(breath * open);
    this.body.rotation.y = Math.sin(time * 0.21) * 0.55 + sway;
    this.body.rotation.x = Math.sin(time * 0.17) * 0.08 - 0.05;
    this.body.rotation.z = Math.sin(time * 0.13) * 0.04;
  }

  dispose() {
    this.geometries.forEach((g) => g.dispose());
    this.materials.forEach((m) => m.dispose());
  }
}
