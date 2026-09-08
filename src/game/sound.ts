/**
 * Lightweight synthesised sound effects (no audio assets required).
 * Replace `play` internals with real audio files later without touching callers.
 */
export type SoundName =
  | "click"
  | "keypad"
  | "correct"
  | "wrong"
  | "unlock"
  | "pickup"
  | "transition"
  | "alarm"
  | "warning"
  | "escape";

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ctx ??= new Ctor();
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

interface Tone {
  freq: number;
  dur: number;
  type?: OscillatorType;
  delay?: number;
  gain?: number;
}

const RECIPES: Record<SoundName, Tone[]> = {
  click: [{ freq: 320, dur: 0.05, type: "square", gain: 0.05 }],
  keypad: [{ freq: 660, dur: 0.04, type: "square", gain: 0.05 }],
  correct: [
    { freq: 523, dur: 0.1 },
    { freq: 784, dur: 0.16, delay: 0.09 },
  ],
  wrong: [
    { freq: 150, dur: 0.16, type: "sawtooth", gain: 0.07 },
    { freq: 96, dur: 0.22, type: "sawtooth", delay: 0.1, gain: 0.07 },
  ],
  unlock: [
    { freq: 220, dur: 0.1, type: "square" },
    { freq: 440, dur: 0.12, delay: 0.1 },
    { freq: 660, dur: 0.2, delay: 0.22 },
  ],
  pickup: [{ freq: 880, dur: 0.12 }],
  transition: [{ freq: 120, dur: 0.5, type: "sine", gain: 0.06 }],
  alarm: [
    { freq: 440, dur: 0.3, type: "sawtooth", gain: 0.06 },
    { freq: 330, dur: 0.3, type: "sawtooth", delay: 0.3, gain: 0.06 },
  ],
  warning: [{ freq: 200, dur: 0.12, type: "triangle", gain: 0.05 }],
  escape: [
    { freq: 330, dur: 0.2 },
    { freq: 494, dur: 0.2, delay: 0.18 },
    { freq: 659, dur: 0.5, delay: 0.36 },
  ],
};

export function playSound(name: SoundName, enabled: boolean) {
  if (!enabled) return;
  const audio = getCtx();
  if (!audio) return;
  try {
    for (const tone of RECIPES[name]) {
      const start = audio.currentTime + (tone.delay ?? 0);
      const osc = audio.createOscillator();
      const gain = audio.createGain();
      osc.type = tone.type ?? "sine";
      osc.frequency.setValueAtTime(tone.freq, start);
      gain.gain.setValueAtTime(tone.gain ?? 0.08, start);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + tone.dur);
      osc.connect(gain).connect(audio.destination);
      osc.start(start);
      osc.stop(start + tone.dur + 0.02);
    }
  } catch {
    /* audio is optional */
  }
}
