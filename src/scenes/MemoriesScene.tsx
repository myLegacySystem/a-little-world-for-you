import { HeartAnchor } from '../components/HeartAnchor';
import { Photo } from '../components/Photo';
import { Reveal } from '../components/Reveal';
import { PHOTOS } from '../content/photos';
import { TEXT } from '../content/text';
import { ramp } from '../utils/math';
import { Scene, useSceneProgress } from './Scene';

/** Two photographs, set down like prints on a table, with the heart beside them. */
export function MemoriesScene() {
  return (
    <Scene id="memories" label={TEXT.LABEL_MEMORIES}>
      <MemoriesStage />
    </Scene>
  );
}

function MemoriesStage() {
  const p = useSceneProgress();
  const a = ramp(p, 0.04, 0.24);
  const b = ramp(p, 0.16, 0.36);
  return (
    <div className="memories">
      <Photo
        photo={PHOTOS.PHOTO_01}
        visible={a}
        caption={TEXT.MEMORIES_CAPTION_01}
        className="memories__one"
        style={{ transform: `translate3d(0, ${(1 - a) * 6 + (0.5 - p) * 3}vh, 0) rotate(-3deg)` }}
      />
      <Photo
        photo={PHOTOS.PHOTO_02}
        visible={b}
        caption={TEXT.MEMORIES_CAPTION_02}
        className="memories__two"
        style={{ transform: `translate3d(0, ${(1 - b) * 8 + (0.5 - p) * 7}vh, 0) rotate(4deg)` }}
      />
      <HeartAnchor className="memories__heart" />
      <Reveal text={TEXT.MEMORIES_01} at={0.42} className="t-medium memories__words" />
    </div>
  );
}
