import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { onSceneProgress, registerScene } from '../../lib/scroll';
import { sceneOrder, type SceneId } from '../../lib/world';

const ProgressContext = createContext(0);

/** Progress (0 → 1) through the scene this component lives in. */
export function useSceneProgress() {
  return useContext(ProgressContext);
}

interface SceneProps {
  id: SceneId;
  /** How long the scene lasts, in screen heights of scrolling. */
  length: number;
  className?: string;
  children: ReactNode;
  /** Accessible name for the section. */
  label?: string;
}

/**
 * A pinned stage inside a tall section. Children read progress through
 * `useSceneProgress()`; only the scene currently on screen re-renders.
 */
export function Scene({ id, length, className = '', children, label }: SceneProps) {
  const ref = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

  useLayoutEffect(() => {
    if (!ref.current) return;
    return registerScene(id, sceneOrder.indexOf(id), ref.current);
  }, [id]);

  useEffect(() => onSceneProgress(id, setProgress), [id]);

  return (
    <section
      ref={ref}
      className={`scene scene--${id} ${className}`}
      style={{ height: `${length * 100}svh` }}
      aria-label={label}
    >
      <div className="stage">
        <ProgressContext.Provider value={progress}>{children}</ProgressContext.Provider>
      </div>
    </section>
  );
}
