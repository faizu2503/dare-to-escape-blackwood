import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Atmosphere } from "@/components/game/Atmosphere";
import { GameHUD } from "@/components/game/GameHUD";
import { RoomView } from "@/components/game/RoomView";
import {
  Credits,
  FailureScreen,
  HowToPlay,
  IntroStory,
  Leaderboard,
  MainMenu,
  PauseMenu,
  PlayerSetup,
  VictoryScreen,
} from "@/components/game/screens";
import { useGame } from "@/game/useGame";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dare to Escape — Cinematic Browser Escape Room" },
      {
        name: "description",
        content:
          "Trapped in the Blackwood Facility with 30 minutes on the clock. Search five rooms, crack the codes and escape before NEXUS seals the exit.",
      },
      { property: "og:title", content: "Dare to Escape — Cinematic Browser Escape Room" },
      {
        property: "og:description",
        content:
          "30 minutes. 5 rooms. One way out. Play the Blackwood Facility escape room in your browser.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const game = useGame();
  const [paused, setPaused] = useState(false);
  const [pausedHowTo, setPausedHowTo] = useState(false);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background">
      <Atmosphere intensity={game.screen === "game" ? 0.9 : 1} />

      {game.screen === "menu" && <MainMenu game={game} />}
      {game.screen === "setup" && <PlayerSetup game={game} />}
      {game.screen === "intro" && <IntroStory game={game} />}
      {game.screen === "leaderboard" && <Leaderboard game={game} />}
      {game.screen === "howto" && <HowToPlay onBack={() => game.setScreen("menu")} />}
      {game.screen === "credits" && <Credits onBack={() => game.setScreen("menu")} />}
      {game.screen === "victory" && <VictoryScreen game={game} />}
      {game.screen === "failure" && <FailureScreen game={game} />}

      {game.screen === "game" && (
        <div className="relative z-10">
          <GameHUD game={game} onPause={() => setPaused(true)} />
          <RoomView game={game} />
          {paused && !pausedHowTo && (
            <PauseMenu
              game={game}
              onClose={() => setPaused(false)}
              onHowTo={() => setPausedHowTo(true)}
            />
          )}
          {paused && pausedHowTo && (
            <div className="fixed inset-0 z-50 overflow-y-auto bg-background/95">
              <HowToPlay
                onBack={() => {
                  setPausedHowTo(false);
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
