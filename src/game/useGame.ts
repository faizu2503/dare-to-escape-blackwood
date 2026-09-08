import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ESCAPE_BONUS,
  HINT_COST,
  ROOM_BONUS,
  START_SCORE,
  TOTAL_TIME,
  WRONG_PENALTY,
  getPuzzle,
  getRoom,
  rankFor,
  rooms,
} from "./rooms";
import { playSound, type SoundName } from "./sound";
import {
  clearSave,
  loadPlayerName,
  loadSave,
  loadSoundSetting,
  saveSoundSetting,
  submitScore,
  writeSave,
} from "./storage";
import type { GameState } from "./types";

export type Screen =
  | "menu"
  | "setup"
  | "intro"
  | "game"
  | "victory"
  | "failure"
  | "leaderboard"
  | "howto"
  | "credits";

function freshState(name: string, soundOn: boolean): GameState {
  return {
    playerName: name,
    currentRoom: 1,
    endsAt: null,
    remainingTime: TOTAL_TIME,
    score: START_SCORE,
    hintsUsed: 0,
    attempts: 0,
    discoveredClues: [],
    inventory: [],
    solvedPuzzles: [],
    hintedPuzzles: {},
    unlockedRooms: 1,
    gameStarted: false,
    gameCompleted: false,
    gameOver: false,
    soundOn,
    startedAt: null,
  };
}

