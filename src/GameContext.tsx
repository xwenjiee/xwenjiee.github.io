import { createContext, Dispatch, SetStateAction } from "react";

// Define the GameData interface
export interface GameData {
  id: string;
  data: {
    board: string;
    isPlayerTurn: string;
    gameOver: string;
    lastMove: string;
    openEndGame: string;
    winnerFound: string;
  };
}

// Define a type for the context value
export interface GameContextType {
  gameData: GameData | null;
  setGameData: Dispatch<SetStateAction<GameData | null>>;
}

// Create the context with default null values
export const GameContext = createContext<GameContextType | null>(null);

export default GameContext;
