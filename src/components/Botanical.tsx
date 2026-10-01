import type { CSSProperties } from 'react';

type Kind = 'sprig' | 'bloom' | 'stem';

/**
 * Hand-drawn botanical accents: a single fine line that draws itself when
 * `on` becomes true. Used sparingly, only in the warm parts of the story.
 */
export function Botanical({ kind, on, className = '', style }: { kind: Kind; on: boolean; className?: string; style?: CSSProperties }) {
  return (
    <svg
      className={`botanical botanical--${kind} ${on ? 'is-on' : ''} ${className}`}
      style={style}
      viewBox="0 0 120 160"
      aria-hidden
    >
      {kind === 'sprig' && (
        <>
          <path pathLength={1} d="M60 156 C 58 120, 64 86, 58 44 C 56 30, 60 16, 66 6" />
          <path pathLength={1} d="M59 120 C 44 112, 34 100, 30 86 C 44 88, 55 100, 59 118" />
          <path pathLength={1} d="M61 98 C 76 92, 86 80, 90 66 C 76 68, 65 80, 61 96" />
          <path pathLength={1} d="M58 72 C 45 64, 38 52, 37 40 C 49 44, 57 56, 58 70" />
          <path pathLength={1} d="M60 50 C 72 44, 78 34, 80 22 C 69 25, 62 36, 60 48" />
        </>
      )}
      {kind === 'bloom' && (
        <>
          <path pathLength={1} d="M60 158 C 62 128, 56 104, 60 76" />
          <path pathLength={1} d="M60 120 C 48 116, 40 106, 38 96 C 50 98, 57 106, 60 118" />
          <path pathLength={1} d="M60 76 C 50 70, 46 58, 52 50 C 56 56, 59 64, 60 76 C 61 64, 64 56, 68 50 C 74 58, 70 70, 60 76" />
          <path pathLength={1} d="M60 76 C 48 74, 40 66, 40 58 C 48 58, 56 66, 60 76 C 64 66, 72 58, 80 58 C 80 66, 72 74, 60 76" />
          <path pathLength={1} d="M60 62 C 58 56, 60 50, 60 46" />
        </>
      )}
      {kind === 'stem' && (
        <>
          <path pathLength={1} d="M14 150 C 40 120, 62 98, 104 18" />
          <path pathLength={1} d="M48 104 C 40 92, 40 80, 46 70 C 52 80, 52 94, 48 104" />
          <path pathLength={1} d="M66 76 C 78 72, 88 74, 94 82 C 84 86, 74 84, 66 76" />
          <path pathLength={1} d="M82 46 C 76 36, 76 26, 82 18 C 88 28, 88 38, 82 46" />
        </>
      )}
    </svg>
  );
}
