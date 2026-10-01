import { Botanical } from '../components/Botanical';
import { HeartAnchor } from '../components/HeartAnchor';
import { Photo } from '../components/Photo';
import { Reveal } from '../components/Reveal';
import { PHOTOS } from '../content/photos';
import { TEXT } from '../content/text';
import { ramp } from '../utils/math';
import { Scene, useSceneProgress } from './Scene';

/**
 * Everything comes together, and stays. The last scene remains pinned at the
 * end of the page: the heart, the photograph, the light and the music go on.
 */
export function BirthdayScene() {
  return (
    <Scene id="birthday" label={TEXT.LABEL_BIRTHDAY}>
      <BirthdayStage />
    </Scene>
  );
}

function BirthdayStage() {
  const p = useSceneProgress();
  const photo = ramp(p, 0.06, 0.2);
  return (
    <div className="birthday">
      <div className="birthday__picture">
        <Photo
          photo={PHOTOS.PHOTO_05}
          visible={photo}
          className="birthday__photo"
          style={{ transform: `translate3d(0, ${(1 - photo) * 5}vh, 0) rotate(-2.5deg)` }}
        />
        <Botanical kind="stem" on={p > 0.16} className="birthday__stem" />
        <HeartAnchor className="birthday__heart" />
      </div>
      <div className="birthday__words">
        <div className="stack">
          <div>
            <Reveal text={TEXT.BIRTHDAY_EYEBROW} at={0.13} out={0.88} className="t-label" />
            <Reveal as="h1" text={TEXT.BIRTHDAY_TITLE} at={0.15} out={0.88} className="t-display birthday__title" />
          </div>
          <Reveal as="h2" text={TEXT.FINAL_BIRTHDAY} at={0.9} className="t-display birthday__title" />
        </div>
        <div className="stack birthday__lines">
          <div>
            <Reveal text={TEXT.BIRTHDAY_INTRO_01} at={0.25} out={0.39} className="t-medium" />
            <Reveal text={TEXT.BIRTHDAY_INTRO_02} at={0.3} out={0.39} className="t-small" />
          </div>
          <div className="birthday__hopes">
            <Reveal text={TEXT.BIRTHDAY_01} at={0.41} out={0.58} className="t-small" />
            <Reveal text={TEXT.BIRTHDAY_02} at={0.45} out={0.58} className="t-small" />
            <Reveal text={TEXT.BIRTHDAY_03} at={0.49} out={0.58} className="t-small" />
          </div>
          <div className="birthday__hopes">
            <Reveal text={TEXT.BIRTHDAY_04} at={0.6} out={0.78} className="t-small" />
            <Reveal text={TEXT.BIRTHDAY_05} at={0.64} out={0.78} className="t-small" />
            <Reveal text={TEXT.BIRTHDAY_06} at={0.68} out={0.78} className="t-small" />
          </div>
          <Reveal text={TEXT.FINAL} at={0.8} className="t-medium birthday__thanks" />
        </div>
      </div>
    </div>
  );
}
