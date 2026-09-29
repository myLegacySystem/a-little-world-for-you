import { useEffect, useState } from 'react';
import { content } from '../../data/content';
import { reducedMotion } from '../../lib/device';
import { Reveal } from '../ui/SceneText';
import { Scene, useSceneProgress } from './Scene';

const { intro, ui } = content;

/** Before her: quiet and colourless. The opening lines arrive on their own. */
export function IntroScene() {
  return (
    <Scene id="intro" length={3.2} label="Before">
      <IntroStage />
    </Scene>
  );
}

// Seconds after opening at which each quiet line appears.
const timing = [1.2, 4.2, 6.8];

function IntroStage() {
  const p = useSceneProgress();
  const [shown, setShown] = useState(0);

  useEffect(() => {
    const timers = timing.map((s, i) => window.setTimeout(() => setShown((n) => Math.max(n, i + 1)), s * (reducedMotion ? 600 : 1000)));
    const hint = window.setTimeout(() => setShown((n) => Math.max(n, timing.length + 1)), 9800);
    return () => [...timers, hint].forEach((t) => window.clearTimeout(t));
  }, []);

  // Scrolling ahead also reveals them, so nobody is kept waiting.
  const quietOn = (i: number) => (shown > i || p > 0.04 + i * 0.08) && p < 0.42;

  return (
    <>
      <div className="stack stack--center">
        <div className="lines lines--quiet">
          {intro.quiet.map((line, i) => (
            <p key={i} className={`reveal line line--large ${quietOn(i) ? 'reveal--on' : p >= 0.42 ? 'reveal--after' : 'reveal--before'}`}>
              {line}
            </p>
          ))}
        </div>
        <Reveal at={0.52} className="line line--large line--arrival">
          {intro.arrival}
        </Reveal>
      </div>
      <div className={`scroll-hint ${shown > timing.length && p < 0.05 ? 'is-on' : ''}`} aria-hidden>
        <span>{ui.scrollHint}</span>
        <i />
      </div>
    </>
  );
}
