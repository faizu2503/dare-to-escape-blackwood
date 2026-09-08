import type { Room } from "./types";

export const TOTAL_TIME = 30 * 60; // seconds
export const START_SCORE = 10000;
export const WRONG_PENALTY = 100;
export const HINT_COST = 250;
export const ROOM_BONUS = 500;
export const ESCAPE_BONUS = 2500;

export const rooms: Room[] = [
  {
    id: 1,
    name: "THE AWAKENING",
    subtitle: "Examination Laboratory — Sublevel 1",
    intro:
      "Cold tile. A red emergency lamp stutters overhead. Somewhere a fan grinds against its own bearings.",
    objects: [
      {
        id: "desk",
        name: "Steel Desk",
        glyph: "▤",
        description:
          "A dented examination desk. A handwritten note is taped beneath the edge: \"Time stopped when everything began.\"",
        clue: "Note: \"Time stopped when everything began.\"",
      },
      {
        id: "clock",
        name: "Wall Clock",
        glyph: "◷",
        description:
          "The hands are frozen. Dust has settled on the glass in a perfect grey film. It reads 11:47.",
        clue: "The wall clock is stopped at 11:47.",
      },
      {
        id: "cabinet",
        name: "Filing Cabinet",
        glyph: "▥",
        description:
          "Three drawers, all emptied. In the back of the bottom drawer, an old photograph is wedged against the frame.",
      },
      {
        id: "photo",
        name: "Old Photograph",
        glyph: "▢",
        description:
          "Four researchers stand in front of the reactor door. On the back, in pencil: \"COUNT WHAT SHOULD NOT BE THERE.\"",
        puzzleId: "r1-photo",
      },
      {
        id: "lamp",
        name: "Emergency Light",
        glyph: "◉",
        description:
          "The lamp flickers in an uneven rhythm. It lights nothing useful, but it keeps the dark honest.",
      },
      {
        id: "terminal",
        name: "Computer Terminal",
        glyph: "▣",
        description: "A cracked CRT glows green. ENTER AUTHORIZATION.",
        puzzleId: "r1-terminal",
      },
      {
        id: "door",
        name: "Sealed Door",
        glyph: "⌷",
        description: "A magnetic bolt holds the door. The terminal controls it.",
        isDoor: true,
      },
    ],
    puzzles: [
      {
        id: "r1-photo",
        roomId: 1,
        type: "choice",
        title: "THE PHOTOGRAPH",
        description:
          "Four researchers face the camera. The floodlight throws their shadows across the wall behind them. How many shadows are cast?",
        options: ["3", "4", "5", "6"],
        solution: "5",
        hints: [
          "Someone stood behind the camera.",
          "Count the shadows, not the people.",
          "There is one more shadow than there are researchers.",
        ],
        points: 0,
        reward: "The photograph shows 5 shadows.",
        item: {
          id: "photograph",
          name: "Old Photograph",
          description:
            "Four researchers. Five shadows. Someone was standing where no one should have been.",
          glyph: "▢",
        },
        successText: "A fifth shadow. Someone was never in the records.",
      },
      {
        id: "r1-terminal",
        roomId: 1,
        type: "keypad",
        title: "AUTHORIZATION TERMINAL",
        description: "ENTER AUTHORIZATION — 5 DIGITS",
        solution: "11475",
        hints: [
          "The facility remembers the moment it died.",
          "The clock gives you four digits. The photograph gives you one.",
          "Clock time first, then the number of shadows.",
        ],
        points: 0,
        reward: "Code fragment recovered: 5",
        successText: "AUTHORIZATION ACCEPTED. MAGNETIC BOLT RELEASED.",
      },
    ],
    requiredPuzzles: ["r1-photo", "r1-terminal"],
    nextRoom: 2,
  },
  {
    id: 2,
    name: "THE ARCHIVE",
    subtitle: "Records Storage — Sublevel 2",
    intro:
      "Shelves lean into each other like tired men. Paper rot and ozone. Every file here outlived its author.",
    objects: [
      {
        id: "map",
        name: "Wall Map",
        glyph: "▦",
        description:
          "A facility schematic. Sublevels 1 through 5. Sublevel 5 has been scratched out with something sharp.",
        clue: "The map shows five sublevels. The fifth is scratched out.",
      },
      {
        id: "books",
        name: "Bookshelves",
        glyph: "▤",
        description:
          "Hundreds of spines. Four of them carry a small red mark near the base, each with a number stamped beside it.",
        puzzleId: "r2-books",
      },
      {
        id: "drawer",
        name: "Locked Drawer",
        glyph: "▥",
        description:
          "A mechanical combination drawer beneath the shelving. Something metal shifts inside when you tilt it.",
        puzzleId: "r2-books",
      },
      {
        id: "documents",
        name: "Strange Documents",
        glyph: "▧",
        description:
          "PROJECT NEXUS — SUBJECTS: 17 — FAILURES: 13 — SURVIVORS: 4. Beneath the ink, pressed into the paper: \"THE DIFFERENCE IS THE KEY.\"",
        puzzleId: "r2-document",
      },
      {
        id: "computer",
        name: "Archive Computer",
        glyph: "▣",
        description:
          "Dead. The power lead has been cut cleanly, deliberately, by someone who did not want these records read.",
      },
      {
        id: "security-door",
        name: "Security Door",
        glyph: "⌷",
        description:
          "A brass mechanical lock above an electronic latch. Both must give way.",
        isDoor: true,
      },
    ],
    puzzles: [
      {
        id: "r2-books",
        roomId: 2,
        type: "keypad",
        title: "MARKED VOLUMES",
        description: "MECHANICAL DRAWER — 4 DIGITS",
        solution: "3719",
        hints: [
          "Look for the books that don't belong.",
          "Four books carry red markings.",
          "Read their numbers from left to right: 3, 7, 1, 9.",
        ],
        points: 0,
        reward: "Four marked books read 3 — 7 — 1 — 9.",
        item: {
          id: "brass-key",
          name: "Brass Key",
          description: "An old brass key. It appears to fit a mechanical lock.",
          glyph: "⚿",
        },
        successText: "The drawer slides open. A brass key lies on felt lining.",
      },
      {
        id: "r2-document",
        roomId: 2,
        type: "keypad",
        title: "ARCHIVE LATCH",
        description: "SECONDARY MECHANISM — 1 DIGIT",
        solution: "4",
        hints: [
          "The document counts three things.",
          "Subjects, failures, survivors. One of those is not independent.",
          "17 minus 13.",
        ],
        points: 0,
        reward: "Code fragment recovered: 8",
        successText: "The electronic latch disengages. The brass key does the rest.",
      },
    ],
    requiredPuzzles: ["r2-books", "r2-document"],
    nextRoom: 3,
  },
  {
    id: 3,
    name: "THE OBSERVATION CHAMBER",
    subtitle: "Overwatch Deck — Sublevel 3",
    intro:
      "A long window looks down into a laboratory nobody has entered in years. The glass is warm to the touch.",
    objects: [
      {
        id: "window",
        name: "Observation Window",
        glyph: "▭",
        description:
          "Below, overturned trolleys and a chalk outline that is not chalk. Something down there moves the dust.",
        clue: "Something below the observation window is still moving.",
      },
      {
        id: "monitors",
        name: "Monitor Screens",
        glyph: "▣",
        description:
          "Three monitors cycle symbol patterns. A note taped to the frame: \"ONLY THE DIFFERENT ONE MATTERS.\"",
        puzzleId: "r3-monitors",
      },
      {
        id: "switches",
        name: "Three Switches",
        glyph: "☰",
        description:
          "Switches A, B, C. Beside them: \"LIGHT THE PATH. A must be ON. B must be OFF. C must match A.\"",
        puzzleId: "r3-switches",
      },
      {
        id: "radio",
        name: "Broken Radio",
        glyph: "◍",
        description:
          "Static, then a voice half-buried in it: \"four... two... nine...\" Then static again.",
        clue: "The radio repeats: four... two... nine...",
      },
      {
        id: "redbutton",
        name: "Red Emergency Button",
        glyph: "◉",
        description:
          "Under a cracked plastic cover. A faded label reads PURGE. You leave it alone.",
      },
      {
        id: "keypad-door",
        name: "Security Keypad",
        glyph: "⌷",
        description: "The chamber door keypad. Three digits.",
        isDoor: true,
        puzzleId: "r3-keypad",
      },
    ],
    puzzles: [
      {
        id: "r3-monitors",
        roomId: 3,
        type: "choice",
        title: "MONITOR PATTERN",
        description:
          "MONITOR A: ▲ ▲ ■ ▲   |   MONITOR B: ■ ▲ ■ ■   |   MONITOR C: ▲ ■ ▲ ■\n\nOnly the different one matters. Which screen breaks the pattern?",
        options: ["MONITOR A", "MONITOR B", "MONITOR C"],
        solution: "MONITOR A",
        hints: [
          "Two of the screens share a structure.",
          "Compare how many of each symbol appears.",
          "One screen has three of one symbol and one of the other — and it isn't B.",
        ],
        points: 0,
        reward: "Monitor A revealed the number 8.",
        successText: "Monitor A resolves into a single glowing numeral: 8.",
      },
      {
        id: "r3-switches",
        roomId: 3,
        type: "switch",
        title: "CONTROL PANEL SWITCHES",
        description: "LIGHT THE PATH. A must be ON. B must be OFF. C must match A.",
        switches: ["A", "B", "C"],
        solution: "101",
        hints: [
          "Read the instruction one line at a time.",
          "Only B stays down.",
          "A on, B off, C on.",
        ],
        points: 0,
        reward: "The control panel revealed the number 6.",
        successText: "The panel unlatches. Stamped inside the lid: 6.",
      },
      {
        id: "r3-keypad",
        roomId: 3,
        type: "keypad",
        title: "CHAMBER KEYPAD",
        description: "OBSERVATION CHAMBER DOOR — 3 DIGITS",
        solution: "429",
        hints: [
          "Something in this room is still transmitting.",
          "The radio is counting, not talking.",
          "Four, two, nine.",
        ],
        points: 0,
        reward: "Code fragment recovered: 1",
        successText: "The bolts retract in sequence. The deck door swings inward.",
      },
    ],
    requiredPuzzles: ["r3-monitors", "r3-switches", "r3-keypad"],
    nextRoom: 4,
  },
  {
    id: 4,
    name: "THE CORE",
    subtitle: "Reactor Control — Sublevel 4",
    intro:
      "The reactor breathes. A low pressure hum you feel in your teeth. Every surface is warm.",
    nexus: "NICE WORK. BUT YOU WERE NEVER SUPPOSED TO GET THIS FAR.",
    objects: [
      {
        id: "reactor",
        name: "Central Reactor",
        glyph: "◎",
        description:
          "A column of caged light, six metres tall. The cage is scored with handprints from the inside.",
        clue: "There are handprints inside the reactor cage.",
      },
      {
        id: "terminals",
        name: "Energy Terminals",
        glyph: "☰",
        description:
          "Three terminals hold at 42, 18 and 24. The warning screen repeats: BALANCE THE CORE.",
        puzzleId: "r4-balance",
      },
      {
        id: "nexus",
        name: "NEXUS Interface",
        glyph: "◈",
        description: "The lens turns to face you. It has a question.",
        puzzleId: "r4-riddle",
      },
      {
        id: "scanner",
        name: "Security Scanner",
        glyph: "▤",
        description:
          "A palm scanner, long dead. Someone has scratched a single word into the housing: RUN.",
      },
      {
        id: "console",
        name: "Control Console",
        glyph: "▣",
        description: "The blast door console. Four digits.",
        puzzleId: "r4-core",
        isDoor: true,
      },
    ],
    puzzles: [
      {
        id: "r4-balance",
        roomId: 4,
        type: "choice",
        title: "BALANCE THE CORE",
        description:
          "Terminals read 42, 18 and 24. Select the relationship that balances the load.",
        options: ["42 = 18 + 24", "18 = 42 + 24", "24 = 42 + 18", "42 = 24 - 18"],
        solution: "42 = 18 + 24",
        hints: [
          "One value must equal the sum of the other two.",
          "Add the two smaller readings together.",
          "18 plus 24.",
        ],
        points: 0,
        reward: "Core load balanced: 42 = 18 + 24.",
        successText: "The terminals settle into a single steady tone.",
      },
      {
        id: "r4-riddle",
        roomId: 4,
        type: "text",
        title: "NEXUS QUERY",
        description:
          "I HAVE KEYS BUT NO LOCKS.\nI HAVE SPACE BUT NO ROOM.\nYOU CAN ENTER, BUT YOU CANNOT GO INSIDE.\n\nWHAT AM I?",
        solution: "keyboard",
        hints: [
          "You are almost certainly touching one, or its glass imitation.",
          "It has keys, a space and an enter.",
          "It is how you speak to a machine.",
        ],
        points: 0,
        reward: "NEXUS released core access digits: 4 - 2 - 7 - 1.",
        successText: "CORRECT. YOU ARE MORE TIRESOME THAN THE OTHERS.",
      },
      {
        id: "r4-core",
        roomId: 4,
        type: "keypad",
        title: "BLAST DOOR CONSOLE",
        description: "CORE ACCESS — 4 DIGITS",
        solution: "4271",
        hints: [
          "NEXUS already gave it to you.",
          "Check the clue log for the core access sequence.",
          "Four, two, seven, one.",
        ],
        points: 0,
        reward: "Code fragment recovered: 4",
        item: {
          id: "reactor-key",
          name: "Reactor Key",
          description: "A heavy interlock key, still hot from the console slot.",
          glyph: "⚿",
        },
        successText: "The blast door parts. Cold air, for the first time in hours.",
      },
    ],
    requiredPuzzles: ["r4-balance", "r4-riddle", "r4-core"],
    nextRoom: 5,
  },
  {
    id: 5,
    name: "THE FINAL EXIT",
    subtitle: "Escape Chamber — Surface Shaft",
    intro:
      "A single door, thick as a bank vault. Above it, the countdown you have been running from all along.",
    nexus: "YOU HAVE REACHED THE EXIT. BUT THERE IS ONE FINAL TEST.",
    objects: [
      {
        id: "inscription",
        name: "Wall Inscription",
        glyph: "▧",
        description: "Someone carved a riddle into the concrete with a broken tool.",
        puzzleId: "r5-riddle",
      },
      {
        id: "lever",
        name: "Emergency Lever",
        glyph: "☰",
        description:
          "Sealed behind glass. BREAK ONLY ON AUTHORISED EVACUATION. The glass has been broken and replaced twice.",
      },
      {
        id: "nexus-terminal",
        name: "NEXUS Terminal",
        glyph: "◈",
        description:
          "FOUR FRAGMENTS WERE GIVEN TO YOU. ASSEMBLE THEM IN THE ORDER YOU EARNED THEM.",
        clue: "NEXUS: assemble the four recovered fragments in the order you earned them.",
      },
      {
        id: "countdown",
        name: "Countdown Display",
        glyph: "◷",
        description: "The same number the facility has been whispering since you woke.",
      },
      {
        id: "exit",
        name: "Main Exit Door",
        glyph: "⌷",
        description: "The final keypad. Four digits. There is no second attempt worth having.",
        puzzleId: "r5-final",
        isDoor: true,
      },
    ],
    puzzles: [
      {
        id: "r5-riddle",
        roomId: 5,
        type: "text",
        title: "THE INSCRIPTION",
        description:
          "I SPEAK WITHOUT A MOUTH.\nI HEAR WITHOUT EARS.\nI HAVE NO BODY,\nBUT I COME ALIVE WITH WIND.\n\nWHAT AM I?",
        solution: "echo",
        hints: [
          "You have heard it in every corridor of this place.",
          "It only ever repeats what you give it.",
          "Shout in a canyon and wait.",
        ],
        points: 0,
        reward: "FINAL ACCESS CODE REQUIRED.",
        successText: "The inscription glows faintly. FINAL ACCESS CODE REQUIRED.",
      },
      {
        id: "r5-final",
        roomId: 5,
        type: "keypad",
        title: "FINAL KEYPAD",
        description: "MAIN EXIT — 4 DIGITS",
        solution: "5814",
        hints: [
          "Every room gave you one digit.",
          "Read the fragments in your clue log, top to bottom.",
          "Five, eight, one, four.",
        ],
        points: 0,
        successText: "EXIT UNLOCKED.",
      },
    ],
    requiredPuzzles: ["r5-riddle", "r5-final"],
    nextRoom: null,
  },
];

export function getRoom(id: number): Room {
  return rooms.find((r) => r.id === id) ?? rooms[0];
}

export function getPuzzle(id: string) {
  for (const room of rooms) {
    const p = room.puzzles.find((x) => x.id === id);
    if (p) return p;
  }
  return undefined;
}

export function rankFor(score: number): string {
  if (score >= 9000) return "MASTER ESCAPE ARTIST";
  if (score >= 7000) return "ELITE ESCAPER";
  if (score >= 5000) return "SURVIVOR";
  if (score >= 3000) return "LUCKY";
  return "BARELY MADE IT";
}

export function formatTime(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  const m = Math.floor(s / 60);
  return `${String(m).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}
