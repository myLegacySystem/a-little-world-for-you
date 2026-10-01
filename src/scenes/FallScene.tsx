import { Reveal } from '../components/Reveal';
import { TEXT } from '../content/text';
import { Scene, useSceneProgress } from './Scene';

/** Sinking, slowly. The words sink a little too. */
export function FallScene() {
  return (
    <Scene id="fall" label={TEXT.LABEL_FALL}>
      <FallStage />
    </Scene>
  );
}

function FallStage() {
  const p = useSceneProgress();
  return (
    <div className="fall on-dark" style={{ transform: `translate3d(0, ${p * 7}vh, 0)` }}>
      <Reveal text={TEXT.FALL_01} at={0.12} className="t-large fall__one" />
      <Reveal text={TEXT.FALL_02} at={0.42} className="t-display fall__two stepped" />
    </div>
  );
}
