import { content, person, photos } from '../../data/content';
import { Heart } from '../ui/Heart';
import { Photo } from '../ui/Photo';
import { Reveal, SceneText } from '../ui/SceneText';
import { Scene, useSceneProgress } from './Scene';
import { ramp } from './ramp';

const { finale } = content;
const half = Math.ceil(finale.hopes.length / 2);
const hopesA = finale.hopes.slice(0, half);
const hopesB = finale.hopes.slice(half);

/**
 * Everything comes together. This is the last scene: it stays pinned at the
 * end of the page, so the photo, the light and the music simply carry on.
 */
export function BirthdayScene() {
  return (
    <Scene id="birthday" length={7} label="Happy birthday">
      <BirthdayStage />
    </Scene>
  );
}

function BirthdayStage() {
  const p = useSceneProgress();
  const title = finale.title.replace('{name}', person.name);
  const last = finale.last.replace(/\s*❤️\s*$/, '');
  const hasHeart = last !== finale.last;

  return (
    <div className="layout layout--finale">
      <Photo photo={photos.finale} visible={ramp(p, 0.02, 0.16)} className="photo--finale" />
      <div className="finale__text">
        <div className="stack">
          <div className={`finale__title reveal ${p >= 0.1 && p < 0.88 ? 'reveal--on' : p >= 0.88 ? 'reveal--after' : 'reveal--before'}`}>
            <p className="finale__date">{person.birthday}</p>
            <h1 className="title">{title}</h1>
          </div>
          <Reveal as="h2" at={0.9} className="title title--last">
            <span>{last}</span>
            {hasHeart && <Heart />}
          </Reveal>
        </div>
        <div className="stack">
          <SceneText lines={finale.notJustADay} from={0.2} to={0.28} out={0.4} lineClassName="line--medium" />
          {/* The hopes arrive in two small groups so they fit on a phone. */}
          <SceneText lines={hopesA} from={0.42} to={0.52} out={0.58} lineClassName="line--small" className="lines--hopes" />
          <SceneText lines={hopesB} from={0.6} to={0.7} out={0.78} lineClassName="line--small" className="lines--hopes" />
          <Reveal at={0.8} className="line line--medium line--thanks">
            {finale.thanks}
          </Reveal>
        </div>
      </div>
    </div>
  );
}
