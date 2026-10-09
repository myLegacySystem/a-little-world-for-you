import { Beat } from '../components/Beat';
import { HeartAnchor } from '../components/HeartAnchor';
import { Reveal } from '../components/Reveal';
import { TEXT } from '../content/text';
import { Scene } from './Scene';

/** The most personal part, and the quietest. */
export function PersonalScene() {
  return (
    <Scene id="personal" label={TEXT.LABEL_PERSONAL}>
      <div className="personal">
        <HeartAnchor className="personal__heart" />
        {/* The light remembers the heart. */}
        <Beat at={0.93} seconds={2.5} />
        <div className="stack personal__words">
          <Reveal text={TEXT.PERSONAL_01} at={0.06} out={0.2} className="t-medium" />
          <div>
            <Reveal text={TEXT.PERSONAL_02} at={0.23} out={0.42} className="t-large" />
            <Reveal text={TEXT.PERSONAL_03} at={0.31} out={0.42} className="t-small" />
          </div>
          <Reveal text={TEXT.PERSONAL_04} at={0.45} out={0.58} className="t-medium" />
          <Reveal text={TEXT.PERSONAL_05} at={0.61} out={0.72} className="t-large" />
          <div>
            <Reveal text={TEXT.PERSONAL_06} at={0.75} className="t-small" />
            <Reveal text={TEXT.PERSONAL_07} at={0.83} className="t-large" />
          </div>
        </div>
      </div>
    </Scene>
  );
}
