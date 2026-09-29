import { useEffect, useState, type CSSProperties } from 'react';
import { content } from '../../data/content';
import { Reveal, SceneText } from '../ui/SceneText';
import { Scene, useSceneProgress } from './Scene';

const { wishes } = content;

// Where each wish-star sits (percent of the stage). A loose constellation.
const desktop = [
  [22, 30],
  [38, 18],
  [55, 27],
  [70, 15],
  [80, 34],
];
const mobile = [
  [18, 22],
  [40, 12],
  [58, 24],
  [80, 13],
  [70, 36],
];

const FIRST = 0.22;
const STEP = 0.14;

/** A night sky. Each wish lights one star; the constellation stays. */
export function WishesScene() {
  return (
    <Scene id="wishes" length={6} label="Wishes">
      <WishesStage />
    </Scene>
  );
}

function WishesStage() {
  const p = useSceneProgress();
  const lit = (i: number) => p >= FIRST + STEP * i;
  const pts = useNarrow() ? mobile : desktop;

  return (
    <>
      <svg className="constellation" aria-hidden>
        {wishes.list.slice(1).map((_, i) => (
          <line
            key={i}
            className={lit(i + 1) ? 'is-on' : ''}
            x1={`${pts[i][0]}%`}
            y1={`${pts[i][1]}%`}
            x2={`${pts[i + 1][0]}%`}
            y2={`${pts[i + 1][1]}%`}
            pathLength={1}
          />
        ))}
      </svg>
      {wishes.list.map((w, i) => (
        <span
          key={w.title}
          className={`wish-star ${lit(i) ? 'is-lit' : ''} ${p >= FIRST + STEP * i && p < FIRST + STEP * (i + 1) ? 'is-current' : ''}`}
          style={{ left: `${pts[i][0]}%`, top: `${pts[i][1]}%` } as CSSProperties}
          aria-hidden
        />
      ))}

      <div className="stack stack--low">
        <SceneText lines={wishes.opening} from={0.03} to={0.1} out={0.19} lineClassName="line--medium" />
        {wishes.list.map((w, i) => {
          const at = FIRST + STEP * i;
          return (
            <div key={w.title} className="wish">
              <Reveal at={at} out={at + STEP - 0.015} className="wish__title">
                {w.title}
              </Reveal>
              <Reveal at={at + 0.015} out={at + STEP - 0.015} className="line line--medium wish__text">
                {w.text}
              </Reveal>
            </div>
          );
        })}
      </div>
    </>
  );
}

function useNarrow() {
  const query = '(max-width: 700px)';
  const [narrow, setNarrow] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setNarrow(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return narrow;
}
