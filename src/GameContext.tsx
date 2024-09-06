import { createContext, Dispatch, SetStateAction } from "react";

interface GameData {
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
interface GameContextType {
  gameData: GameData | null;
  setGameData: Dispatch<SetStateAction<GameData | null>>;
}

// Create the context with default null values
export const GameContext = createContext<GameContextType | null>(null);

export default GameContext;
