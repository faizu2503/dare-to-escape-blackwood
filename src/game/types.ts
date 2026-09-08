export type PuzzleType = "keypad" | "text" | "choice" | "switch";

export interface Puzzle {
  id: string;
  roomId: number;
  type: PuzzleType;
  title: string;
  description: string;
  /** Solution is kept in data, never rendered into the DOM. */
  solution: string;
  options?: string[];
  switches?: string[];
  hints: string[];
  points: number;
  /** Clue text unlocked when solved. */
  reward?: string;
  /** Inventory item granted when solved. */
  item?: InventoryItem;
  /** Message shown on success. */
  successText: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  glyph: string;
}

export interface RoomObject {
  id: string;
  name: string;
  glyph: string;
  description: string;
  /** Clue recorded in the log when examined. */
  clue?: string;
  /** Opens this puzzle when examined. */
  puzzleId?: string;
  /** The room exit. */
  isDoor?: boolean;
}

export interface Room {
  id: number;
  name: string;
  subtitle: string;
  intro: string;
  nexus?: string;
  objects: RoomObject[];
  puzzles: Puzzle[];
  requiredPuzzles: string[];
  nextRoom: number | null;
}

export interface GameState {
  playerName: string;
  currentRoom: number;
  endsAt: number | null;
  remainingTime: number;
  score: number;
  hintsUsed: number;
  attempts: number;
  discoveredClues: string[];
  inventory: InventoryItem[];
  solvedPuzzles: string[];
  hintedPuzzles: Record<string, number>;
  unlockedRooms: number;
  gameStarted: boolean;
  gameCompleted: boolean;
  gameOver: boolean;
  soundOn: boolean;
  startedAt: number | null;
}

export interface ScoreEntry {
  name: string;
  score: number;
  timeUsed: number;
  hints: number;
  date: string;
  rank: string;
}
