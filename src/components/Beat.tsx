import { useBeat } from '../scenes/Scene';

/** A wordless moment autoplay stops at for a few `seconds`, so the world can be seen. */
export function Beat({ at, seconds }: { at: number; seconds: number }) {
  useBeat(at, seconds);
  return null;
}
