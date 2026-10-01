import { useLayoutEffect, useRef } from 'react';
import { useSceneIndex } from '../scenes/Scene';
import { setHeartAnchor } from '../utils/heartAnchor';

/**
 * An invisible box in a scene's layout. The 3D heart glides to fill it,
 * so where the heart sits is decided by CSS like everything else.
 */
export function HeartAnchor({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const index = useSceneIndex();
  useLayoutEffect(() => {
    setHeartAnchor(index, ref.current);
    return () => setHeartAnchor(index, null);
  }, [index]);
  return <div ref={ref} className={`heart-anchor ${className}`} aria-hidden />;
}
