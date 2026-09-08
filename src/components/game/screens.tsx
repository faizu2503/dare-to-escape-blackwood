import { useEffect, useState } from "react";
import { formatTime, rankFor } from "@/game/rooms";
import { loadLeaderboard } from "@/game/storage";
import type { ScoreEntry } from "@/game/types";
import type { GameApi } from "@/game/useGame";
import { FacilityButton, Modal, Panel } from "./ui";
import landing from "@/assets/landing.jpg";

function Shell({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}) {
  return (
    <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center px-4 py-14">
      {title && (
        <header className="mb-8">
          <h1 className="text-emergency font-display text-3xl tracking-[0.2em] sm:text-4xl">
            {title}
          </h1>
          {subtitle && <p className="mt-2 font-mono text-xs text-muted-foreground">{subtitle}</p>}
        </header>
      )}
      {children}
    </main>
  );
}

export function MainMenu({ game }: { game: GameApi }) {
  return (
    <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-16 text-center">
      <img
        src={landing}
        alt="A dark corridor of the abandoned Blackwood Facility lit by red emergency lamps"
        width={1920}
        height={1080}
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover opacity-45"
      />
      <p className="flicker font-mono text-xs tracking-[0.5em] text-primary">BLACKWOOD FACILITY</p>
      <h1 className="glitch-title mt-4 font-display text-5xl leading-none tracking-[0.14em] sm:text-7xl md:text-8xl">
        DARE TO ESCAPE
      </h1>
      <p className="mt-4 font-display text-sm tracking-[0.35em] text-foreground/70 sm:text-base">
        30 MINUTES. 5 ROOMS. ONE WAY OUT.
      </p>
      <p className="mt-2 max-w-md font-mono text-xs text-muted-foreground italic">
        "You entered willingly. Escaping is optional."
      </p>

      <div className="mt-10 flex w-full max-w-xs flex-col gap-3">
        <FacilityButton variant="primary" onClick={() => game.setScreen("setup")}>
          Start Game
        </FacilityButton>
        {game.hasSave && (
          <FacilityButton variant="success" onClick={game.continueGame}>
            Continue Game
          </FacilityButton>
        )}
        <FacilityButton onClick={() => game.setScreen("leaderboard")}>Leaderboard</FacilityButton>
        <FacilityButton onClick={() => game.setScreen("howto")}>How to Play</FacilityButton>
        <FacilityButton onClick={game.toggleSound}>
          {game.state.soundOn ? "🔊 Sound On" : "🔇 Sound Off"}
        </FacilityButton>
        <FacilityButton onClick={() => game.setScreen("credits")}>Credits</FacilityButton>
      </div>
    </main>
  );
}

export function PlayerSetup({ game }: { game: GameApi }) {
  const [name, setName] = useState(game.state.playerName);
  return (
    <Shell title="IDENTIFY YOURSELF" subtitle="THE FACILITY REQUIRES A NAME FOR ITS RECORDS.">
      <Panel className="p-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            game.sfx("click");
            game.startNewGame(name);
          }}
          className="space-y-5"
        >
          <label className="block">
            <span className="font-display text-xs tracking-[0.25em] text-muted-foreground">
              PLAYER NAME
            </span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={20}
              autoFocus
              placeholder="SUBJECT"
              className="mt-2 min-h-12 w-full rounded border border-panel-edge bg-black/60 px-4 font-mono tracking-widest text-foreground uppercase focus:border-primary/70 focus:outline-none"
            />
          </label>
          <div className="flex flex-wrap gap-3">
            <FacilityButton type="submit" variant="primary">
              Begin Escape
            </FacilityButton>
            <FacilityButton type="button" onClick={() => game.setScreen("menu")}>
              Back
            </FacilityButton>
          </div>
        </form>
      </Panel>
    </Shell>
  );
}

const INTRO_LINES = [
  "You wake up in darkness.",
  "Cold metal beneath you.",
  "A red emergency light flickers above.",
  "You don't remember entering this place.",
  "A screen suddenly turns on.",
  "NEXUS: WELCOME, SUBJECT.",
  "NEXUS: THE FACILITY HAS BEEN LOCKED DOWN.",
  "NEXUS: EMERGENCY EXIT AVAILABLE IN 30:00.",
  "NEXUS: FAILURE WILL INITIATE PERMANENT LOCKDOWN.",
  "YOU HAVE 30 MINUTES.",
  "DARE TO ESCAPE.",
];

