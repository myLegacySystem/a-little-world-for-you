import { useEffect, useRef, useState, type CSSProperties } from 'react';
import type { Photo as PhotoData } from '../content/photos';
import { getPhotoUrl } from '../utils/assets';
import { removeWorldPhoto, setWorldPhoto } from '../utils/photoAnchor';

type Variant = 'print' | 'soft';

interface PhotoProps {
  photo: PhotoData;
  /** 0 → 1 presence, usually derived from scene progress. */
  visible: number;
  variant?: Variant;
  /** A small caption under a print (from content/text.ts). */
  caption?: string;
  className?: string;
  style?: CSSProperties;
  /** Tilt in degrees, shared by the page layout and the 3D print. */
  tilt?: number;
}

/**
 * A photograph as an object in the world, not a gallery card:
 *   print — a small printed photo with a cream border, a tilt and a shadow
 *   soft  — a floating portrait with dissolving edges
 * It rises out of soft focus as it arrives and only loads when it's near.
 *
 * When WebGL is running, the photograph is drawn inside the 3D world instead
 * (see three/Memories.ts): it materialises from specks of light and floats in
 * depth. This element then keeps only its place in the layout and the alt text.
 */
export function Photo({ photo, visible, variant = 'print', caption, className = '', style, tilt = 0 }: PhotoProps) {
  const ref = useRef<HTMLElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const key = `${photo.id}:${variant}`;

  useEffect(() => {
    if (!frame.current || variant === 'soft') return;
    setWorldPhoto({
      key,
      el: frame.current,
      url: getPhotoUrl(photo),
      visible: Math.min(1, Math.max(0, visible)),
      tilt,
    });
  }, [key, photo, variant, visible, tilt]);

  useEffect(() => () => removeWorldPhoto(key), [key]);
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
      style={{ ...style, rotate: tilt ? `${tilt}deg` : undefined, '--v': v } as CSSProperties}
      aria-hidden={v < 0.4}
    >
      <div className="photo__frame" ref={frame}>
        {near && (
          <img
            src={getPhotoUrl(photo)}
            alt={photo.alt}
            decoding="async"
            crossOrigin="anonymous"
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
