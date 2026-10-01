import { useEffect, useRef, useState, type CSSProperties } from 'react';
import type { Photo as PhotoData } from '../content/photos';
import { getPhotoUrl } from '../utils/assets';

type Variant = 'print' | 'cinema' | 'soft';

interface PhotoProps {
  photo: PhotoData;
  /** 0 → 1 presence, usually derived from scene progress. */
  visible: number;
  variant?: Variant;
  /** A small caption under a print (from content/text.ts). */
  caption?: string;
  className?: string;
  style?: CSSProperties;
}

/**
 * A photograph as an object in the world, not a gallery card:
 *   print  — a small printed photo with a cream border, a tilt and a shadow
 *   cinema — a wide, edge-faded crop that fills the frame
 *   soft   — a floating portrait with dissolving edges
 * It rises out of soft focus as it arrives and only loads when it's near.
 */
export function Photo({ photo, visible, variant = 'print', caption, className = '', style }: PhotoProps) {
  const ref = useRef<HTMLElement>(null);
  const [near, setNear] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (near || !ref.current) return;
    const io = new IntersectionObserver((entries) => entries.some((e) => e.isIntersecting) && setNear(true), {
      rootMargin: '120% 0px',
    });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [near]);

  const v = loaded ? Math.min(1, Math.max(0, visible)) : 0;

  return (
    <figure
      ref={ref}
      className={`photo photo--${variant} ${className}`}
      style={{ ...style, '--v': v } as CSSProperties}
      aria-hidden={v < 0.4}
    >
      <div className="photo__frame">
        {near && (
          <img
            src={getPhotoUrl(photo)}
            alt={photo.alt}
            decoding="async"
            draggable={false}
            style={{ objectPosition: photo.focus }}
            onLoad={() => setLoaded(true)}
          />
        )}
      </div>
      {caption && <figcaption className="photo__caption">{caption}</figcaption>}
    </figure>
  );
}
