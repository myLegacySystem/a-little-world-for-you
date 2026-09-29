import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type PointerEvent } from 'react';
import { content } from '../../data/content';
import { audioEngine } from './audioEngine';
import { Bars, Playlist } from './Playlist';

/**
 * A small floating music control. Collapsed it's just a pill with the song
 * name; open it for controls and the playlist. Lives outside the scenes so the
 * music carries on through every transition.
 */
export function MusicPlayer() {
  const s = useSyncExternalStore(audioEngine.subscribe, audioEngine.getSnapshot);
  const [open, setOpen] = useState(false);
  const [hint, setHint] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // First tap / key anywhere starts the music (browsers need a gesture).
  useEffect(() => {
    if (s.started) return;
    const t = window.setTimeout(() => setHint(true), 2500);
    const begin = (e: Event) => {
      if ((e.target as Element | null)?.closest?.('.player')) return;
      audioEngine.play();
    };
    window.addEventListener('pointerup', begin);
    window.addEventListener('keydown', begin);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener('pointerup', begin);
      window.removeEventListener('keydown', begin);
    };
  }, [s.started]);

  // Close the panel when tapping elsewhere.
  useEffect(() => {
    if (!open) return;
    const close = (e: Event) => {
      if (!panelRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('pointerdown', close);
    window.addEventListener('keydown', esc);
    return () => {
      window.removeEventListener('pointerdown', close);
      window.removeEventListener('keydown', esc);
    };
  }, [open]);

  const progress = s.duration ? s.time / s.duration : 0;
  const seek = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    audioEngine.seek(Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)));
  };

  return (
    <>
      <div className={`sound-hint ${hint && !s.started ? 'is-on' : ''}`} aria-hidden>
        {content.ui.soundHint}
      </div>
      <div ref={panelRef} className={`player ${open ? 'is-open' : ''} ${s.playing ? 'is-playing' : ''}`}>
        <div className="player__panel" role="dialog" aria-label="Music" aria-hidden={!open}>
          <div className="player__now">
            <span className="player__title">{s.song.title}</span>
            {s.song.artist && <span className="player__artist">{s.song.artist}</span>}
          </div>
          <div
            className="player__progress"
            role="slider"
            aria-label="Seek"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress * 100)}
            tabIndex={open ? 0 : -1}
            onPointerDown={seek}
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight') audioEngine.seek(Math.min(1, progress + 0.05));
              if (e.key === 'ArrowLeft') audioEngine.seek(Math.max(0, progress - 0.05));
            }}
          >
            <div className="player__bar" style={{ transform: `scaleX(${progress})` }} />
          </div>
          <div className="player__controls">
            <button type="button" aria-label="Previous song" onClick={() => audioEngine.prev()} tabIndex={open ? 0 : -1}>
              <svg viewBox="0 0 24 24"><path d="M7 6v12M18 6l-8 6 8 6z" /></svg>
            </button>
            <button type="button" className="player__play" aria-label={s.playing ? 'Pause' : 'Play'} onClick={() => audioEngine.toggle()} tabIndex={open ? 0 : -1}>
              {s.playing ? (
                <svg viewBox="0 0 24 24"><path d="M9 6v12M15 6v12" /></svg>
              ) : (
                <svg viewBox="0 0 24 24"><path d="M8 5.5v13l10-6.5z" /></svg>
              )}
            </button>
            <button type="button" aria-label="Next song" onClick={() => audioEngine.next()} tabIndex={open ? 0 : -1}>
              <svg viewBox="0 0 24 24"><path d="M17 6v12M6 6l8 6-8 6z" /></svg>
            </button>
            <label className="player__volume">
              <svg viewBox="0 0 24 24" aria-hidden><path d="M4 10v4h3l5 4V6L7 10zM16 9.5a3.5 3.5 0 0 1 0 5" /></svg>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={s.volume}
                aria-label="Volume"
                tabIndex={open ? 0 : -1}
                onChange={(e) => audioEngine.setVolume(Number(e.target.value))}
                style={{ '--vol': s.volume } as CSSProperties}
              />
            </label>
          </div>
          <Playlist current={s.index} playing={s.playing} />
        </div>
        <button
          type="button"
          className="player__pill"
          aria-expanded={open}
          aria-label={open ? 'Hide music controls' : 'Show music controls'}
          onClick={() => {
            if (!s.started) audioEngine.play();
            setOpen((o) => !o);
          }}
        >
          <Bars still={!s.playing} />
          <span className="player__pill-title">{s.song.title}</span>
        </button>
      </div>
    </>
  );
}
