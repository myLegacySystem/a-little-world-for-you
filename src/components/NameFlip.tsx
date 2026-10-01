import { useEffect, useState, type ReactNode } from 'react';
import { reducedMotion } from '../utils/device';

interface NameFlipProps {
  names: readonly string[];
  /** Only flips while true (e.g. once the title is on screen). */
  active: boolean;
  /** Shown right after whichever name is showing (and flips with it). */
  suffix?: ReactNode;
}

/**
 * The names I call her, taking turns: each one flips away and the next flips
 * in. All names share one spot, so the layout never jumps between short and
 * long ones. Screen readers hear the whole list once instead of the changes.
 */
export function NameFlip({ names, active, suffix }: NameFlipProps) {
  const [index, setIndex] = useState(0);
  const [previous, setPrevious] = useState(-1);
  const many = names.length > 1;

  useEffect(() => {
    if (!active || !many) return;
    const id = window.setInterval(
      () => {
        if (document.hidden) return;
        setIndex((i) => {
          setPrevious(i);
          return (i + 1) % names.length;
        });
      },
      reducedMotion ? 4200 : 2600,
    );
    return () => window.clearInterval(id);
  }, [active, many, names.length]);

  if (!names.length) return null;

  return (
    <span className="name-flip">
      <span className="visually-hidden">{names.join(', ')}</span>
      {names.map((name, i) => (
        <span
          key={name}
          aria-hidden
          className={`name-flip__name ${i === index ? 'is-in' : i === previous ? 'is-out' : 'is-waiting'}`}
        >
          {name}
          {suffix}
        </span>
      ))}
    </span>
  );
}
