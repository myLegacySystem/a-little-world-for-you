/**
 * The music, independent of React and of the scenes.
 *
 * One <audio> element streams one song at a time (nothing is preloaded up
 * front). Volume goes through a Web Audio gain node when available, so fades
 * are smooth on every platform (iOS ignores `audio.volume`).
 */

import { defaultVolume, playlist, type Song } from '../../data/playlist';
import { getSongUrl } from '../../lib/assets';

export interface AudioSnapshot {
  index: number;
  song: Song;
  playing: boolean;
  /** Seconds. */
  time: number;
  duration: number;
  volume: number;
  /** True once the listener has started the music at least once. */
  started: boolean;
}

const FADE_IN = 1.6;
const FADE_OUT = 0.9;

class AudioEngine {
  private audio: HTMLAudioElement | null = null;
  private ctx: AudioContext | null = null;
  private gain: GainNode | null = null;
  private listeners = new Set<() => void>();
  private fadeFrame = 0;
  private level = 0;
  private snap: AudioSnapshot = {
    index: 0,
    song: playlist[0],
    playing: false,
    time: 0,
    duration: 0,
    volume: defaultVolume,
    started: false,
  };

  subscribe = (fn: () => void) => {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  };

  getSnapshot = () => this.snap;

  private set(patch: Partial<AudioSnapshot>) {
    this.snap = { ...this.snap, ...patch };
    this.listeners.forEach((l) => l());
  }

  private ensure() {
    if (this.audio) return this.audio;
    const audio = new Audio();
    audio.preload = 'none';
    audio.crossOrigin = 'anonymous'; // Supabase Storage sends CORS headers.
    audio.src = getSongUrl(this.snap.song);
    audio.addEventListener('timeupdate', () => this.set({ time: audio.currentTime }));
    audio.addEventListener('durationchange', () => this.set({ duration: audio.duration || 0 }));
    audio.addEventListener('ended', () => this.select(this.snap.index + 1, true));
    audio.addEventListener('pause', () => this.set({ playing: false }));
    audio.addEventListener('play', () => this.set({ playing: true }));
    this.audio = audio;

    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (Ctx) {
      try {
        this.ctx = new Ctx();
        this.gain = this.ctx.createGain();
        this.gain.gain.value = 0;
        this.ctx.createMediaElementSource(audio).connect(this.gain).connect(this.ctx.destination);
      } catch {
        this.ctx = null;
        this.gain = null;
      }
    }
    this.apply(0);
    return audio;
  }

  private apply(level: number) {
    this.level = level;
    const v = level * this.snap.volume;
    if (this.gain) this.gain.gain.value = v;
    else if (this.audio) this.audio.volume = Math.min(1, Math.max(0, v));
  }

  private fadeTo(target: number, seconds: number): Promise<void> {
    cancelAnimationFrame(this.fadeFrame);
    const from = this.level;
    const start = performance.now();
    return new Promise((resolve) => {
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / (seconds * 1000));
        this.apply(from + (target - from) * (1 - Math.cos(t * Math.PI)) * 0.5);
        if (t < 1) this.fadeFrame = requestAnimationFrame(step);
        else resolve();
      };
      this.fadeFrame = requestAnimationFrame(step);
    });
  }

  async play() {
    const audio = this.ensure();
    if (this.ctx?.state === 'suspended') await this.ctx.resume().catch(() => {});
    try {
      await audio.play();
      this.set({ started: true });
      await this.fadeTo(1, FADE_IN);
    } catch {
      // Autoplay refused — the listener will need to tap once more.
    }
  }

  async pause() {
    if (!this.audio) return;
    await this.fadeTo(0, FADE_OUT);
    this.audio.pause();
  }

  toggle() {
    return this.snap.playing ? this.pause() : this.play();
  }

  /** Switch song. Keeps playing if we were; `autoplay` forces either way. */
  async select(index: number, autoplay?: boolean) {
    const i = (index + playlist.length) % playlist.length;
    const audio = this.ensure();
    const wasPlaying = autoplay ?? (this.snap.playing || !this.snap.started);
    if (this.snap.playing) await this.fadeTo(0, FADE_OUT);
    this.apply(0);
    audio.src = getSongUrl(playlist[i]);
    this.set({ index: i, song: playlist[i], time: 0, duration: 0 });
    if (wasPlaying) await this.play();
  }

  next() {
    return this.select(this.snap.index + 1);
  }

  prev() {
    // Like most players: restart the song unless we're near its beginning.
    if (this.audio && this.audio.currentTime > 4) {
      this.audio.currentTime = 0;
      return Promise.resolve();
    }
    return this.select(this.snap.index - 1);
  }

  seek(fraction: number) {
    if (this.audio && this.snap.duration) this.audio.currentTime = fraction * this.snap.duration;
  }

  setVolume(volume: number) {
    this.set({ volume });
    this.apply(this.level);
  }
}

export const audioEngine = new AudioEngine();
