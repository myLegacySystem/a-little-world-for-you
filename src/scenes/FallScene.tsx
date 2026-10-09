import { Beat } from '../components/Beat';
import { Reveal } from '../components/Reveal';
import { TEXT } from '../content/text';
import { Scene, useSceneProgress } from './Scene';

/**
 * Sinking, slowly — the words sink a little too. Then the particles turn and
 * rise, and we follow them up through the surface into a night full of stars.
 */
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
      <Reveal text={TEXT.FALL_01} at={0.1} out={0.6} className="t-large fall__one" />
      <Reveal text={TEXT.FALL_02} at={0.32} out={0.6} className="t-display fall__two stepped" />
      {/* Turning upward, and the night full of stars. */}
      <Beat at={0.72} seconds={2.5} />
      <Beat at={0.97} seconds={2.5} />
    </div>
  );
}
