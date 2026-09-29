import type { CSSProperties } from 'react';
import { content, photos } from '../../data/content';
import { Photo } from '../ui/Photo';
import { Reveal, SceneText } from '../ui/SceneText';
import { Scene, useSceneProgress } from './Scene';
import { ramp } from './ramp';

const { ocean } = content;

/** Her eyes → the sea. The photo opens like an iris and we fall through it. */
export function OceanScene() {
  return (
    <Scene id="ocean" length={5} label="Your eyes">
      <OceanStage />
    </Scene>
  );
}

function OceanStage() {
  const p = useSceneProgress();
  const open = ramp(p, 0.0, 0.3);
  const fade = 1 - ramp(p, 0.16, 0.32);
  const [a, b, c] = ocean.lines;
  const fall = ramp(p, 0.78, 1);

  return (
    <>
      <div
        className="iris"
        style={{ '--open': open, opacity: fade, visibility: fade <= 0 ? 'hidden' : 'visible' } as CSSProperties}
        aria-hidden={fade < 0.5}
      >
        <Photo photo={photos.eyes} visible={1} className="photo--iris" />
        <div className="iris__water" />
      </div>
      <div className="stack stack--center" style={{ transform: `translate3d(0, ${fall * 6}vh, 0)` }}>
        <SceneText lines={[a, b, c]} from={0.3} to={0.52} out={0.62} className="lines--ocean" lineClassName="line--medium" />
        <Reveal at={0.64} out={0.76} className="line line--large line--sea">
          {ocean.lines[3]}
        </Reveal>
        <SceneText lines={ocean.fall} from={0.79} to={0.87} className="lines--fall" lineClassName="line--medium" />
      </div>
    </>
  );
}
