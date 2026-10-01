import { HeartAnchor } from '../components/HeartAnchor';
import { Reveal } from '../components/Reveal';
import { TEXT } from '../content/text';
import { Scene } from './Scene';

/** Color arrives — one hue at a time, from the heart outward. */
export function ColorScene() {
  return (
    <Scene id="color" label={TEXT.LABEL_COLOR}>
      <div className="split split--color">
        <HeartAnchor className="color__heart" />
        <div className="stack color__words">
          <Reveal text={TEXT.COLOR_01} at={0.12} out={0.48} className="t-large" />
          <Reveal text={TEXT.COLOR_02} at={0.58} className="t-large color__dull" />
        </div>
      </div>
    </Scene>
  );
}
