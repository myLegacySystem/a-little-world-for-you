import { content } from '../../data/content';
import { Reveal, SceneText } from '../ui/SceneText';
import { Scene, useSceneProgress } from './Scene';

const { personal } = content;

/** One star remains. The most restrained moment of all. */
export function PersonalScene() {
  return (
    <Scene id="personal" length={4.6} label="One wish">
      <PersonalStage />
    </Scene>
  );
}

function PersonalStage() {
  const p = useSceneProgress();
  return (
    <>
      <span className={`lone-star ${p > 0.02 ? 'is-lit' : ''}`} aria-hidden />
      <div className="stack stack--center">
        <Reveal at={0.05} out={0.2} className="line line--medium">
          {personal.opening}
        </Reveal>
        <SceneText lines={personal.close} from={0.23} to={0.31} out={0.42} lineClassName="line--medium" />
        <Reveal at={0.45} out={0.58} className="line line--medium">
          {personal.birthdays}
        </Reveal>
        <Reveal at={0.61} out={0.72} className="line line--large">
          {personal.stay}
        </Reveal>
        <SceneText lines={personal.heart} from={0.75} to={0.84} lineClassName="line--medium" className="lines--heart" />
      </div>
    </>
  );
}
