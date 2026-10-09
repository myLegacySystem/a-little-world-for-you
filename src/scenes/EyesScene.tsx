import { Beat } from '../components/Beat';
import { HeartAnchor } from '../components/HeartAnchor';
import { Reveal } from '../components/Reveal';
import { TEXT } from '../content/text';
import { Scene } from './Scene';

/**
 * Her eyes. The heart dissolves into water that rises over everything, and
 * the words carry us forward until we're pulled into the sea.
 */
export function EyesScene() {
  return (
    <Scene id="eyes" label={TEXT.LABEL_EYES}>
      <div className="eyes">
        <HeartAnchor className="eyes__heart" />
        <Reveal text={TEXT.EYES_01} at={0.04} out={0.22} className="t-display eyes__first stepped" />
        {/* The heart has become water, rising over everything. */}
        <Beat at={0.33} seconds={2.5} />
        <Reveal text={TEXT.EYES_02} at={0.44} out={0.6} className="t-large eyes__second on-dark" />
        <Reveal text={TEXT.EYES_03} at={0.51} out={0.6} className="t-medium eyes__third on-dark" />
        <Reveal text={TEXT.EYES_04} at={0.7} className="t-large eyes__sea on-dark" />
      </div>
    </Scene>
  );
}
