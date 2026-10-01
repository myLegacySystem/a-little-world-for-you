import { useEffect, useState } from 'react';
import { audioEngine } from '../audio/audioEngine';
import { TEXT } from '../content/text';
import { useEntered } from '../hooks/useEntered';
import { experience } from '../utils/experience';
import { remeasure } from '../utils/scroll';
import { Words } from './Words';

/**
 * The threshold. Three quiet lines in the colorless world; stepping in starts
 * the music (browsers need that one tap) and lets the story begin.
 */
export function IntroGate() {
  const entered = useEntered();
  const [shown, setShown] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add('is-locked');
    const t = window.setTimeout(() => setShown(true), 400);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!entered) return;
    document.documentElement.classList.remove('is-locked');
    window.scrollTo(0, 0);
    remeasure();
    const t = window.setTimeout(() => setGone(true), 2200);
    return () => window.clearTimeout(t);
  }, [entered]);

  if (gone) return null;

  return (
    <div className={`gate ${shown ? 'is-shown' : ''} ${entered ? 'is-leaving' : ''}`} role="dialog" aria-modal="true" aria-label={TEXT.PAGE_TITLE}>
      <div className="gate__inner">
        <h1 className="gate__title">
          <Words text={TEXT.INTRO_TITLE} />
        </h1>
        <p className="gate__subtitle">{TEXT.INTRO_SUBTITLE}</p>
        <button
          type="button"
          className="gate__enter"
          onClick={() => {
            audioEngine.play();
            experience.enter();
          }}
        >
          <span>{TEXT.INTRO_BUTTON}</span>
          <svg viewBox="0 0 40 12" aria-hidden>
            <path d="M0 6h37M32 1l6 5-6 5" />
          </svg>
        </button>
      </div>
    </div>
  );
}