export function useGame() {
  const [state, setState] = useState<GameState>(() => freshState("", true));
  const [screen, setScreen] = useState<Screen>("menu");
  const [hasSave, setHasSave] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const stateRef = useRef(state);
  stateRef.current = state;

  // Hydrate from localStorage after mount (never during SSR/render).
  useEffect(() => {
    const soundOn = loadSoundSetting();
    const saved = loadSave();
    setState((s) => ({ ...s, playerName: loadPlayerName(), soundOn }));
    setHasSave(Boolean(saved && saved.gameStarted && !saved.gameOver && !saved.gameCompleted));
    setHydrated(true);
  }, []);

  const sfx = useCallback((name: SoundName) => {
    playSound(name, stateRef.current.soundOn);
  }, []);

  const persist = useCallback((next: GameState) => {
    if (next.gameStarted && !next.gameOver && !next.gameCompleted) writeSave(next);
    return next;
  }, []);

  const update = useCallback(
    (fn: (s: GameState) => GameState) => {
      setState((s) => persist(fn(s)));
    },
    [persist],
  );

  // Countdown driven by an absolute end timestamp so refresh keeps the clock honest.
  useEffect(() => {
    if (screen !== "game" || !state.endsAt) return;
    const tick = () => {
      const remaining = Math.max(0, Math.round((stateRef.current.endsAt! - Date.now()) / 1000));
      setState((s) => (s.remainingTime === remaining ? s : persist({ ...s, remainingTime: remaining })));
      if (remaining <= 0) {
        clearSave();
        setHasSave(false);
        setState((s) => ({ ...s, gameOver: true, remainingTime: 0 }));
        setScreen("failure");
      }
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [screen, state.endsAt, persist]);

  const startNewGame = useCallback(
    (name: string) => {
      clearSave();
      setHasSave(false);
      const next = freshState(name.trim() || "SUBJECT", stateRef.current.soundOn);
      setState(next);
      setScreen("intro");
    },
    [],
  );

  const enterFacility = useCallback(() => {
    sfx("transition");
    update((s) => ({
      ...s,
      gameStarted: true,
      startedAt: Date.now(),
      endsAt: Date.now() + TOTAL_TIME * 1000,
      remainingTime: TOTAL_TIME,
    }));
    setScreen("game");
  }, [sfx, update]);

  const continueGame = useCallback(() => {
    const saved = loadSave();
    if (!saved) return;
    const remaining = saved.endsAt
      ? Math.max(0, Math.round((saved.endsAt - Date.now()) / 1000))
      : saved.remainingTime;
    if (remaining <= 0) {
      clearSave();
      setHasSave(false);
      return;
    }
    setState({ ...saved, remainingTime: remaining, soundOn: loadSoundSetting() });
    setScreen("game");
  }, []);

  const examine = useCallback(
    (clue?: string) => {
      sfx("click");
      if (!clue) return;
      update((s) =>
        s.discoveredClues.includes(clue)
          ? s
          : { ...s, discoveredClues: [...s.discoveredClues, clue] },
      );
    },
    [sfx, update],
  );

  /** Validates in logic, never against DOM-rendered values. */
  const attemptPuzzle = useCallback(
    (puzzleId: string, answer: string): boolean => {
      const puzzle = getPuzzle(puzzleId);
      if (!puzzle) return false;
      const given = answer.trim().toLowerCase();
      if (!given) return false;
      if (stateRef.current.solvedPuzzles.includes(puzzleId)) return true;
      const correct = given === puzzle.solution.trim().toLowerCase();

      if (!correct) {
        sfx("wrong");
        update((s) => ({
          ...s,
          attempts: s.attempts + 1,
          score: Math.max(0, s.score - WRONG_PENALTY),
        }));
        return false;
      }

      sfx(puzzle.item ? "pickup" : "correct");
      update((s) => {
        const solved = [...s.solvedPuzzles, puzzleId];
        const clues = puzzle.reward && !s.discoveredClues.includes(puzzle.reward)
          ? [...s.discoveredClues, puzzle.reward]
          : s.discoveredClues;
        const inventory =
          puzzle.item && !s.inventory.some((i) => i.id === puzzle.item!.id)
            ? [...s.inventory, puzzle.item]
            : s.inventory;
        return { ...s, solvedPuzzles: solved, discoveredClues: clues, inventory };
      });
      return true;
    },
    [sfx, update],
  );

  const useHint = useCallback(
    (puzzleId: string) => {
      const puzzle = getPuzzle(puzzleId);
      if (!puzzle) return;
      const used = stateRef.current.hintedPuzzles[puzzleId] ?? 0;
      if (used >= puzzle.hints.length) return;
      sfx("click");
      update((s) => ({
        ...s,
        hintsUsed: s.hintsUsed + 1,
        score: Math.max(0, s.score - HINT_COST),
        hintedPuzzles: { ...s.hintedPuzzles, [puzzleId]: used + 1 },
      }));
    },
    [sfx, update],
  );

  const currentRoom = getRoom(state.currentRoom);
  const roomComplete = currentRoom.requiredPuzzles.every((id) => state.solvedPuzzles.includes(id));

  const finishGame = useCallback(() => {
    const s = stateRef.current;
    const timeBonus = s.remainingTime * 2;
    const finalScore = Math.max(0, s.score + ROOM_BONUS * 5 + ESCAPE_BONUS + timeBonus);
    clearSave();
    setHasSave(false);
    sfx("escape");
    setState((prev) => ({
      ...prev,
      score: finalScore,
      gameCompleted: true,
      gameStarted: false,
    }));
    submitScore({
      name: s.playerName,
      score: finalScore,
      timeUsed: Math.max(0, TOTAL_TIME - s.remainingTime),
      hints: s.hintsUsed,
      date: new Date().toISOString(),
      rank: rankFor(finalScore),
    });
    setScreen("victory");
  }, [sfx]);

  const advanceRoom = useCallback(() => {
    const room = getRoom(stateRef.current.currentRoom);
    if (!room.requiredPuzzles.every((id) => stateRef.current.solvedPuzzles.includes(id))) return;
    if (room.nextRoom === null) {
      finishGame();
      return;
    }
    sfx("unlock");
    // Room progression is gated in state — rooms cannot be skipped from the UI or a URL.
    update((s) => ({
      ...s,
      currentRoom: room.nextRoom!,
      unlockedRooms: Math.max(s.unlockedRooms, room.nextRoom!),
      score: Math.max(0, s.score + ROOM_BONUS),
    }));
  }, [finishGame, sfx, update]);

  const resetGame = useCallback(() => {
    clearSave();
    setHasSave(false);
    setState((s) => freshState(s.playerName, s.soundOn));
    setScreen("menu");
  }, []);

  const toggleSound = useCallback(() => {
    setState((s) => {
      const soundOn = !s.soundOn;
      saveSoundSetting(soundOn);
      return { ...s, soundOn };
    });
  }, []);

  const progress = useMemo(
    () => ({
      roomIndex: rooms.findIndex((r) => r.id === state.currentRoom) + 1,
      totalRooms: rooms.length,
    }),
    [state.currentRoom],
  );

  return {
    state,
    screen,
    setScreen,
    hasSave,
    hydrated,
    currentRoom,
    roomComplete,
    progress,
    sfx,
    startNewGame,
    enterFacility,
    continueGame,
    examine,
    attemptPuzzle,
    useHint,
    advanceRoom,
    resetGame,
    toggleSound,
  };
}

export type GameApi = ReturnType<typeof useGame>;
