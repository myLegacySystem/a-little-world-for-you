import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { audioEngine } from '../audio/audioEngine';
import { TEXT } from '../content/text';
import { useEntered } from '../hooks/useEntered';

/**
 * Almost invisible: a small ♪ with three hairline bars that move while music
 * plays. Tap it to pause or play; a tiny drawer offers the previous and next
 * song. That's all.
 */
export function MusicControl() {
  const s = useSyncExternalStore(audioEngine.subscribe, audioEngine.getSnapshot);
  const entered = useEntered();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const closeTimer = useRef(0);

  useEffect(() => {
    if (!open) return;
    const close = (e: Event) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('pointerdown', close);
    window.addEventListener('keydown', esc);
    return () => {
      window.removeEventListener('pointerdown', close);
      window.removeEventListener('keydown', esc);
    };
  }, [open]);

  if (!entered) return null;

  const linger = () => {
    window.clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const leave = () => {
    closeTimer.current = window.setTimeout(() => setOpen(false), 1600);
  };

  return (
    <div
      ref={ref}
      className={`music ${open ? 'is-open' : ''} ${s.playing ? 'is-playing' : ''}`}
      onPointerEnter={(e) => e.pointerType === 'mouse' && linger()}
      onPointerLeave={(e) => e.pointerType === 'mouse' && leave()}
    >
      <div className="music__drawer" aria-hidden={!open}>
        <span className="music__title" aria-label={TEXT.MUSIC_NOW_PLAYING}>
          {s.song.title}
        </span>
        <button type="button" aria-label={TEXT.MUSIC_PREVIOUS} tabIndex={open ? 0 : -1} onClick={() => audioEngine.prev()}>
          <svg viewBox="0 0 16 16" aria-hidden>
            <path d="M4 3v10M13 3 6 8l7 5" />
          </svg>
        </button>
        <button type="button" aria-label={TEXT.MUSIC_NEXT} tabIndex={open ? 0 : -1} onClick={() => audioEngine.next()}>
          <svg viewBox="0 0 16 16" aria-hidden>
            <path d="M12 3v10M3 3l7 5-7 5" />
          </svg>
        </button>
      </div>
      <button
        type="button"
        className="music__toggle"
        aria-label={s.playing ? TEXT.MUSIC_PAUSE : TEXT.MUSIC_PLAY}
        aria-pressed={s.playing}
        onClick={() => {
          audioEngine.toggle();
          setOpen(true);
          leave();
        }}
      >
        <svg className="music__note" viewBox="0 0 16 20" aria-hidden>
          <path d="M6 15.5V3.5l8-2v11" />
          <ellipse cx="4" cy="15.8" rx="2.6" ry="2" />
          <ellipse cx="12" cy="12.8" rx="2.6" ry="2" />
        </svg>
        <span className="music__bars" aria-hidden>
          <i />
          <i />
          <i />
        </span>
      </button>
    </div>
  );
}
