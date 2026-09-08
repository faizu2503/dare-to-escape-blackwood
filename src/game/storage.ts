import type { GameState, ScoreEntry } from "./types";

const SAVE_KEY = "dte:save";
const NAME_KEY = "dte:playerName";
const BOARD_KEY = "dte:leaderboard";
const SETTINGS_KEY = "dte:settings";

function safeGet(key: string): string | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key: string, value: string) {
  try {
    if (typeof window !== "undefined") window.localStorage.setItem(key, value);
  } catch {
    /* storage unavailable — game still playable in-memory */
  }
}

function safeRemove(key: string) {
  try {
    if (typeof window !== "undefined") window.localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

export function loadSave(): GameState | null {
  const raw = safeGet(SAVE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<GameState>;
    if (typeof parsed !== "object" || parsed === null) return null;
    if (typeof parsed.currentRoom !== "number" || !Array.isArray(parsed.solvedPuzzles)) return null;
    return parsed as GameState;
  } catch {
    safeRemove(SAVE_KEY);
    return null;
  }
}

export function writeSave(state: GameState) {
  safeSet(SAVE_KEY, JSON.stringify(state));
  if (state.playerName) safeSet(NAME_KEY, state.playerName);
}

export function clearSave() {
  safeRemove(SAVE_KEY);
}

export function loadPlayerName(): string {
  return safeGet(NAME_KEY) ?? "";
}

export function loadSoundSetting(): boolean {
  const raw = safeGet(SETTINGS_KEY);
  if (!raw) return true;
  try {
    return (JSON.parse(raw) as { soundOn?: boolean }).soundOn !== false;
  } catch {
    return true;
  }
}

export function saveSoundSetting(soundOn: boolean) {
  safeSet(SETTINGS_KEY, JSON.stringify({ soundOn }));
}

export function loadLeaderboard(): ScoreEntry[] {
  const raw = safeGet(BOARD_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as ScoreEntry[]) : [];
  } catch {
    return [];
  }
}

/** Local leaderboard adapter — swap for a network call later. */
export function submitScore(entry: ScoreEntry): ScoreEntry[] {
  const next = [...loadLeaderboard(), entry].sort((a, b) => b.score - a.score).slice(0, 20);
  safeSet(BOARD_KEY, JSON.stringify(next));
  return next;
}
