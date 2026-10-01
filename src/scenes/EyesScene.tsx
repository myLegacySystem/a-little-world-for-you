import type { CSSProperties } from 'react';
import { HeartAnchor } from '../components/HeartAnchor';
import { Photo } from '../components/Photo';
import { Reveal } from '../components/Reveal';
import { PHOTOS } from '../content/photos';
import { TEXT } from '../content/text';
import { ramp } from '../utils/math';
import { Scene, useSceneProgress } from './Scene';

/**
 * Her eyes. The heart dissolves into water that rises over everything; her
 * eyes surface in it, and then we're pulled in — through them, into the sea.
 */
export function EyesScene() {
  return (
    <Scene id="eyes" label={TEXT.LABEL_EYES}>
      <EyesStage />
    </Scene>
  );
}

function EyesStage() {
  const p = useSceneProgress();
  const appear = ramp(p, 0.36, 0.5);
  const pull = ramp(p, 0.6, 0.76);
  return (
    <div className="eyes">
      <HeartAnchor className="eyes__heart" />
      <div
        className="eyes__window"
        style={{ '--appear': appear, '--pull': pull } as CSSProperties}
        aria-hidden={appear < 0.5 || pull > 0.7}
      >
        <Photo photo={PHOTOS.PHOTO_03} visible={appear * (1 - pull)} variant="cinema" />
      </div>
      <Reveal text={TEXT.EYES_01} at={0.04} out={0.22} className="t-display eyes__first stepped" />
      <Reveal text={TEXT.EYES_02} at={0.44} out={0.6} className="t-large eyes__second on-dark" />
      <Reveal text={TEXT.EYES_03} at={0.51} out={0.6} className="t-medium eyes__third on-dark" />
      <Reveal text={TEXT.EYES_04} at={0.7} className="t-large eyes__sea on-dark" />
    </div>
  );
}
