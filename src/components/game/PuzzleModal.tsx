import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { FacilityButton, Modal } from "./ui";
import type { Puzzle } from "@/game/types";
import type { GameApi } from "@/game/useGame";

function NumericKeypad({
  value,
  onChange,
  onSubmit,
  press,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  press: () => void;
}) {
  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "CLR", "0", "OK"];
  return (
    <div className="space-y-4">
      <div
        className="rounded border border-panel-edge bg-black/60 px-4 py-3 text-center font-mono text-2xl tracking-[0.5em] text-success"
        aria-live="polite"
      >
        {value || "—"}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {keys.map((k) => (
          <button
            key={k}
            type="button"
            aria-label={k === "CLR" ? "Clear" : k === "OK" ? "Submit code" : `Digit ${k}`}
            onClick={() => {
              press();
              if (k === "CLR") onChange("");
              else if (k === "OK") onSubmit();
              else if (value.length < 8) onChange(value + k);
            }}
            className={cn(
              "min-h-14 rounded border border-panel-edge bg-panel/70 font-mono text-lg text-foreground transition-all hover:border-primary/70 hover:text-primary active:scale-95",
              k === "OK" && "border-success/50 text-success",
              k === "CLR" && "text-muted-foreground",
            )}
          >
            {k}
          </button>
        ))}
      </div>
    </div>
  );
}

export function PuzzleModal({
  puzzle,
  game,
  onClose,
}: {
  puzzle: Puzzle;
  game: GameApi;
  onClose: () => void;
}) {
  const [value, setValue] = useState("");
  const [switches, setSwitches] = useState<boolean[]>([false, false, false]);
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const solved = game.state.solvedPuzzles.includes(puzzle.id);
  const hintsShown = game.state.hintedPuzzles[puzzle.id] ?? 0;

  useEffect(() => {
    setValue("");
    setError(false);
    setSwitches([false, false, false]);
  }, [puzzle.id]);

  const submit = (answer: string) => {
    if (!answer.trim()) return;
    const ok = game.attemptPuzzle(puzzle.id, answer);
    if (!ok) {
      setError(true);
      setShake(true);
      window.setTimeout(() => setShake(false), 450);
    } else {
      setError(false);
    }
  };

  const switchCode = switches.map((s) => (s ? "1" : "0")).join("");

  return (
    <Modal
      open
      title={puzzle.title}
      onClose={onClose}
      shake={shake}
      footer={
        <>
          <FacilityButton
            variant="ghost"
            onClick={() => game.useHint(puzzle.id)}
            disabled={solved || hintsShown >= puzzle.hints.length}
          >
            Hint (−250)
          </FacilityButton>
          <FacilityButton variant="ghost" onClick={onClose}>
            Close
          </FacilityButton>
        </>
      }
    >
      <p className="mb-5 font-mono text-sm leading-relaxed whitespace-pre-line text-muted-foreground">
        {puzzle.description}
      </p>

      {solved ? (
        <p className="rounded border border-success/40 bg-success/10 px-4 py-3 font-mono text-sm text-success">
          ✓ SOLVED — {puzzle.successText}
        </p>
      ) : (
        <>
          {puzzle.type === "keypad" && (
            <NumericKeypad
              value={value}
              onChange={(v) => {
                setValue(v);
                setError(false);
              }}
              onSubmit={() => submit(value)}
              press={() => game.sfx("keypad")}
            />
          )}

          {puzzle.type === "text" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submit(value);
              }}
              className="flex flex-col gap-3 sm:flex-row"
            >
              <input
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  setError(false);
                }}
                aria-label="Your answer"
                placeholder="TYPE YOUR ANSWER"
                className="min-h-12 flex-1 rounded border border-panel-edge bg-black/60 px-4 font-mono tracking-widest text-foreground uppercase placeholder:text-muted-foreground/60 focus:border-primary/70 focus:outline-none"
              />
              <FacilityButton type="submit" variant="primary">
                Submit
              </FacilityButton>
            </form>
          )}

          {puzzle.type === "choice" && (
            <div className="grid gap-2">
              {puzzle.options?.map((opt) => (
                <button
                  key={opt}
                  onClick={() => submit(opt)}
                  className="min-h-12 rounded border border-panel-edge bg-panel/70 px-4 text-left font-mono text-sm transition-all hover:border-primary/70 hover:text-primary"
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          {puzzle.type === "switch" && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                {(puzzle.switches ?? []).map((label, i) => {
                  const on = switches[i] ?? false;
                  return (
                    <button
                      key={label}
                      role="switch"
                      aria-checked={on}
                      aria-label={`Switch ${label}`}
                      onClick={() => {
                        game.sfx("keypad");
                        setSwitches((s) => s.map((v, idx) => (idx === i ? !v : v)));
                        setError(false);
                      }}
                      className={cn(
                        "flex min-h-28 flex-col items-center justify-center gap-2 rounded border transition-all",
                        on
                          ? "border-success/60 bg-success/15 text-success"
                          : "border-panel-edge bg-panel/70 text-muted-foreground",
                      )}
                    >
                      <span className="font-display text-2xl">{label}</span>
                      <span className="font-mono text-xs tracking-widest">
                        {on ? "ON ▲" : "OFF ▼"}
                      </span>
                    </button>
                  );
                })}
              </div>
              <FacilityButton variant="primary" className="w-full" onClick={() => submit(switchCode)}>
                Engage panel
              </FacilityButton>
            </div>
          )}

          {error && (
            <p
              role="alert"
              className="mt-4 rounded border border-destructive/50 bg-destructive/10 px-4 py-2 font-mono text-sm text-destructive"
            >
              ✕ ACCESS DENIED — attempt logged, −100 points.
            </p>
          )}
        </>
      )}

      {hintsShown > 0 && (
        <ul className="mt-5 space-y-2 border-t border-panel-edge pt-4">
          {puzzle.hints.slice(0, hintsShown).map((h, i) => (
            <li key={h} className="font-mono text-xs text-muted-foreground">
              <span className="text-primary">HINT {i + 1}:</span> {h}
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
}
