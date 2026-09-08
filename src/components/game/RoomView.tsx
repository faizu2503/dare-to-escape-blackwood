import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { FacilityButton, Modal, Panel } from "./ui";
import { PuzzleModal } from "./PuzzleModal";
import type { InventoryItem, RoomObject } from "@/game/types";
import type { GameApi } from "@/game/useGame";
import room1 from "@/assets/room1.jpg";
import room2 from "@/assets/room2.jpg";
import room3 from "@/assets/room3.jpg";
import room4 from "@/assets/room4.jpg";
import room5 from "@/assets/room5.jpg";

/** Backgrounds are keyed by room id so they can be swapped without touching logic. */
const BACKDROPS: Record<number, string> = { 1: room1, 2: room2, 3: room3, 4: room4, 5: room5 };

export function RoomView({ game }: { game: GameApi }) {
  const room = game.currentRoom;
  const [active, setActive] = useState<RoomObject | null>(null);
  const [puzzleId, setPuzzleId] = useState<string | null>(null);
  const [item, setItem] = useState<InventoryItem | null>(null);
  const [transition, setTransition] = useState(true);

  useEffect(() => {
    setActive(null);
    setPuzzleId(null);
    setTransition(true);
    const t = window.setTimeout(() => setTransition(false), 1600);
    return () => window.clearTimeout(t);
  }, [room.id]);

  const openObject = (obj: RoomObject) => {
    game.examine(obj.clue);
    setActive(obj);
  };

  const puzzle = puzzleId ? room.puzzles.find((p) => p.id === puzzleId) : null;
  const solvedCount = room.requiredPuzzles.filter((id) =>
    game.state.solvedPuzzles.includes(id),
  ).length;

  return (
    <div className="relative">
      {/* Room transition curtain */}
      {transition && (
        <div className="animate-fade-in fixed inset-0 z-40 flex flex-col items-center justify-center gap-2 bg-background">
          <p className="font-display text-sm tracking-[0.5em] text-muted-foreground">
            ROOM {String(room.id).padStart(2, "0")}
          </p>
          <h2 className="text-emergency font-display text-3xl tracking-[0.2em] sm:text-5xl">
            {room.name}
          </h2>
        </div>
      )}

      <div className="relative">
        <img
          src={BACKDROPS[room.id]}
          alt={`${room.name} — ${room.subtitle}`}
          width={1536}
          height={864}
          className="h-56 w-full object-cover opacity-70 sm:h-80 lg:h-96"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/30 to-background" />
        <div className="absolute bottom-0 w-full px-4 pb-4">
          <div className="mx-auto max-w-6xl">
            <p className="font-mono text-xs tracking-[0.25em] text-primary">{room.subtitle}</p>
            <p className="mt-1 max-w-2xl text-sm text-foreground/80">{room.intro}</p>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[1fr_20rem]">
        <div className="space-y-5">
          {room.nexus && (
            <Panel className="border-primary/40 p-4">
              <p className="font-display text-xs tracking-[0.3em] text-primary">NEXUS</p>
              <p className="mt-2 font-mono text-sm text-foreground/85">{room.nexus}</p>
            </Panel>
          )}

          <div>
            <div className="mb-3 flex items-baseline justify-between">
              <h3 className="font-display text-sm tracking-[0.25em] text-muted-foreground">
                INVESTIGATE
              </h3>
              <p className="font-mono text-xs text-muted-foreground">
                {solvedCount}/{room.requiredPuzzles.length} mechanisms solved
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {room.objects.map((obj) => {
                const objSolved = obj.puzzleId
                  ? game.state.solvedPuzzles.includes(obj.puzzleId)
                  : false;
                return (
                  <button
                    key={obj.id}
                    onClick={() => openObject(obj)}
                    aria-label={`Examine ${obj.name}`}
                    className={cn(
                      "panel-surface group flex min-h-24 cursor-pointer flex-col items-start gap-2 rounded p-3 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-[0_0_28px_-8px_var(--color-primary)] focus-visible:border-primary",
                      objSolved && "border-success/50",
                      obj.isDoor && "col-span-2 sm:col-span-1",
                    )}
                  >
                    <span
                      className={cn(
                        "text-2xl transition-colors",
                        objSolved ? "text-success" : "text-muted-foreground group-hover:text-primary",
                      )}
                      aria-hidden
                    >
                      {obj.glyph}
                    </span>
                    <span className="font-display text-xs tracking-[0.16em] uppercase">
                      {obj.name}
                    </span>
                    {objSolved && (
                      <span className="font-mono text-[0.65rem] text-success">✓ RESOLVED</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {game.roomComplete && (
            <Panel className="animate-fade-in border-success/50 p-5 text-center">
              <p className="font-display text-lg tracking-[0.2em] text-success">
                {room.nextRoom ? "DOOR UNLOCKED" : "EXIT UNLOCKED"}
              </p>
              <p className="mt-1 mb-4 font-mono text-xs text-muted-foreground">
                +500 room bonus secured.
              </p>
              <FacilityButton variant="success" onClick={game.advanceRoom}>
                {room.nextRoom ? "Proceed to next room" : "Step through the door"}
              </FacilityButton>
            </Panel>
          )}
        </div>

        <aside className="space-y-4">
          <Panel className="p-4">
            <h3 className="mb-3 font-display text-xs tracking-[0.28em] text-muted-foreground">
              INVENTORY
            </h3>
            {game.state.inventory.length === 0 ? (
              <p className="font-mono text-xs text-muted-foreground/70">Nothing collected yet.</p>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {game.state.inventory.map((inv) => (
                  <button
                    key={inv.id}
                    onClick={() => setItem(inv)}
                    aria-label={`Inspect ${inv.name}`}
                    className="flex min-h-16 flex-col items-center justify-center gap-1 rounded border border-panel-edge bg-black/40 p-2 transition-colors hover:border-primary/60"
                  >
                    <span className="text-lg text-primary" aria-hidden>
                      {inv.glyph}
                    </span>
                    <span className="text-center font-mono text-[0.6rem] leading-tight text-muted-foreground">
                      {inv.name}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </Panel>

          <Panel className="p-4">
            <h3 className="mb-3 font-display text-xs tracking-[0.28em] text-muted-foreground">
              CLUE LOG
            </h3>
            {game.state.discoveredClues.length === 0 ? (
              <p className="font-mono text-xs text-muted-foreground/70">
                Examine objects to record clues.
              </p>
            ) : (
              <ul className="space-y-2">
                {game.state.discoveredClues.map((clue) => (
                  <li key={clue} className="font-mono text-xs leading-relaxed text-foreground/80">
                    <span className="text-primary">›</span> {clue}
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </aside>
      </div>

      {/* Inspection modal */}
      {active && !puzzle && (
        <Modal
          open
          title={active.name}
          onClose={() => setActive(null)}
          footer={
            <>
              {active.puzzleId && (
                <FacilityButton
                  variant="primary"
                  onClick={() => setPuzzleId(active.puzzleId ?? null)}
                >
                  Examine
                </FacilityButton>
              )}
              <FacilityButton onClick={() => setActive(null)}>Close</FacilityButton>
            </>
          }
        >
          <p className="text-sm leading-relaxed text-foreground/85">{active.description}</p>
          {active.isDoor && !active.puzzleId && (
            <p className="mt-4 font-mono text-xs text-muted-foreground">
              {game.roomComplete
                ? "The lock is disengaged. You can leave."
                : "It will not move until every mechanism in this room is satisfied."}
            </p>
          )}
        </Modal>
      )}

      {puzzle && (
        <PuzzleModal
          puzzle={puzzle}
          game={game}
          onClose={() => {
            setPuzzleId(null);
            setActive(null);
          }}
        />
      )}

      {item && (
        <Modal
          open
          title={item.name}
          onClose={() => setItem(null)}
          footer={<FacilityButton onClick={() => setItem(null)}>Close</FacilityButton>}
        >
          <div className="flex items-start gap-4">
            <span className="text-4xl text-primary" aria-hidden>
              {item.glyph}
            </span>
            <p className="text-sm text-foreground/85">{item.description}</p>
          </div>
        </Modal>
      )}
    </div>
  );
}
