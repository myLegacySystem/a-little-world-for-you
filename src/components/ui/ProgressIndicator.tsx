import { useEffect, useRef } from 'react';
import { onJourney } from '../../lib/scroll';
import { sceneOrder } from '../../lib/world';

/** A hairline on the edge of the screen with a small light travelling down it. */
export function ProgressIndicator() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(
    () =>
      onJourney((pos) => {
        ref.current?.style.setProperty('--journey', String(Math.min(1, pos / (sceneOrder.length - 0.6))));
      }),
    [],
  );
  return (
    <div className="progress" ref={ref} aria-hidden>
      <div className="progress__dot" />
    </div>
  );
}
