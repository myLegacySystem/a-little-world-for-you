import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { audioEngine } from '../audio/audioEngine';
import { SCENES } from '../scenes/config';
import { lite, reducedMotion, supportsWebGL } from '../utils/device';
import { getHeartAnchor } from '../utils/heartAnchor';
import { getJourney, onJourney } from '../utils/scroll';
import { Atmosphere } from './Atmosphere';
import { Heart } from './Heart';
import { Particles } from './Particles';
import { Petals } from './Petals';
import { easeWorld, worldAt, type WorldState } from './timeline';

const CAMERA_Z = 6;
const FOV = 40;

/**
 * The living world behind every scene: one WebGL canvas. Scenes never talk to
 * it directly — it follows the journey position and eases towards the mood in
 * timeline.ts, and it places the heart wherever the current scene's layout put
 * a <HeartAnchor>.
 */
export function World() {
  const ref = useRef<HTMLDivElement>(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    if (!supportsWebGL()) {
      setFallback(true);
      return;
    }

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: !lite, alpha: false, powerPreference: 'high-performance' });
    } catch {
      setFallback(true);
      return;
    }
    const pixelRatio = Math.min(window.devicePixelRatio || 1, lite ? 1.5 : 2);
    renderer.setPixelRatio(pixelRatio);
    renderer.autoClear = false;
    host.appendChild(renderer.domElement);

    // Background (screen-space) and world (perspective) are drawn in turn.
    const bgScene = new THREE.Scene();
    const bgCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const atmosphere = new Atmosphere();
    bgScene.add(atmosphere.mesh);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 80);
    camera.position.set(0, 0, CAMERA_Z);

    const heart = new Heart(lite, pixelRatio);
    const particles = new Particles(reducedMotion ? 1600 : lite ? 2600 : 5200);
    const petals = new Petals(lite ? 26 : 46);
    particles.uniforms.uPixelRatio.value = pixelRatio;
    scene.add(heart.group, particles.points, petals.mesh);

    let width = 1;
    let height = 1;
    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      atmosphere.uniforms.uAspect.value = width / height;
      // Phones: slightly larger particles so they read on a small screen.
      particles.uniforms.uSize.value = width < 700 ? 1.15 : 1;
    };
    resize();
    window.addEventListener('resize', resize);

    // Desktop only: the world leans very slightly towards the pointer.
    const pointer = new THREE.Vector2();
    const pointerTarget = new THREE.Vector2();
    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      pointerTarget.set((e.clientX / width) * 2 - 1, -((e.clientY / height) * 2 - 1));
    };
    if (!reducedMotion) window.addEventListener('pointermove', onPointer, { passive: true });

    const state: WorldState = worldAt(getJourney());

    let target = worldAt(getJourney());
    const offJourney = onJourney((pos) => {
      target = worldAt(pos);
    });

    // Where the heart is going (world units), eased towards each frame.
    const heartPos = new THREE.Vector3(0, 0.6, 0);
    const heartGoal = heartPos.clone();
    let heartScale = 1.2;
    let heartScaleGoal = heartScale;
    // `?debug` in the URL exposes the live state for inspection.
    if (location.search.includes('debug')) Object.assign(window, { __world: { state, heartPos, getJourney } });
    const visibleHeight = 2 * Math.tan((FOV * Math.PI) / 360) * CAMERA_Z;
    const rectToWorld = (el: HTMLElement) => {
      const r = el.getBoundingClientRect();
      // Ignore anchors far off-screen (e.g. mid-jump, before scroll updates).
      if (r.bottom < -height * 1.5 || r.top > height * 2.5 || r.height === 0) return null;
      const cx = ((r.left + r.width / 2) / width) * 2 - 1;
      const cy = -(((r.top + r.height / 2) / height) * 2 - 1);
      const halfH = visibleHeight / 2;
      return { x: cx * halfH * camera.aspect, y: cy * halfH, s: (r.height / height) * visibleHeight };
    };
    const trackHeart = () => {
      const pos = getJourney();
      const i = Math.min(SCENES.length - 1, Math.floor(pos));
      const f = pos - i;
      const L = SCENES[i].length;
      const pinned = (L - 1) / L;
      const hand = Math.min(1, Math.max(0, (f - pinned) / (1 - pinned)));
      const a = getHeartAnchor(i);
      const b = getHeartAnchor(i + 1);
      const A = a ? rectToWorld(a) : null;
      const B = b && hand > 0 ? rectToWorld(b) : null;
      const goal = A && B ? { x: A.x + (B.x - A.x) * hand, y: A.y + (B.y - A.y) * hand, s: A.s + (B.s - A.s) * hand } : A ?? B;
      if (goal) {
        heartGoal.set(goal.x, goal.y, 0);
        heartScaleGoal = goal.s;
      }
    };

    const timeScale = reducedMotion ? 0.3 : 1;
    let time = 0;
    let last = performance.now();
    let raf = 0;
    let running = true;
    let dark = -1;
    let glow = 0;
    const root = document.documentElement;
    const center = new THREE.Vector3();
    const projected = new THREE.Vector3();

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(0.25, (now - last) / 1000);
      last = now;
      time += dt * timeScale;

      easeWorld(state, target, 1 - Math.exp(-dt * (reducedMotion ? 5 : 1.5)));
      pointer.lerp(pointerTarget, 1 - Math.exp(-dt * 1.2));

      trackHeart();
      // While the heart is invisible it simply waits where it will appear.
      const present = Math.max(state.glass, state.heart);
      const follow = present < 0.04 ? 1 : 1 - Math.exp(-dt * 2.2);
      heartPos.lerp(heartGoal, follow);
      heartScale += (heartScaleGoal - heartScale) * follow;

      // The heart breathes with the music, barely.
      glow += (audioEngine.level() - glow) * (1 - Math.exp(-dt * 3));
      heart.group.position.copy(heartPos);
      heart.group.scale.setScalar(heartScale);
      heart.update(time, state.glass, glow, pointer.x * 0.25, state.burst);
      heart.group.updateMatrixWorld();

      const pu = particles.uniforms;
      pu.uTime.value = time;
      pu.uHeartMatrix.value.copy(heart.body.matrixWorld);
      pu.uHeartCenter.value.copy(heartPos);
      pu.uHeart.value = state.heart;
      pu.uSea.value = state.sea;
      pu.uDepth.value = state.depth;
      pu.uStars.value = state.stars;
      pu.uColor.value = state.color;
      pu.uWarm.value = state.warm;
      pu.uHush.value = state.hush;
      pu.uBurst.value = state.burst;
      pu.uFinale.value = state.finale;
      pu.uDark.value = state.dark;

      petals.uniforms.uTime.value = time;
      petals.uniforms.uAmount.value = state.petals;
      petals.mesh.visible = state.petals > 0.01;

      // Where the heart is on screen, for the watercolor and its light.
      center.copy(heartPos);
      projected.copy(center).project(camera);
      const u = atmosphere.uniforms;
      u.uHeartUv.value.set(projected.x * 0.5 + 0.5, projected.y * 0.5 + 0.5);
      u.uTime.value = time;
      u.uPointer.value.copy(pointer);
      u.uColor.value = state.color;
      u.uOcean.value = state.ocean;
      u.uDepth.value = state.depth;
      u.uSparkle.value = state.sparkle;
      u.uNight.value = state.night;
      u.uWarm.value = state.warm;
      u.uHush.value = state.hush;
      u.uFinale.value = state.finale;
      u.uGlass.value = state.glass;

      // A gentle camera drift; in the sea, a slow sinking sway.
      camera.position.x = pointer.x * 0.22 + Math.sin(time * 0.05) * 0.12;
      camera.position.y = pointer.y * 0.15 + Math.cos(time * 0.04) * 0.08 - state.sea * (1 - state.stars) * Math.sin(time * 0.12) * 0.12;
      camera.lookAt(camera.position.x * 0.3, camera.position.y * 0.3, 0);

      // Text color follows the background (light ink on deep water and night).
      if (Math.abs(state.dark - dark) > 0.01) {
        dark = state.dark;
        root.style.setProperty('--dark', dark.toFixed(3));
      }

      audioEngine.setAtmosphere(Math.min(1, state.sea * (1 - state.stars) * 1.1), state.hush);

      renderer.clear();
      renderer.render(bgScene, bgCamera);
      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(tick);

    // Stop drawing entirely while the tab is hidden.
    const onVisibility = () => {
      if (document.hidden && running) {
        cancelAnimationFrame(raf);
        running = false;
      } else if (!document.hidden && !running) {
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    const onLost = (e: Event) => {
      e.preventDefault();
      cancelAnimationFrame(raf);
      running = false;
      setFallback(true);
    };
    renderer.domElement.addEventListener('webglcontextlost', onLost);

    return () => {
      cancelAnimationFrame(raf);
      offJourney();
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointer);
      document.removeEventListener('visibilitychange', onVisibility);
      renderer.domElement.removeEventListener('webglcontextlost', onLost);
      atmosphere.dispose();
      heart.dispose();
      particles.dispose();
      petals.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  // Without WebGL the mood still changes: a soft color that follows the journey.
  useEffect(() => {
    if (!fallback) return;
    return onJourney((pos) => {
      const w = worldAt(pos);
      const mix = (base: number, ...pairs: [number, number][]) =>
        Math.round(pairs.reduce((v, [weight, c]) => v + (c - v) * weight, base));
      const r = mix(240, [w.color, 252], [w.ocean, 40], [w.night, 40], [w.warm, 255], [w.hush, 246], [w.finale, 253]);
      const g = mix(240, [w.color, 236], [w.ocean, 120], [w.night, 46], [w.warm, 244], [w.hush, 238], [w.finale, 240]);
      const b = mix(240, [w.color, 240], [w.ocean, 180], [w.night, 100], [w.warm, 230], [w.hush, 246], [w.finale, 238]);
      ref.current?.style.setProperty('background-color', `rgb(${r}, ${g}, ${b})`);
      document.documentElement.style.setProperty('--dark', w.dark.toFixed(3));
    });
  }, [fallback]);

  return <div ref={ref} className={`world ${fallback ? 'world--fallback' : ''}`} aria-hidden />;
}
