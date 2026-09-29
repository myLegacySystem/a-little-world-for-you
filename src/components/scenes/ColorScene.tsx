import { content, photos } from '../../data/content';
import { Photo } from '../ui/Photo';
import { Reveal } from '../ui/SceneText';
import { Scene, useSceneProgress } from './Scene';
import { ramp } from './ramp';

/** Colour arrives, and with it the first photograph. */
export function ColorScene() {
  return (
    <Scene id="color" length={3.6} label="Colour">
      <ColorStage />
    </Scene>
  );
}

function ColorStage() {
  const p = useSceneProgress();
  const visible = ramp(p, 0.04, 0.26) * (1 - ramp(p, 0.9, 1));
  return (
    <div className="layout layout--photo">
      <Photo
        photo={photos.arrival}
        visible={visible}
        className="photo--arrival"
        style={{ transform: `translate3d(0, ${(0.5 - p) * 4}vh, 0) scale(${0.94 + visible * 0.06})` }}
      />
      <div className="stack">
        <Reveal at={0.3} out={0.56} className="line line--medium">
          {content.color.first}
        </Reveal>
        <Reveal at={0.6} out={0.95} className="line line--medium">
          {content.color.second}
        </Reveal>
      </div>
    </div>
  );
}
