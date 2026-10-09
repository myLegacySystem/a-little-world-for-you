import type { CSSProperties } from 'react';
import { Beat } from '../components/Beat';
import { HeartAnchor } from '../components/HeartAnchor';
import { TEXT } from '../content/text';
import { reducedMotion } from '../utils/device';
import { Scene, useSceneProgress } from './Scene';

/**
 * No words here. The particles that gathered while color arrived find their
 * shape, the glass heart forms around them, and we drift a little closer
 * while it breathes. The heart is the sentence.
 */
export function HeartScene() {
  return (
    <Scene id="heart" label={TEXT.LABEL_HEART}>
      <HeartStage />
    </Scene>
  );
}

function HeartStage() {
  const p = useSceneProgress();
  // The camera approaches: the heart's space grows as we scroll.
  const near = reducedMotion ? 0.4 : Math.min(1, p * 1.15);
  return (
    <div className="heart-stage" style={{ '--near': near } as CSSProperties}>
      <HeartAnchor className="heart-stage__heart" />
      {/* The shape found, then the glass formed. */}
      <Beat at={0.32} seconds={2.5} />
      <Beat at={0.6} seconds={3.5} />
    </div>
  );
}
