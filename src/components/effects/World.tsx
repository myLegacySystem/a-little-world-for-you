import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { lite, reducedMotion, supportsWebGL } from '../../lib/device';
import { getJourney, onJourney } from '../../lib/scroll';
import { emptyWorld, worldAt, type WorldState } from '../../lib/world';
import { Atmosphere } from './Atmosphere';
import { ParticleField } from './ParticleField';
import { StarField } from './StarField';

/**
 * The living backdrop: one WebGL canvas behind every scene. Scenes never talk
 * to it directly — it follows the journey position from the scroll director
 * and eases towards the mood defined in lib/world.ts.
 */
export function World() {
  const ref = useRef<HTMLDivElement>(null);
  const [fallback, setFallback] = useState(false);

  // Without WebGL, the mood still changes: a plain colour that follows the journey.
  useEffect(() => {
    if (!fallback) return;
    return onJourney((pos) => {
      const w = worldAt(pos);
      const mix = (grey: number, ...pairs: [number, number][]) =>
        Math.round(pairs.reduce((v, [weight, c]) => v + (c - v) * weight, grey));
      const r = mix(16, [w.color * 0.5, 52], [w.ocean, 6], [w.warm, 70], [w.night, 8], [w.finale, 30]);
      const g = mix(17, [w.color * 0.5, 44], [w.ocean, 40], [w.warm, 46], [w.night, 12], [w.finale, 26]);
      const b = mix(22, [w.color * 0.5, 70], [w.ocean, 72], [w.warm, 34], [w.night, 32], [w.finale, 48]);
      ref.current?.style.setProperty('background-color', `rgb(${r}, ${g}, ${b})`);
    });
  }, [fallback]);

  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    if (!supportsWebGL()) {
      setFallback(true);
      return;
    }

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false, powerPreference: 'high-performance' });
    } catch {
      setFallback(true);
      return;
    }
    const pixelRatio = Math.min(window.devicePixelRatio || 1, lite ? 1.25 : 1.75);
    renderer.setPixelRatio(pixelRatio);
    renderer.autoClear = false;
    host.appendChild(renderer.domElement);

    const bgScene = new THREE.Scene();
    const bgCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const atmosphere = new Atmosphere();
    bgScene.add(atmosphere.mesh);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 60);
    camera.position.set(0, 0, 3);
    const particles = new ParticleField(lite ? 450 : 1100);
    const stars = new StarField(lite ? 700 : 1400);
    scene.add(stars.points, particles.points);
    particles.uniforms.uPixelRatio.value = pixelRatio;
    stars.uniforms.uPixelRatio.value = pixelRatio;

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      atmosphere.uniforms.uAspect.value = w / h;
      // On tall phone screens, place the first light a little higher.
      atmosphere.uniforms.uLightPos.value.set(0.5, w / h < 0.8 ? 0.6 : 0.56);
    };
    resize();
    window.addEventListener('resize', resize);

    // Pointer / touch: the world leans very slightly towards it.
    const pointer = new THREE.Vector2();
    const pointerTarget = new THREE.Vector2();
    const onPointer = (e: PointerEvent) => {
      pointerTarget.set((e.clientX / window.innerWidth) * 2 - 1, -((e.clientY / window.innerHeight) * 2 - 1));
    };
    if (!reducedMotion) window.addEventListener('pointermove', onPointer, { passive: true });

    const state: WorldState = { ...worldAt(getJourney()) };
    let target = worldAt(getJourney());
    const offJourney = onJourney((pos) => {
      target = worldAt(pos);
    });

    const timeScale = reducedMotion ? 0.25 : 1;
    let time = 0;
    let last = performance.now();
    let raf = 0;
    let running = true;

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      time += dt * timeScale;

      // Ease every weight towards its target: slow, organic changes.
      const k = 1 - Math.exp(-dt * (reducedMotion ? 6 : 1.6));
      (Object.keys(emptyWorld) as (keyof WorldState)[]).forEach((key) => {
        state[key] += (target[key] - state[key]) * k;
      });
      pointer.lerp(pointerTarget, 1 - Math.exp(-dt * 1.5));

      const u = atmosphere.uniforms;
      u.uTime.value = time;
      u.uPointer.value.copy(pointer);
      u.uColor.value = state.color;
      u.uLight.value = state.light;
      u.uOcean.value = state.ocean;
      u.uDepth.value = state.depth;
      u.uSparkle.value = state.sparkle;
      u.uWarm.value = state.warm;
      u.uNight.value = state.night;
      u.uFinale.value = state.finale;

      const pu = particles.uniforms;
      pu.uTime.value = time;
      pu.uColor.value = state.color;
      pu.uOcean.value = state.ocean;
      pu.uWarm.value = state.warm;
      pu.uNight.value = state.night;
      pu.uFinale.value = state.finale;
      pu.uHush.value = state.hush;

      stars.uniforms.uTime.value = time;
      stars.uniforms.uVisible.value = Math.max(state.night, state.finale * 0.7);
      stars.uniforms.uHush.value = state.hush;
      stars.points.visible = stars.uniforms.uVisible.value > 0.01;

      // Slow camera drift; in the sea, a gentle sinking sway.
      camera.position.x = pointer.x * 0.25 + Math.sin(time * 0.05) * 0.15;
      camera.position.y = pointer.y * 0.18 + Math.cos(time * 0.04) * 0.1 - state.ocean * Math.sin(time * 0.1) * 0.1;
      camera.lookAt(0, 0, -4);

      renderer.clear();
      renderer.render(bgScene, bgCamera);
      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(tick);

    // Stop drawing entirely when the tab is hidden.
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
      particles.dispose();
      stars.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={ref} className={`world ${fallback ? 'world--fallback' : ''}`} aria-hidden />;
}
