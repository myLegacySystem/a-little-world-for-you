import { useEffect, useRef, useState, type CSSProperties } from 'react';
import type { PhotoRef } from '../../data/content';
import { getImageUrl } from '../../lib/assets';

interface PhotoProps {
  photo: PhotoRef;
  /** 0 → 1 visibility, usually derived from scene progress. */
  visible: number;
  className?: string;
  style?: CSSProperties;
  /** Load straight away instead of waiting to approach the viewport. */
  eager?: boolean;
}

/**
 * A photograph as a memory, not a card: soft-edged, floating, glowing
 * slightly, sharpening as it arrives. Only loads when it's about to be needed.
 */
export function Photo({ photo, visible, className = '', style, eager = false }: PhotoProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(eager);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (near || !ref.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) setNear(true);
      },
      { rootMargin: '150% 0px' },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [near]);

  const v = loaded ? Math.min(1, Math.max(0, visible)) : 0;

  return (
    <div
      ref={ref}
      className={`photo ${className}`}
      style={{ ...style, '--v': v } as CSSProperties}
      aria-hidden={v < 0.5}
    >
      <div className="photo__glow" />
      {near && (
        <img
          src={getImageUrl(photo)}
          alt={photo.alt}
          decoding="async"
          draggable={false}
          onLoad={() => setLoaded(true)}
        />
      )}
    </div>
  );
}
