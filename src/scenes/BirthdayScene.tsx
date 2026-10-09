import type { CSSProperties } from 'react';
import { Beat } from '../components/Beat';
import { Botanical } from '../components/Botanical';
import { HeartAnchor } from '../components/HeartAnchor';
import { InlineHeart } from '../components/InlineHeart';
import { NameFlip } from '../components/NameFlip';
import { Photo } from '../components/Photo';
import { Reveal } from '../components/Reveal';
import { Words } from '../components/Words';
import { PHOTOS } from '../content/photos';
import { TEXT } from '../content/text';
import { ramp } from '../utils/math';
import { Scene, useSceneProgress } from './Scene';

/**
 * Everything comes together, and stays. The last scene remains pinned at the
 * end of the page: the heart, the photograph, the light, the music — and her
 * names, taking turns after "Happy Birthday" — go on.
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
  const photo = ramp(p, 0.14, 0.3);
  const titleOn = p >= 0.2;
  const titleLines = TEXT.BIRTHDAY_TITLE.split('\n').length;
  return (
    <div className="birthday">
      <div className="birthday__picture">
        <Photo
          photo={PHOTOS.PHOTO_05}
          visible={photo}
          className="birthday__photo"
          style={{ transform: `translate3d(0, ${(1 - photo) * 5}vh, 0)` }}
          tilt={-2.5}
        />
        <Botanical kind="stem" on={p > 0.24} className="birthday__stem" />
        <HeartAnchor className="birthday__heart" />
      </div>
      {/* The heart formed again; the title and a few of her names; the last heart. */}
      <Beat at={0.17} seconds={2.5} />
      <Beat at={0.2} seconds={6.5} />
      <Beat at={0.9} seconds={4} />
      <div className="birthday__words">
        <div>
          <Reveal text={TEXT.BIRTHDAY_EYEBROW} at={0.19} className="t-label" />
          {/* "Happy Birthday" stays; the name after it takes turns. */}
          <h1 className={`reveal reveal--${titleOn ? 'on' : 'before'} t-hero birthday__title`}>
            <Words text={TEXT.BIRTHDAY_TITLE} />
            <span className="w-line birthday__name" style={{ '--i': titleLines } as CSSProperties}>
              <NameFlip
                names={TEXT.BIRTHDAY_NAMES}
                active={titleOn}
                suffix={
                  <span className={`birthday__heart-mark ${p >= 0.9 ? 'is-on' : ''}`}>
                    <InlineHeart />
                  </span>
                }
              />
            </span>
          </h1>
        </div>
        <div className="stack birthday__lines">
          <div>
            <Reveal text={TEXT.BIRTHDAY_INTRO_01} at={0.32} out={0.45} className="t-medium" />
            <Reveal text={TEXT.BIRTHDAY_INTRO_02} at={0.36} out={0.45} className="t-small" />
          </div>
          <div className="birthday__hopes">
            <Reveal text={TEXT.BIRTHDAY_01} at={0.47} out={0.62} className="t-small" />
            <Reveal text={TEXT.BIRTHDAY_02} at={0.5} out={0.62} className="t-small" />
            <Reveal text={TEXT.BIRTHDAY_03} at={0.53} out={0.62} className="t-small" />
          </div>
          <div className="birthday__hopes">
            <Reveal text={TEXT.BIRTHDAY_04} at={0.64} out={0.79} className="t-small" />
            <Reveal text={TEXT.BIRTHDAY_05} at={0.67} out={0.79} className="t-small" />
            <Reveal text={TEXT.BIRTHDAY_06} at={0.7} out={0.79} className="t-small" />
          </div>
          <Reveal text={TEXT.FINAL} at={0.82} className="t-medium birthday__thanks" />
        </div>
      </div>
    </div>
  );
}
