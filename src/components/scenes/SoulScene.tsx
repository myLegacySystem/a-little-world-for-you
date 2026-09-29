import { content, photos } from '../../data/content';
import { Photo } from '../ui/Photo';
import { Reveal, SceneText } from '../ui/SceneText';
import { Scene, useSceneProgress } from './Scene';
import { ramp } from './ramp';

const { soul } = content;

/** Warm light. Intimate, not grand. */
export function SoulScene() {
  return (
    <Scene id="soul" length={5.2} label="Your soul">
      <SoulStage />
    </Scene>
  );
}

function SoulStage() {
  const p = useSceneProgress();
  const photo = ramp(p, 0.06, 0.24) * (1 - ramp(p, 0.76, 0.86));
  return (
    <div className="layout layout--photo layout--soul">
      <Photo
        photo={photos.soul}
        visible={photo}
        className="photo--soul"
        style={{ transform: `translate3d(0, ${(0.5 - p) * 5}vh, 0)` }}
      />
      <div className="stack">
        <SceneText lines={soul.opening} from={0.05} to={0.13} out={0.3} lineClassName="line--medium" />
        <SceneText lines={soul.thoughts} from={0.32} to={0.48} out={0.6} lineClassName="line--small" className="lines--thoughts" />
        <SceneText lines={soul.beautiful} from={0.62} to={0.7} out={0.82} lineClassName="line--medium" />
        <Reveal at={0.85} className="line line--large line--soul">
          {soul.soul}
        </Reveal>
      </div>
    </div>
  );
}
