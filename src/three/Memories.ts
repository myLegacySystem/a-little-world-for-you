/**
 * Photographs as objects inside the world.
 *
 * Each photo the page marks as `inWorld` becomes a real plane in the scene,
 * placed where its layout box is. It doesn't fade in like a card — it
 * materialises from specks of light, sits on cream print paper with a little
 * grain and a soft shadow, floats very slightly, and leans toward the pointer.
 *
 * Textures load only when a photo comes near the screen, and are disposed when
 * the photo leaves the page.
 */

import * as THREE from 'three';
import { noise } from './noise';
import { worldPhotos, type WorldPhoto } from '../utils/photoAnchor';

const vertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragment = /* glsl */ `
precision highp float;
uniform sampler2D uMap;
uniform float uHasMap;
uniform vec2 uImg;
uniform vec2 uFrame;
uniform float uV;
uniform float uTime;
uniform float uSeed;
varying vec2 vUv;

${noise}

void main() {
  vec2 uv = vUv;
  float aspect = uFrame.x / uFrame.y;

  // Cream print border, the same physical width on every side.
  vec2 b = vec2(0.034, 0.034 * aspect);
  vec2 inner = (uv - b) / (1.0 - 2.0 * b);
  vec2 iuv = inner;

  // Cover-crop the image into the frame.
  float fa = (uFrame.x * (1.0 - 2.0 * b.x)) / (uFrame.y * (1.0 - 2.0 * b.y));
  float ia = uImg.x / uImg.y;
  vec2 c = iuv - 0.5;
  if (ia > fa) c.x *= fa / ia; else c.y *= ia / fa;
  vec3 img = uHasMap > 0.5 ? texture2D(uMap, c + 0.5).rgb : vec3(0.95, 0.9, 0.92);

  // Film: a touch warm, lifted blacks, moving grain, a soft vignette.
  img = img * vec3(1.02, 1.0, 0.97) * 0.94 + 0.035;
  img += (hash(uv * vec2(731.0, 913.0) + fract(uTime * 0.53)) - 0.5) * 0.045;
  img *= 1.0 - 0.16 * pow(length(iuv - 0.5) * 1.3, 2.0);

  bool inside = inner.x > 0.0 && inner.x < 1.0 && inner.y > 0.0 && inner.y < 1.0;
  vec3 paper = vec3(1.0, 0.992, 0.984) - (hash(uv * 300.0) - 0.5) * 0.02;
  vec3 col = inside ? img : paper;

  // Emerging from specks of light: a ragged frontier of glowing grains.
  vec2 g = uv * vec2(aspect, 1.0);
  float n = fbm(g * 4.5 + uSeed) * 0.6 + hash(floor(g * 70.0) + uSeed) * 0.4;
  float edge = uV * 1.35 - 0.2;
  float show = smoothstep(edge + 0.02, edge - 0.07, n);
  float specks = smoothstep(edge + 0.09, edge, n) * (1.0 - show) * step(0.55, hash(floor(g * 70.0) + 3.7));
  vec3 light = mix(vec3(1.0, 0.8, 0.87), vec3(1.0, 0.92, 0.78), hash(floor(g * 70.0)));
  float present = show + specks * 0.9 * step(0.001, uV);
  col = mix(col, light, specks / (present + 1e-3));
  gl_FragColor = vec4(col, present);
}
`;

const shadowFragment = /* glsl */ `
precision mediump float;
uniform float uV;
varying vec2 vUv;
void main() {
  vec2 q = abs(vUv - 0.5) * 2.0;
  float d = length(max(q - vec2(0.8), 0.0));
  float a = (1.0 - smoothstep(0.0, 0.2, d)) * 0.2 * uV * uV;
  gl_FragColor = vec4(0.42, 0.32, 0.38, a);
}
`;

interface Item {
  mesh: THREE.Mesh;
  shadow: THREE.Mesh;
  material: THREE.ShaderMaterial;
  shadowMaterial: THREE.ShaderMaterial;
  texture: THREE.Texture | null;
  loading: boolean;
  url: string;
  v: number;
  seed: number;
}

export class Memories {
  readonly group = new THREE.Group();
  private readonly items = new Map<string, Item>();
  private readonly geometry = new THREE.PlaneGeometry(1, 1);
  private readonly loader = new THREE.TextureLoader();
  private disposed = false;

