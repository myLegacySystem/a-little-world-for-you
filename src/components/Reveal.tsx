import type { CSSProperties, ElementType } from 'react';
import { useBeat, useSceneProgress } from '../scenes/Scene';
import { Words } from './Words';

interface RevealProps {
  /** A string from content/text.ts. */
  text: string;
  /** Progress at which it appears. */
  at: number;
  /** Progress at which it leaves again (omit to stay). */
  out?: number;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
}

/**
 * Words that drift into the world line by line when the scroll reaches `at`,
 * and dissolve at `out`. The motion itself is time-based, so it stays calm
 * however fast she scrolls. Autoplay stops at `at` long enough to read it.
 */
export function Reveal({ text, at, out = Infinity, as: Tag = 'p', className = '', style }: RevealProps) {
  const p = useSceneProgress();
  useBeat(at, text);
  const state = p < at ? 'before' : p >= out ? 'after' : 'on';
  if (!text) return null;
  return (
    <Tag className={`reveal reveal--${state} ${className}`} style={style} aria-hidden={state !== 'on'}>
      <Words text={text} />
    </Tag>
  );
}
