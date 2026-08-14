"use client";

// Procedural sound engine — Web Audio API, zero audio files
// All sounds are synthesized: subtle, tactile, UI-grade

type SoundName =
  | "click"
  | "hover"
  | "open"
  | "close"
  | "whoosh"
  | "whooshUp"
  | "whooshDown"
  | "success"
  | "pop"
  | "reveal"
  | "toggle"
  | "party"
  | "cardHover"
  | "cardClick"
  | "sectionEnter"
  | "milestone"
  | "typing"
  | "shimmer"
  | "swooshIn"
  | "swooshOut"
  | "chime"
  | "tick"
  | "drop";

class SoundEngine {
  private ctx: AudioContext | null = null;
  private _muted: boolean = true;
  private _volume: number = 0.3;
  private listeners: Set<() => void> = new Set();
  private lastPlayed: Map<string, number> = new Map();

  private getCtx(): AudioContext {
    if (!this.ctx) {
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  get muted() {
    return this._muted;
  }

  toggle() {
    this._muted = !this._muted;
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("sound-muted", String(this._muted));
    }
    if (!this._muted) {
      const ctx = this.getCtx();
      const playToggle = () => this.play("toggle");
      if (ctx.state === "running") {
        playToggle();
      } else {
        ctx.resume().then(playToggle).catch(() => {});
      }
    }
    this.listeners.forEach((fn) => fn());
  }

  subscribe(fn: () => void) {
    this.listeners.add(fn);
    return () => { this.listeners.delete(fn); };
  }

  hydrate() {
    if (typeof localStorage !== "undefined") {
      const stored = localStorage.getItem("sound-muted");
      if (stored !== null) {
        this._muted = stored === "true";
      }
    }
  }

  // Throttled play — prevents spam from scroll events
  playThrottled(name: SoundName, cooldownMs = 300) {
    const now = Date.now();
    const last = this.lastPlayed.get(name) || 0;
    if (now - last < cooldownMs) return;
    this.lastPlayed.set(name, now);
    this.play(name);
  }

  play(name: SoundName) {
    if (this._muted) return;
    try {
      const ctx = this.getCtx();
      if (ctx.state !== "running") {
        ctx.resume().then(() => this.play(name)).catch(() => {});
        return;
      }
      const now = ctx.currentTime;
      const v = this._volume;

      switch (name) {
        // ─── BASIC UI ───
        case "click":
          this.synth(ctx, now, { type: "sine", freq: 800, freqEnd: 600, duration: 0.06, volume: v * 0.35, attack: 0.002 });
          break;

        case "hover":
          this.synth(ctx, now, { type: "sine", freq: 1200, freqEnd: 1100, duration: 0.04, volume: v * 0.12, attack: 0.005 });
          break;

        case "toggle":
          this.synth(ctx, now, { type: "triangle", freq: 880, freqEnd: 1100, duration: 0.08, volume: v * 0.25, attack: 0.005 });
          break;

        // ─── CARD INTERACTIONS ───
        case "cardHover":
          // Soft high-pitched tick — like a fingertip tapping glass
          this.synth(ctx, now, { type: "sine", freq: 2200, freqEnd: 1800, duration: 0.035, volume: v * 0.1, attack: 0.002 });
          this.synth(ctx, now + 0.01, { type: "sine", freq: 4400, freqEnd: 3600, duration: 0.02, volume: v * 0.04, attack: 0.002 });
          break;

        case "cardClick":
          // Deeper satisfying press — two-layer thunk + air
          this.synth(ctx, now, { type: "sine", freq: 500, freqEnd: 300, duration: 0.1, volume: v * 0.35, attack: 0.002 });
          this.synth(ctx, now + 0.015, { type: "sine", freq: 900, freqEnd: 600, duration: 0.07, volume: v * 0.15, attack: 0.003 });
          this.noise(ctx, now, { duration: 0.06, volume: v * 0.08, filterStart: 4000, filterEnd: 1500 });
          break;

        // ─── PANELS / VIEWERS ───
        case "open":
          this.synth(ctx, now, { type: "sine", freq: 350, freqEnd: 700, duration: 0.18, volume: v * 0.25, attack: 0.01 });
          this.synth(ctx, now + 0.04, { type: "sine", freq: 550, freqEnd: 1100, duration: 0.14, volume: v * 0.12, attack: 0.01 });
          this.noise(ctx, now + 0.02, { duration: 0.1, volume: v * 0.06, filterStart: 3000, filterEnd: 6000 });
          break;

        case "close":
          this.synth(ctx, now, { type: "sine", freq: 700, freqEnd: 300, duration: 0.15, volume: v * 0.2, attack: 0.005 });
          this.noise(ctx, now, { duration: 0.08, volume: v * 0.05, filterStart: 4000, filterEnd: 1000 });
          break;

        // ─── SWOOSHES ───
        case "whoosh":
          this.noise(ctx, now, { duration: 0.25, volume: v * 0.1, filterStart: 3000, filterEnd: 800 });
          break;

        case "whooshUp":
          // Rising swoosh — scroll entering a new section
          this.noise(ctx, now, { duration: 0.3, volume: v * 0.08, filterStart: 800, filterEnd: 4000 });
          this.synth(ctx, now, { type: "sine", freq: 200, freqEnd: 500, duration: 0.25, volume: v * 0.06, attack: 0.03 });
          break;

        case "whooshDown":
          // Falling swoosh
          this.noise(ctx, now, { duration: 0.3, volume: v * 0.08, filterStart: 4000, filterEnd: 800 });
          this.synth(ctx, now, { type: "sine", freq: 500, freqEnd: 200, duration: 0.25, volume: v * 0.06, attack: 0.03 });
          break;

        case "swooshIn":
          // Fast, tight sweep — element entering
          this.noise(ctx, now, { duration: 0.15, volume: v * 0.07, filterStart: 1000, filterEnd: 5000 });
          this.synth(ctx, now, { type: "sine", freq: 300, freqEnd: 800, duration: 0.12, volume: v * 0.08, attack: 0.005 });
          break;

        case "swooshOut":
          // Fast, tight sweep — element leaving
          this.noise(ctx, now, { duration: 0.15, volume: v * 0.07, filterStart: 5000, filterEnd: 1000 });
          this.synth(ctx, now, { type: "sine", freq: 800, freqEnd: 300, duration: 0.12, volume: v * 0.08, attack: 0.005 });
          break;

        // ─── SCROLL / SECTIONS ───
        case "sectionEnter":
          // Gentle atmospheric breath — barely there
          this.synth(ctx, now, { type: "sine", freq: 250, freqEnd: 400, duration: 0.4, volume: v * 0.06, attack: 0.08 });
          this.noise(ctx, now, { duration: 0.25, volume: v * 0.03, filterStart: 1500, filterEnd: 3000 });
          break;

        case "milestone":
          // Timeline milestone — gentle bell-like ding
          this.synth(ctx, now, { type: "sine", freq: 880, duration: 0.15, volume: v * 0.15, attack: 0.003 });
          this.synth(ctx, now, { type: "sine", freq: 1320, duration: 0.12, volume: v * 0.08, attack: 0.003 });
          this.synth(ctx, now, { type: "sine", freq: 1760, duration: 0.08, volume: v * 0.04, attack: 0.005 });
          break;

        case "reveal":
          this.synth(ctx, now, { type: "sine", freq: 300, freqEnd: 600, duration: 0.3, volume: v * 0.15, attack: 0.05 });
          this.noise(ctx, now, { duration: 0.15, volume: v * 0.05, filterStart: 2000, filterEnd: 4000 });
          break;

        // ─── FEEDBACK ───
        case "success":
          this.synth(ctx, now, { type: "sine", freq: 523, duration: 0.1, volume: v * 0.25, attack: 0.005 });
          this.synth(ctx, now + 0.1, { type: "sine", freq: 659, duration: 0.1, volume: v * 0.25, attack: 0.005 });
          this.synth(ctx, now + 0.2, { type: "sine", freq: 784, duration: 0.18, volume: v * 0.3, attack: 0.005 });
          break;

        case "pop":
          this.synth(ctx, now, { type: "sine", freq: 600, freqEnd: 200, duration: 0.08, volume: v * 0.4, attack: 0.001 });
          this.noise(ctx, now, { duration: 0.04, volume: v * 0.12, filterStart: 5000, filterEnd: 2000 });
          break;

        case "chime":
          // Delicate two-note chime — newsletter, voice connect
          this.synth(ctx, now, { type: "sine", freq: 1047, duration: 0.2, volume: v * 0.15, attack: 0.005 });
          this.synth(ctx, now + 0.12, { type: "sine", freq: 1319, duration: 0.25, volume: v * 0.18, attack: 0.005 });
          break;

        // ─── MICRO ───
        case "typing":
          // Keyboard tick — for typing animations
          this.synth(ctx, now, { type: "square", freq: 1800 + Math.random() * 400, freqEnd: 1200, duration: 0.015, volume: v * 0.06, attack: 0.001 });
          break;

        case "shimmer":
          // Sparkle/shine — for chrome text, wax seal, accents
          [0, 0.04, 0.08].forEach((d, i) => {
            this.synth(ctx, now + d, {
              type: "sine",
              freq: 2000 + i * 400 + Math.random() * 200,
              freqEnd: 1500 + i * 300,
              duration: 0.06,
              volume: v * 0.05,
              attack: 0.003,
            });
          });
          break;

        case "tick":
          // Minimal tick — for counters, progress
          this.synth(ctx, now, { type: "sine", freq: 1500, freqEnd: 1200, duration: 0.02, volume: v * 0.08, attack: 0.001 });
          break;

        case "drop":
          // Heavy drop — toolbox items settling
          this.synth(ctx, now, { type: "sine", freq: 180, freqEnd: 80, duration: 0.12, volume: v * 0.3, attack: 0.002 });
          this.noise(ctx, now, { duration: 0.06, volume: v * 0.1, filterStart: 2000, filterEnd: 500 });
          break;

        // ─── SPECIAL ───
        case "party":
          [523, 659, 784, 1047].forEach((freq, i) => {
            this.synth(ctx, now + i * 0.08, { type: "sine", freq, duration: 0.15, volume: v * 0.2, attack: 0.005 });
          });
          this.noise(ctx, now + 0.1, { duration: 0.4, volume: v * 0.06, filterStart: 6000, filterEnd: 1000 });
          break;
      }
    } catch {
      // Silently fail — audio is non-critical
    }
  }

  private synth(
    ctx: AudioContext,
    when: number,
    opts: { type: OscillatorType; freq: number; freqEnd?: number; duration: number; volume: number; attack: number }
  ) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = opts.type;
    osc.frequency.setValueAtTime(opts.freq, when);
    if (opts.freqEnd) {
      osc.frequency.exponentialRampToValueAtTime(opts.freqEnd, when + opts.duration);
    }

    gain.gain.setValueAtTime(0, when);
    gain.gain.linearRampToValueAtTime(opts.volume, when + opts.attack);
    gain.gain.exponentialRampToValueAtTime(0.001, when + opts.duration);

    osc.connect(gain).connect(ctx.destination);
    osc.start(when);
    osc.stop(when + opts.duration + 0.01);
  }

  private noise(
    ctx: AudioContext,
    when: number,
    opts: { duration: number; volume: number; filterStart: number; filterEnd: number }
  ) {
    const bufferSize = ctx.sampleRate * opts.duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(opts.filterStart, when);
    filter.frequency.exponentialRampToValueAtTime(opts.filterEnd, when + opts.duration);
    filter.Q.value = 1.5;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(opts.volume, when);
    gain.gain.exponentialRampToValueAtTime(0.001, when + opts.duration);

    source.connect(filter).connect(gain).connect(ctx.destination);
    source.start(when);
    source.stop(when + opts.duration + 0.01);
  }
}

export const soundEngine = new SoundEngine();
