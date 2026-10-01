import { useEffect, useRef } from 'react';
import { SCENES } from '../scenes/config';
import { onJourney } from '../utils/scroll';

/** A hairline at the edge of the screen with a small light travelling down it. */
export function Thread() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(
    () =>
      onJourney((pos) => {
        ref.current?.style.setProperty('--journey', String(Math.min(1, pos / (SCENES.length - 0.85))));
      }),
    [],
  );
  return (
    <div className="thread" ref={ref} aria-hidden>
      <div className="thread__dot" />
    </div>
  );
}