export function IntroStory({ game }: { game: GameApi }) {
  const [shown, setShown] = useState(1);
  useEffect(() => {
    if (shown >= INTRO_LINES.length) return;
    const t = window.setTimeout(() => setShown((n) => n + 1), 900);
    return () => window.clearTimeout(t);
  }, [shown]);

  const done = shown >= INTRO_LINES.length;

  return (
    <Shell>
      <div className="space-y-3">
        {INTRO_LINES.slice(0, shown).map((line) => (
          <p
            key={line}
            className={
              line.startsWith("NEXUS")
                ? "animate-fade-in font-mono text-sm tracking-[0.14em] text-primary"
                : "animate-fade-in font-mono text-sm text-foreground/80"
            }
          >
            {line}
          </p>
        ))}
      </div>
      <div className="mt-10 flex flex-wrap gap-3">
        <FacilityButton variant="primary" onClick={game.enterFacility}>
          Enter the Facility
        </FacilityButton>
        {!done && (
          <FacilityButton onClick={() => setShown(INTRO_LINES.length)}>Skip</FacilityButton>
        )}
      </div>
    </Shell>
  );
}

export function HowToPlay({ onBack }: { onBack: () => void }) {
  const lines = [
    "Explore the room.",
    "Click objects to investigate them.",
    "Collect useful items.",
    "Solve puzzles.",
    "Use clues to discover codes.",
    "Use hints when you're stuck.",
    "Escape before the timer reaches zero.",
  ];
  return (
    <Shell title="HOW TO PLAY" subtitle="OPERATING PROCEDURE — SUBJECT BRIEFING">
      <Panel className="space-y-3 p-6">
        {lines.map((l) => (
          <p key={l} className="font-mono text-sm text-foreground/85">
            <span className="text-primary">›</span> {l}
          </p>
        ))}
        <div className="mt-4 border-t border-panel-edge pt-4 font-mono text-xs text-destructive">
          <p>Every wrong answer costs 100 points.</p>
          <p>Every hint costs 250 points.</p>
        </div>
      </Panel>
      <div className="mt-8">
        <FacilityButton onClick={onBack}>Back</FacilityButton>
      </div>
    </Shell>
  );
}

export function Credits({ onBack }: { onBack: () => void }) {
  return (
    <Shell title="CREDITS">
      <Panel className="space-y-2 p-6 font-mono text-sm text-muted-foreground">
        <p className="text-foreground">DARE TO ESCAPE</p>
        <p>An interactive escape experience.</p>
        <p>Created as a cinematic puzzle game.</p>
        <p>Version 1.0</p>
      </Panel>
      <div className="mt-8">
        <FacilityButton onClick={onBack}>Back</FacilityButton>
      </div>
    </Shell>
  );
}

