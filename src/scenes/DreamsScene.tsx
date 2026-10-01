import { Reveal } from '../components/Reveal';
import { TEXT } from '../content/text';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { Scene, useSceneProgress } from './Scene';

const WISHES = [TEXT.WISH_01, TEXT.WISH_02, TEXT.WISH_03];
const FIRST = 0.26;
const STEP = 0.21;

// Where each wish's star sits (percent of the stage): a small constellation.
const WIDE = [
  [30, 26],
  [52, 15],
  [71, 30],
];
const NARROW = [
  [22, 20],
  [54, 11],
  [78, 24],
];

/** The sea has become a night sky. Each wish lights a star. */
export function DreamsScene() {
  return (
    <Scene id="dreams" label={TEXT.LABEL_DREAMS}>
      <DreamsStage />
    </Scene>
  );
}

function DreamsStage() {
  const p = useSceneProgress();
  const pts = useMediaQuery('(max-width: 700px)') ? NARROW : WIDE;
  const lit = (i: number) => p >= FIRST + STEP * i;
  return (
    <div className="dreams on-dark">
      <svg className="constellation" aria-hidden>
        {pts.slice(1).map((pt, i) => (
          <line
            key={i}
            className={lit(i + 1) ? 'is-on' : ''}
            x1={`${pts[i][0]}%`}
            y1={`${pts[i][1]}%`}
            x2={`${pt[0]}%`}
            y2={`${pt[1]}%`}
            pathLength={1}
          />
        ))}
      </svg>
      {pts.map((pt, i) => (
        <span
          key={i}
          className={`wish-star ${lit(i) ? 'is-lit' : ''} ${lit(i) && !lit(i + 1) ? 'is-current' : ''}`}
          style={{ left: `${pt[0]}%`, top: `${pt[1]}%` }}
          aria-hidden
        />
      ))}
      <div className="stack dreams__words">
        <div className="dreams__opening">
          <Reveal text={TEXT.DREAMS_01} at={0.04} out={0.22} className="t-medium" />
          <Reveal text={TEXT.DREAMS_02} at={0.11} out={0.22} className="t-large" />
        </div>
        {WISHES.map((wish, i) => (
          <Reveal key={i} text={wish} at={FIRST + STEP * i} out={FIRST + STEP * (i + 1) - 0.02} className="t-large dreams__wish" />
        ))}
      </div>
    </div>
  );
}