  constructor() {
    this.loader.setCrossOrigin('anonymous');
  }

  private create(key: string, photo: WorldPhoto): Item {
    const seed = Math.random() * 50;
    const material = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms: {
        uMap: { value: null },
        uHasMap: { value: 0 },
        uImg: { value: new THREE.Vector2(4, 5) },
        uFrame: { value: new THREE.Vector2(4, 5) },
        uV: { value: 0 },
        uTime: { value: 0 },
        uSeed: { value: seed },
      },
      transparent: true,
      depthWrite: false,
    });
    const shadowMaterial = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: shadowFragment,
      uniforms: { uV: { value: 0 } },
      transparent: true,
      depthWrite: false,
    });
    const mesh = new THREE.Mesh(this.geometry, material);
    const shadow = new THREE.Mesh(this.geometry, shadowMaterial);
    mesh.renderOrder = 1;
    shadow.renderOrder = 0;
    this.group.add(shadow, mesh);
    const item: Item = { mesh, shadow, material, shadowMaterial, texture: null, loading: false, url: photo.url, v: 0, seed };
    this.items.set(key, item);
    return item;
  }

  private load(item: Item) {
    item.loading = true;
    this.loader.load(item.url, (texture) => {
      if (this.disposed || !this.has(item)) {
        texture.dispose();
        return;
      }
      texture.colorSpace = THREE.NoColorSpace;
      texture.anisotropy = 4;
      const image = texture.image as { width: number; height: number };
      item.texture = texture;
      item.material.uniforms.uMap.value = texture;
      item.material.uniforms.uHasMap.value = 1;
      item.material.uniforms.uImg.value.set(image.width, image.height);
    });
  }

  private has(item: Item) {
    for (const i of this.items.values()) if (i === item) return true;
    return false;
  }

  private remove(key: string, item: Item) {
    this.group.remove(item.mesh, item.shadow);
    item.material.dispose();
    item.shadowMaterial.dispose();
    item.texture?.dispose();
    this.items.delete(key);
  }

  /**
   * Place every photograph where its layout box is.
   * `toWorld` converts a screen rect to world units on the z = 0 plane.
   */
  update(
    time: number,
    dt: number,
    pointer: THREE.Vector2,
    screenH: number,
    toWorld: (x: number, y: number) => { x: number; y: number; unit: number },
  ) {
    const registry = worldPhotos();
    for (const [key, item] of this.items) if (!registry.has(key)) this.remove(key, item);

    for (const [key, photo] of registry) {
      const item = this.items.get(key) ?? this.create(key, photo);
      const r = photo.el.getBoundingClientRect();
      const near = r.bottom > -screenH * 1.5 && r.top < screenH * 2.5 && r.width > 0;
      if (near && !item.loading) this.load(item);

      item.v += (photo.visible - item.v) * (1 - Math.exp(-dt * 3));
      const on = near && item.v > 0.002;
      item.mesh.visible = on;
      item.shadow.visible = on;
      if (!on) continue;

      // Untransformed size for tilted prints (their on-screen box grows with the tilt).
      const w = photo.tilt ? photo.el.offsetWidth : r.width;
      const h = photo.tilt ? photo.el.offsetHeight : r.height;
      const c = toWorld(r.left + r.width / 2, r.top + r.height / 2);
      const W = w * c.unit;
      const H = h * c.unit;
      const float = Math.sin(time * 0.5 + item.seed) * 0.02;

      item.mesh.position.set(c.x, c.y + float, 0.15);
      item.mesh.scale.set(W, H, 1);
      item.mesh.rotation.set(-pointer.y * 0.09, pointer.x * 0.12, (-photo.tilt * Math.PI) / 180 + Math.sin(time * 0.3 + item.seed) * 0.006);
      item.shadow.position.set(c.x + W * 0.03, c.y + float - H * 0.045, 0.1);
      item.shadow.scale.set(W * 1.1, H * 1.1, 1);
      item.shadow.rotation.copy(item.mesh.rotation);

      const u = item.material.uniforms;
      u.uV.value = item.v;
      u.uTime.value = time;
      u.uFrame.value.set(W, H);
      item.shadowMaterial.uniforms.uV.value = item.v;
    }
  }

  dispose() {
    this.disposed = true;
    for (const [key, item] of this.items) this.remove(key, item);
    this.geometry.dispose();
  }
}
