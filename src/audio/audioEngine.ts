/**
 * The music — independent of React and of the scenes, so it never stops
 * between them.
 *
 * One <audio> element streams one song at a time (nothing preloads). Through
 * Web Audio, the sound also belongs to the world:
 *   - it fades in and out instead of starting or stopping abruptly,
 *   - underwater it becomes gently muffled, and opens up again at the surface,
 *   - in the quietest moment it steps back a little,
 *   - its soft loudness lets the heart's glow breathe with it (barely).
 *
 * Songs whose file can't be loaded are skipped; if none of the playlist can
 * be played, the placeholder pieces play instead.
 */

import { DEFAULT_VOLUME, FALLBACK_PLAYLIST, type Song } from '../content/songs';
import { getPlaylist, getSongUrl } from '../utils/assets';

export interface AudioSnapshot {
  index: number;
  song: Song;
  playing: boolean;
  started: boolean;
}

const FADE_IN = 2.2;
const FADE_OUT = 1.0;

class AudioEngine {
  private audio: HTMLAudioElement | null = null;
  private ctx: AudioContext | null = null;
  private gain: GainNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private analyser: AnalyserNode | null = null;
  private levels: Uint8Array | null = null;
  private listeners = new Set<() => void>();
  private fadeFrame = 0;
  private fade = 0;
  private mood = 1;
  /** Chosen on first use: by then we know whether the songs come from Supabase. */
  private list: readonly Song[] = FALLBACK_PLAYLIST;
  private missing = new Set<string>();
  /** Whether she wants music right now (survives skipping a missing song). */
  private wanted = false;
  private snap: AudioSnapshot = { index: 0, song: this.list[0], playing: false, started: false };

  subscribe = (fn: () => void) => {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  };

  getSnapshot = () => this.snap;

  private set(patch: Partial<AudioSnapshot>) {
    this.snap = { ...this.snap, ...patch };
    this.listeners.forEach((l) => l());
  }

  private ensure() {
    if (this.audio) return this.audio;
    const playlist = getPlaylist();
    this.list = playlist.length ? playlist : FALLBACK_PLAYLIST;
    this.snap = { ...this.snap, index: 0, song: this.list[0] };
    const audio = new Audio();
    audio.preload = 'none';
    audio.crossOrigin = 'anonymous'; // Supabase Storage sends CORS headers.
    audio.src = getSongUrl(this.snap.song);
    audio.addEventListener('ended', () => this.select(this.snap.index + 1, true));
    audio.addEventListener('error', () => this.skipMissing());
    audio.addEventListener('pause', () => this.set({ playing: false }));
    audio.addEventListener('play', () => this.set({ playing: true }));
    this.audio = audio;

    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (Ctx) {
      try {
        const ctx = new Ctx();
        const source = ctx.createMediaElementSource(audio);
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 20000;
        filter.Q.value = 0.4;
        const gain = ctx.createGain();
        gain.gain.value = 0;
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.85;
        source.connect(filter).connect(gain).connect(ctx.destination);
        gain.connect(analyser);
        this.ctx = ctx;
        this.filter = filter;
        this.gain = gain;
        this.analyser = analyser;
        this.levels = new Uint8Array(analyser.fftSize);
      } catch {
        this.ctx = null;
      }
    }
    this.apply();
    return audio;
  }

  private apply() {
    const v = this.fade * this.mood * DEFAULT_VOLUME;
    if (this.gain) this.gain.gain.value = v;
    else if (this.audio) this.audio.volume = Math.min(1, Math.max(0, v));
  }

  private fadeTo(target: number, seconds: number): Promise<void> {
    cancelAnimationFrame(this.fadeFrame);
    const from = this.fade;
    const start = performance.now();
    return new Promise((resolve) => {
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / (seconds * 1000));
        this.fade = from + (target - from) * (1 - Math.cos(t * Math.PI)) * 0.5;
        this.apply();
        if (t < 1) this.fadeFrame = requestAnimationFrame(step);
        else resolve();
      };
      this.fadeFrame = requestAnimationFrame(step);
    });
  }

  /** The current song's file couldn't be loaded: move on quietly. */
  private skipMissing() {
    this.missing.add(this.snap.song.id);
    if (this.list.every((song) => this.missing.has(song.id))) {
      if (this.list !== FALLBACK_PLAYLIST) {
        this.list = FALLBACK_PLAYLIST;
        this.select(0, this.wanted);
      }
      return;
    }
    this.select(this.snap.index + 1, this.wanted);
  }

  async play() {
    this.wanted = true;
    const audio = this.ensure();
    if (this.ctx?.state === 'suspended') await this.ctx.resume().catch(() => {});
    try {
      await audio.play();
      this.set({ started: true });
      await this.fadeTo(1, FADE_IN);
    } catch {
      // Autoplay refused or file missing — the ♪ control lets her try again.
    }
  }

  async pause() {
    this.wanted = false;
    if (!this.audio) return;
    await this.fadeTo(0, FADE_OUT);
    this.audio.pause();
  }

  toggle() {
    return this.snap.playing ? this.pause() : this.play();
  }

  /** Switch song. Keeps playing if we were; `autoplay` forces either way. */
  async select(index: number, autoplay?: boolean) {
    const audio = this.ensure();
    const n = this.list.length;
    const step = index < this.snap.index ? -1 : 1;
    let i = ((index % n) + n) % n;
    // Skip songs already known to be missing.
    for (let k = 0; k < n && this.missing.has(this.list[i].id); k++) i = (((i + step) % n) + n) % n;
    const play = autoplay ?? this.snap.playing;
    if (this.snap.playing) await this.fadeTo(0, FADE_OUT);
    this.fade = 0;
    this.apply();
    audio.src = getSongUrl(this.list[i]);
    this.set({ index: i, song: this.list[i] });
    if (play) await this.play();
  }

  next() {
    return this.select(this.snap.index + 1);
  }

  prev() {
    if (this.audio && this.audio.currentTime > 4) {
      this.audio.currentTime = 0;
      return Promise.resolve();
    }
    return this.select(this.snap.index - 1);
  }

  /**
   * Called by the world every frame. `underwater` muffles the sound (0–1),
   * `quiet` lowers it a little (0–1).
   */
  setAtmosphere(underwater: number, quiet: number) {
    if (this.filter && this.ctx) {
      const hz = 20000 * Math.pow(1500 / 20000, underwater);
      this.filter.frequency.setTargetAtTime(hz, this.ctx.currentTime, 0.25);
    }
    const mood = 1 - quiet * 0.22;
    if (Math.abs(mood - this.mood) > 0.002) {
      this.mood = mood;
      this.apply();
    }
  }

  /** Soft loudness of what's playing, 0–1. */
  level() {
    if (!this.analyser || !this.levels || !this.snap.playing) return 0;
    this.analyser.getByteTimeDomainData(this.levels);
    let sum = 0;
    for (let i = 0; i < this.levels.length; i++) {
      const v = (this.levels[i] - 128) / 128;
      sum += v * v;
    }
    return Math.min(1, Math.sqrt(sum / this.levels.length) * 4);
  }
}

export const audioEngine = new AudioEngine();
