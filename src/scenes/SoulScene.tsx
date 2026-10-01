import { Botanical } from '../components/Botanical';
import { Photo } from '../components/Photo';
import { Reveal } from '../components/Reveal';
import { PHOTOS } from '../content/photos';
import { TEXT } from '../content/text';
import { ramp } from '../utils/math';
import { Scene, useSceneProgress } from './Scene';

/** Dawn. Warm light, a few petals, and the most important thing about her. */
export function SoulScene() {
  return (
    <Scene id="soul" label={TEXT.LABEL_SOUL}>
      <SoulStage />
    </Scene>
  );
}

function SoulStage() {
  const p = useSceneProgress();
  const photo = ramp(p, 0.22, 0.4) * (1 - ramp(p, 0.82, 0.9));
  return (
    <div className="split split--soul">
      <div className="soul__picture">
        <Botanical kind="sprig" on={p > 0.3 && p < 0.9} className="soul__sprig" />
        <Photo
          photo={PHOTOS.PHOTO_04}
          visible={photo}
          className="soul__photo"
          style={{ transform: `translate3d(0, ${(1 - photo) * 5 + (0.5 - p) * 4}vh, 0)` }}
          tilt={2.5}
        />
      </div>
      <div className="stack soul__words">
        <div>
          <Reveal text={TEXT.SOUL_01} at={0.24} out={0.42} className="t-medium" />
          <Reveal text={TEXT.SOUL_02} at={0.3} out={0.42} className="t-large" />
        </div>
        <div className="soul__thoughts">
          <Reveal text={TEXT.SOUL_03} at={0.44} out={0.65} className="t-small" />
          <Reveal text={TEXT.SOUL_04} at={0.5} out={0.65} className="t-small" />
          <Reveal text={TEXT.SOUL_05} at={0.56} out={0.65} className="t-small" />
        </div>
        <div>
          <Reveal text={TEXT.SOUL_06} at={0.67} out={0.83} className="t-large" />
          <Reveal text={TEXT.SOUL_07} at={0.73} out={0.83} className="t-small" />
        </div>
        <Reveal text={TEXT.SOUL_08} at={0.86} className="t-display soul__soul" />
      </div>
    </div>
  );
}
