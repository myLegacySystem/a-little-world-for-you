import { useEffect, useState } from 'react';
import { TEXT } from '../content/text';
import { useAutoplay } from '../hooks/useAutoplay';
import { useEntered } from '../hooks/useEntered';
import { autoplay } from '../utils/autoplay';

/**
 * The story plays by itself, stopping on every line long enough to read it.
 * Three small buttons: back a line, pause / play, and on to the next line.
 * They step aside once the story is complete.
 */
export function StoryControls() {
  const entered = useEntered();
  const { playing, done } = useAutoplay();
  const [hint, setHint] = useState(false);

  useEffect(() => {
    if (!entered) return;
    autoplay.start();
    const on = window.setTimeout(() => setHint(true), 2600);
    const off = window.setTimeout(() => setHint(false), 9500);
    return () => {
      window.clearTimeout(on);
      window.clearTimeout(off);
    };
  }, [entered]);

  if (!entered) return null;

  return (
    <div className={`story ${done ? 'is-done' : ''}`} role="group" aria-label={TEXT.STORY_CONTROLS}>
      <span className={`story__hint ${hint && playing ? 'is-on' : ''}`} aria-hidden>
        {TEXT.STORY_HINT}
      </span>
      <button type="button" aria-label={TEXT.STORY_PREVIOUS} onClick={autoplay.prev}>
        <svg viewBox="0 0 16 16" aria-hidden>
          <path d="M3.5 10 8 5.5l4.5 4.5" />
        </svg>
      </button>
      <button
        type="button"
        className="story__toggle"
        aria-label={playing ? TEXT.STORY_PAUSE : TEXT.STORY_PLAY}
        onClick={autoplay.toggle}
      >
        <svg viewBox="0 0 16 16" aria-hidden>
          {playing ? <path d="M5.5 3.5v9M10.5 3.5v9" /> : <path d="M5.2 3.2v9.6L12.8 8z" />}
        </svg>
      </button>
      <button type="button" aria-label={TEXT.STORY_NEXT} onClick={autoplay.next}>
        <svg viewBox="0 0 16 16" aria-hidden>
          <path d="M3.5 6 8 10.5 12.5 6" />
        </svg>
      </button>
    </div>
  );
}
