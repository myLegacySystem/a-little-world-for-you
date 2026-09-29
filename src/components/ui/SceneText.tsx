import type { CSSProperties, ElementType, ReactNode } from 'react';
import { useSceneProgress } from '../scenes/Scene';

interface RevealProps {
  /** Progress at which this appears. */
  at: number;
  /** Progress at which it leaves again (omit to stay). */
  out?: number;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}

/**
 * Text that lives in the environment: it drifts in softly when the scroll
 * reaches `at` and dissolves at `out`. The motion itself is time-based
 * (CSS transitions), so it always feels calm however fast someone scrolls.
 */
export function Reveal({ at, out = Infinity, as: Tag = 'p', className = '', style, children }: RevealProps) {
  const p = useSceneProgress();
  const state = p < at ? 'before' : p >= out ? 'after' : 'on';
  return (
    <Tag className={`reveal reveal--${state} ${className}`} style={style} aria-hidden={state !== 'on'}>
      {children}
    </Tag>
  );
}

interface LinesProps {
  lines: string[];
  /** Progress range the lines appear over (first at `from`, last at `to`). */
  from: number;
  to: number;
  /** When the whole group leaves. */
  out?: number;
  className?: string;
  lineClassName?: string;
}

/** A group of short lines revealed one after another. */
export function SceneText({ lines, from, to, out, className = '', lineClassName = '' }: LinesProps) {
  const step = lines.length > 1 ? (to - from) / (lines.length - 1) : 0;
  return (
    <div className={`lines ${className}`}>
      {lines.map((line, i) => (
        <Reveal key={i} at={from + step * i} out={out} className={`line ${lineClassName}`}>
          {line}
        </Reveal>
      ))}
    </div>
  );
}
