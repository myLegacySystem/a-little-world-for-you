import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { onSceneProgress, registerScene } from '../utils/scroll';
import { SCENES, sceneIndex, type SceneId } from './config';

const SceneContext = createContext({ progress: 0, index: 0 });

/** Progress (0 → 1) through the scene this component lives in. */
export function useSceneProgress() {
  return useContext(SceneContext).progress;
}

export function useSceneIndex() {
  return useContext(SceneContext).index;
}

interface SceneProps {
  id: SceneId;
  /** Accessible name for the section. */
  label: string;
  className?: string;
  children: ReactNode;
}

/**
 * A pinned stage inside a tall section (length comes from scenes/config.ts).
 * Children read progress via useSceneProgress(); only the scene on screen
 * re-renders as you scroll.
 */
export function Scene({ id, label, className = '', children }: SceneProps) {
  const ref = useRef<HTMLElement>(null);
  const index = sceneIndex(id);
  const [progress, setProgress] = useState(0);

  useLayoutEffect(() => {
    if (!ref.current) return;
    return registerScene(id, index, ref.current);
  }, [id, index]);

  useEffect(() => onSceneProgress(id, setProgress), [id]);

  return (
    <section
      ref={ref}
      className={`scene scene--${id} ${className}`}
      style={{ height: `${SCENES[index].length * 100}svh` }}
      aria-label={label}
    >
      <div className="stage">
        <SceneContext.Provider value={{ progress, index }}>{children}</SceneContext.Provider>
      </div>
    </section>
  );
}
