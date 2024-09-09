import React, { useState, useMemo } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { GameContext } from "./GameContext";
import App from "./pages/App";
import Game from "./pages/Game";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/connect-4-wj/game",
    element: <Game />,
  },
  {
    path: "/connect-4-wj/",
    element: <App />,
  },
]);

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

const Root = () => {
  const [gameData, setGameData] = useState<GameData | null>(null);

  // Use useMemo to memoize the value for the context provider
  const contextValue = useMemo(() => ({ gameData, setGameData }), [gameData, setGameData]);

  return (
    <React.StrictMode>
      <GameContext.Provider value={contextValue}>
        <RouterProvider router={router} />
      </GameContext.Provider>
    </React.StrictMode>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(<Root />);