export function Leaderboard({ game }: { game: GameApi }) {
  const [entries, setEntries] = useState<ScoreEntry[]>([]);
  useEffect(() => setEntries(loadLeaderboard()), []);

  return (
    <Shell title="ESCAPE RECORDS" subtitle="LOCAL FACILITY LOG">
      <Panel className="overflow-x-auto p-0">
        {entries.length === 0 ? (
          <p className="p-6 font-mono text-sm text-muted-foreground">
            No one has escaped this facility yet.
          </p>
        ) : (
          <table className="w-full min-w-[34rem] text-left font-mono text-xs">
            <thead className="border-b border-panel-edge text-muted-foreground">
              <tr>
                {["#", "PLAYER", "SCORE", "TIME", "HINTS", "DATE"].map((h) => (
                  <th key={h} className="px-3 py-3 font-display tracking-[0.18em]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {entries.map((e, i) => (
                <tr key={`${e.name}-${e.date}`} className="border-b border-panel-edge/60">
                  <td className="px-3 py-3 text-primary">{i + 1}</td>
                  <td className="px-3 py-3 text-foreground">{e.name}</td>
                  <td className="px-3 py-3 text-success">{e.score.toLocaleString()}</td>
                  <td className="px-3 py-3">{formatTime(e.timeUsed)}</td>
                  <td className="px-3 py-3">{e.hints}</td>
                  <td className="px-3 py-3 text-muted-foreground">
                    {new Date(e.date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Panel>
      <div className="mt-8 flex flex-wrap gap-3">
        <FacilityButton variant="primary" onClick={() => game.setScreen("setup")}>
          Play Again
        </FacilityButton>
        <FacilityButton onClick={() => game.setScreen("menu")}>Main Menu</FacilityButton>
      </div>
    </Shell>
  );
}

export function VictoryScreen({ game }: { game: GameApi }) {
  const { score, hintsUsed, attempts, remainingTime, playerName } = game.state;
  const stats = [
    ["Completion time", formatTime(30 * 60 - remainingTime)],
    ["Time remaining", formatTime(remainingTime)],
    ["Hints used", String(hintsUsed)],
    ["Incorrect attempts", String(attempts)],
    ["Rooms completed", "5 / 5"],
  ] as const;

  return (
    <Shell>
      <p className="font-display text-sm tracking-[0.5em] text-success">EXIT UNLOCKED</p>
      <h1 className="mt-2 font-display text-4xl tracking-[0.16em] text-success sm:text-6xl">
        YOU ESCAPED.
      </h1>
      <Panel className="mt-6 space-y-2 p-5 font-mono text-sm text-foreground/80">
        <p>The blast door opens.</p>
        <p>Cold outside air fills the chamber.</p>
        <p>Behind you, the facility goes dark.</p>
        <p className="pt-2 text-primary">NEXUS: "THIS WAS ONLY THE FIRST TEST."</p>
      </Panel>

      <Panel className="mt-6 p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-panel-edge pb-4">
          <div>
            <p className="font-display text-xs tracking-[0.25em] text-muted-foreground">
              {playerName}
            </p>
            <p className="font-display text-3xl text-success">{score.toLocaleString()}</p>
          </div>
          <p className="text-emergency font-display text-lg tracking-[0.18em]">{rankFor(score)}</p>
        </div>
        <dl className="mt-4 grid gap-2 sm:grid-cols-2">
          {stats.map(([k, v]) => (
            <div key={k} className="flex justify-between font-mono text-xs">
              <dt className="text-muted-foreground">{k}</dt>
              <dd className="text-foreground">{v}</dd>
            </div>
          ))}
        </dl>
      </Panel>

      <div className="mt-8 flex flex-wrap gap-3">
        <FacilityButton variant="primary" onClick={() => game.setScreen("leaderboard")}>
          Leaderboard
        </FacilityButton>
        <FacilityButton onClick={() => game.setScreen("setup")}>Play Again</FacilityButton>
        <FacilityButton onClick={game.resetGame}>Main Menu</FacilityButton>
      </div>
    </Shell>
  );
}

export function FailureScreen({ game }: { game: GameApi }) {
  return (
    <main className="relative z-10 flex min-h-screen flex-col items-center justify-center bg-destructive/10 px-4 text-center">
      <p className="font-mono text-xs tracking-[0.4em] text-destructive">TIME EXPIRED</p>
      <h1 className="timer-critical mt-3 font-display text-4xl tracking-[0.14em] text-destructive sm:text-6xl">
        LOCKDOWN INITIATED
      </h1>
      <p className="mt-4 font-mono text-sm text-foreground/70">You ran out of time.</p>
      <p className="mt-1 font-mono text-xs text-muted-foreground">
        Rooms completed: {game.progress.roomIndex - 1} / 5 · Score at lockdown:{" "}
        {game.state.score.toLocaleString()}
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <FacilityButton variant="primary" onClick={() => game.startNewGame(game.state.playerName)}>
          Try Again
        </FacilityButton>
        <FacilityButton onClick={game.resetGame}>Return to Menu</FacilityButton>
      </div>
    </main>
  );
}

export function PauseMenu({
  game,
  onClose,
  onHowTo,
}: {
  game: GameApi;
  onClose: () => void;
  onHowTo: () => void;
}) {
  const [confirm, setConfirm] = useState<"reset" | "menu" | null>(null);

  if (confirm) {
    return (
      <Modal
        open
        title="Confirm"
        onClose={() => setConfirm(null)}
        footer={
          <>
            <FacilityButton variant="danger" onClick={game.resetGame}>
              Yes
            </FacilityButton>
            <FacilityButton onClick={() => setConfirm(null)}>Cancel</FacilityButton>
          </>
        }
      >
        <p className="font-mono text-sm text-foreground/85">
          {confirm === "reset"
            ? "Are you sure you want to restart? All progress will be erased."
            : "Return to the menu? Your current run will be lost."}
        </p>
      </Modal>
    );
  }

  return (
    <Modal open title="Paused" onClose={onClose}>
      <div className="grid gap-3">
        <FacilityButton variant="primary" onClick={onClose}>
          Resume
        </FacilityButton>
        <FacilityButton onClick={game.toggleSound}>
          {game.state.soundOn ? "🔊 Sound On" : "🔇 Sound Off"}
        </FacilityButton>
        <FacilityButton onClick={onHowTo}>How to Play</FacilityButton>
        <FacilityButton variant="danger" onClick={() => setConfirm("reset")}>
          Reset Game
        </FacilityButton>
        <FacilityButton onClick={() => setConfirm("menu")}>Return to Menu</FacilityButton>
      </div>
    </Modal>
  );
}
