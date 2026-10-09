import { useEffect, useState } from 'react';
import { HeartAnchor } from '../components/HeartAnchor';
import { Reveal } from '../components/Reveal';
import { Words } from '../components/Words';
import { TEXT } from '../content/text';
import { useAutoplay } from '../hooks/useAutoplay';
import { useEntered } from '../hooks/useEntered';
import { reducedMotion } from '../utils/device';
import { Scene, useBeat, useSceneProgress } from './Scene';

/** Before her: quiet and almost colorless. The first lines arrive on their own. */
export function OpeningScene() {
  return (
    <Scene id="opening" label={TEXT.LABEL_OPENING}>
      <OpeningStage />
    </Scene>
  );
}

const QUIET = [TEXT.OPENING_01, TEXT.OPENING_02, TEXT.OPENING_03];
// Seconds after entering at which each quiet line appears.
const TIMING = [1.6, 4.6, 7.2];
const SPEED = reducedMotion ? 0.6 : 1;

function OpeningStage() {
  const p = useSceneProgress();
  const entered = useEntered();
  const { playing } = useAutoplay();
  const [shown, setShown] = useState(0);
  // Autoplay waits here while the quiet lines arrive, and for the last one to be read.
  useBeat(0, TIMING[TIMING.length - 1] * SPEED + 3);

  useEffect(() => {
    if (!entered) return;
    const speed = SPEED * 1000;
    const timers = TIMING.map((s, i) => window.setTimeout(() => setShown((n) => Math.max(n, i + 1)), s * speed));
    const hint = window.setTimeout(() => setShown((n) => Math.max(n, QUIET.length + 1)), 10 * speed);
    return () => [...timers, hint].forEach((t) => window.clearTimeout(t));
  }, [entered]);

  // Scrolling ahead reveals them too, so nobody is kept waiting.
  const lineState = (i: number) =>
    p >= 0.4 ? 'after' : shown > i || p > 0.03 + i * 0.07 ? 'on' : 'before';

  return (
    <div className="opening">
      <div className="opening__quiet">
        {QUIET.map((line, i) => (
          <p key={i} className={`reveal reveal--${lineState(i)} t-large opening__line opening__line--${i + 1}`}>
            <Words text={line} />
          </p>
        ))}
      </div>
      <HeartAnchor className="opening__heart" />
      <Reveal text={TEXT.OPENING_04} at={0.5} className="t-large opening__arrival" />
      <div className={`scroll-hint ${shown > QUIET.length && p < 0.04 && !playing ? 'is-on' : ''}`} aria-hidden>
        <span>{TEXT.SCROLL_HINT}</span>
        <i />
      </div>
    </div>
  );
}
