import { useEffect, useState } from "react";

/** Background environment layers: vignette, drifting dust, scanlines, grain. */
export function Atmosphere({ intensity = 1 }: { intensity?: number }) {
  const [motes, setMotes] = useState<{ left: number; delay: number; dur: number; size: number }[]>(
    [],
  );

  // Randomness must not run at module scope or during SSR render.
  useEffect(() => {
    setMotes(
      Array.from({ length: 18 }, () => ({
        left: Math.random() * 100,
        delay: Math.random() * 18,
        dur: 16 + Math.random() * 20,
        size: 1 + Math.random() * 2,
      })),
    );
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="facility-vignette absolute inset-0" style={{ opacity: intensity }} />
      <div className="scanlines film-grain absolute inset-0" />
      {motes.map((m, i) => (
        <span
          key={i}
          className="dust-mote absolute bottom-0 rounded-full bg-foreground/40"
          style={{
            left: `${m.left}%`,
            width: m.size,
            height: m.size,
            animationDelay: `${m.delay}s`,
            animationDuration: `${m.dur}s`,
          }}
        />
      ))}
    </div>
  );
}
