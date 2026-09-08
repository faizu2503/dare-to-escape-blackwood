import { cn } from "@/lib/utils";
import { formatTime } from "@/game/rooms";
import type { GameApi } from "@/game/useGame";

export function GameHUD({ game, onPause }: { game: GameApi; onPause: () => void }) {
  const { remainingTime, playerName, score } = game.state;
  const warning = remainingTime <= 600;
  const critical = remainingTime <= 300;

  return (
    <header className="sticky top-0 z-30 border-b border-panel-edge bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <div className="min-w-0">
          <p className="font-display text-xs tracking-[0.25em] text-muted-foreground">
            ROOM {String(game.progress.roomIndex).padStart(2, "0")} / 05
          </p>
          <p className="truncate font-display text-sm tracking-[0.14em] text-foreground/90">
            {game.currentRoom.name}
          </p>
        </div>

        <div className="text-center">
          <p
            className={cn(
              "font-mono text-2xl font-semibold tabular-nums sm:text-3xl",
              critical
                ? "timer-critical text-destructive"
                : warning
                  ? "timer-warn text-primary"
                  : "text-foreground",
            )}
            aria-live="off"
          >
            {formatTime(remainingTime)}
          </p>
          <p className="font-display text-[0.6rem] tracking-[0.3em] text-muted-foreground">
            {critical ? "LOCKDOWN IMMINENT" : warning ? "TIME CRITICAL" : "TIME REMAINING"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="truncate font-display text-sm tracking-[0.14em] text-foreground/90">
              {playerName}
            </p>
            <p className="font-mono text-xs text-success">{score.toLocaleString()} pts</p>
          </div>
          <button
            onClick={onPause}
            aria-label="Pause menu"
            className="min-h-10 min-w-10 rounded border border-panel-edge bg-panel/70 px-3 font-mono text-sm transition-colors hover:border-primary/70 hover:text-primary"
          >
            ❙❙
          </button>
        </div>
      </div>
    </header>
  );
}
