import { Alert, Snackbar, SnackbarCloseReason } from "@mui/material";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import axios from "axios";
import clsx from "clsx";
import { useState, useEffect, useRef, useCallback } from "react";
import { GameData } from "../GameContext";
import styles from "./Board.module.css";
import CustomButton from "./Button";
import Confirmation from "./Confirmation";
import CustomGameIDTextField from "./GameIDTextField";
import Instructions from "./Instructions";

type BoardArray = Array<Array<string | null>>;

function checkLinesAndDiagonals(
  col: number,
  row: number,
  colIdxLimit: number,
  rowIdxLimit: number,
  colStep: number,
  rowStep: number,
  token: string | null,
  board: BoardArray
) {
  let consecutive = 0;

  let thisCol = col;
  let thisRow = row;
  while (true) {
    thisCol += colStep;
    thisRow += rowStep;

    // Exit loop if the position goes out of bounds
    if (
      thisCol < 0 ||
      thisCol > colIdxLimit ||
      thisRow < 0 ||
      thisRow > rowIdxLimit ||
      board[thisCol][thisRow] !== token
    ) {
      break;
    } else if (board[thisCol][thisRow] === token) {
      consecutive += 1;
    }
  }
  return consecutive;
}

// basic validation to validate that its my data (not corrupted/someone else's game data)
function isGameData(data: unknown): data is GameData {
  return (
    typeof data === "object" &&
    data !== null &&
    typeof (data as GameData).id === "string" &&
    typeof (data as GameData).data === "object" &&
    (data as GameData).data !== null &&
    typeof (data as GameData).data.board === "string" &&
    typeof (data as GameData).data.isPlayerTurn === "string" &&
    typeof (data as GameData).data.gameOver === "string" &&
    typeof (data as GameData).data.lastMove === "string" &&
    typeof (data as GameData).data.openEndGame === "string" &&
    typeof (data as GameData).data.winnerFound === "string"
  );
}
function checkWinner(col: number, row: number, token: string | null, board: BoardArray) {
  let winnerFound = false;

  console.log(token);

  const colIdxLimit = 6;
  const rowIdxLimit = 5;

  // check straight same col
  const consecutive = 1;

  const totalConsecSameCol =
    consecutive +
    checkLinesAndDiagonals(col, row, colIdxLimit, rowIdxLimit, 0, 1, token, board) +
    checkLinesAndDiagonals(col, row, colIdxLimit, rowIdxLimit, 0, -1, token, board);

  if (totalConsecSameCol === 4) {
    console.log("winner found!!!!!");
    winnerFound = true;
  }

  // check straight same row
  const totalConsecSameRow =
    consecutive +
    checkLinesAndDiagonals(col, row, colIdxLimit, rowIdxLimit, 1, 0, token, board) +
    checkLinesAndDiagonals(col, row, colIdxLimit, rowIdxLimit, -1, 0, token, board);

  if (totalConsecSameRow === 4) {
    console.log("winner found!!!!!");
    winnerFound = true;
  }

  // check diagonal left up and right down
  const totalConsecLeftUpRightDown =
    consecutive +
    checkLinesAndDiagonals(col, row, colIdxLimit, rowIdxLimit, -1, 1, token, board) +
    checkLinesAndDiagonals(col, row, colIdxLimit, rowIdxLimit, 1, -1, token, board);

  if (totalConsecLeftUpRightDown === 4) {
    console.log("winner found!!!!!");
    winnerFound = true;
  }

  // check diagonal right up and left down
  const totalConsecRightUpLeftDown =
    consecutive +
    checkLinesAndDiagonals(col, row, colIdxLimit, rowIdxLimit, 1, 1, token, board) +
    checkLinesAndDiagonals(col, row, colIdxLimit, rowIdxLimit, -1, -1, token, board);

  if (totalConsecRightUpLeftDown === 4) {
    console.log("winner found!!!!!");
    winnerFound = true;
  }

  console.log("done");

  // exclude negatives
  console.log(winnerFound);

  return winnerFound;
}

function Board({ gameData }: { gameData: GameData | null }) {
  const prefix = "connect-4-wj-";
  const [board, setBoard] = useState<BoardArray>(
    Array(7)
      .fill(null)
      .map(() => Array(6).fill(null))
  );

  const [isPlayerTurn, setPlayerTurn] = useState(true);

  const [winnerFound, setWinnerFound] = useState(false);
  const [gameOver, setGameOver] = useState<string | null>(null);
  const [lastMove, setLastMove] = useState<{ column: number; row: number } | null>(null);
  const [thisGameData, setThisGameData] = useState<GameData | null | undefined>(gameData);
  const [postedEndGame, setPostedEndGame] = useState(false);

  const [openEndGame, setOpenEndGame] = useState(false);
  const [openSaveGameSuccess, setOpenSaveGameSuccess] = useState(false);
  const handleCloseSaveGameSuccess = (_event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSaveGameSuccess(false);
  };

  const [openSaveGameInput, setOpenSaveGameInput] = useState(false);
  const handleCloseSaveGameInput = () => setOpenSaveGameInput(false);

  useEffect(() => {
    if (thisGameData !== undefined && thisGameData !== null && isGameData(thisGameData)) {
      const parsedBoard = JSON.parse(thisGameData.data.board);
      const parsedIsPlayerTurn = JSON.parse(thisGameData.data.isPlayerTurn);
      const parsedGameOver = JSON.parse(thisGameData.data.gameOver);
      const parsedLastMove = JSON.parse(thisGameData.data.lastMove);
      const parsedWinnerFound = JSON.parse(thisGameData.data.winnerFound);
      const parsedOpenEndGame = JSON.parse(thisGameData.data.openEndGame);

      setBoard(parsedBoard);
      setPlayerTurn(parsedIsPlayerTurn);
      setWinnerFound(parsedWinnerFound);
      setGameOver(parsedGameOver);
      setLastMove(parsedLastMove);
      setOpenEndGame(parsedOpenEndGame);
    }
  }, [thisGameData]);

  const [openError, setOpenError] = useState(false);
  const [errorText, setErrorText] = useState("");
  const handleClose = (_event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenError(false);
  };

  const fetchData = async (id: string) => {
    try {
      const response = await axios.get("https://cpy6alcm5f.execute-api.ap-southeast-1.amazonaws.com/", {
        params: {
          id: prefix.concat(id),
        },
        headers: {
          "Content-Type": "application/json",
        },
      });
      const { data } = response;

      if (isGameData(data)) {
        console.log("Data fetched successfully:", response.data);
        return response.data;
      }
      console.log("Data is not valid:", response.data);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        console.error("Error fetching data:", error.response.data);
      } else {
        console.error("Error message:", (error as Error).message);
      }
      return null;
    }
  };

  const postData = useCallback(
    async (id: string) => {
      try {
        const response = await axios.post(
          "https://cpy6alcm5f.execute-api.ap-southeast-1.amazonaws.com/",
          {
            id: prefix.concat(id),
            data: {
              board: JSON.stringify(board),
              isPlayerTurn: JSON.stringify(isPlayerTurn),
              gameOver: JSON.stringify(gameOver),
              lastMove: JSON.stringify(lastMove),
              winnerFound: JSON.stringify(winnerFound),
              openEndGame: JSON.stringify(openEndGame),
            },
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Data posted successfully:", response.data);
        if (response.data) {
          handleCloseSaveGameInput();
          setOpenSaveGameSuccess(true);
          setThisGameData(response.data);
        }
      } catch (error: unknown) {
        setErrorText("Error saving game.");
        setOpenError(true);

        if (axios.isAxiosError(error) && error.response) {
          console.error("Error response:", error.response.data);
        } else if (axios.isAxiosError(error)) {
          console.error("Error request:", error.request);
        } else {
          console.error("Error message:", (error as Error).message);
        }
      }
    },
    [board, isPlayerTurn, gameOver, lastMove, winnerFound, openEndGame, prefix] // Add dependencies
  );

  async function handleOpenSaveGame() {
    if (thisGameData) {
      try {
        await postData(thisGameData.id.replace(/^connect-4-wj-/, ""));
      } catch (error) {
        setErrorText("Error saving game.");
        setOpenError(true);
        console.error("Error while saving game or fetching data:", error);
      }
    } else {
      setOpenSaveGameInput(true);
    }
  }

  const [openConfirmQuit, setOpenConfirmQuit] = useState(false);
  const handleOpenConfirmQuit = () => setOpenConfirmQuit(true);
  const handleCloseConfirmQuit = () => setOpenConfirmQuit(false);

  const [openConfirmRestart, setOpenConfirmRestart] = useState(false);
  const handleOpenConfirmRestart = () => setOpenConfirmRestart(true);
  const handleCloseConfirmRestart = () => setOpenConfirmRestart(false);

  useEffect(() => {
    if (lastMove) {
      setWinnerFound(checkWinner(lastMove.column, lastMove.row, board[lastMove.column][lastMove.row], board));
    }
  }, [board, lastMove]);

  useEffect(() => {
    if (winnerFound && lastMove) {
      const lastToken = board[lastMove.column][lastMove.row];

      if (lastToken === "<3") {
        setGameOver("You win! Congratulations.");
      } else if (lastToken === "lol") {
        setGameOver("You lose! Computer wins.");
      }

      if (thisGameData && !postedEndGame) {
        postData(thisGameData.id.replace(/^connect-4-wj-/, ""));
        setPostedEndGame(true);
      }
      setOpenEndGame(true);
    } else if (!board.some((row) => row.includes(null)) && !winnerFound) {
      setGameOver("It's a draw! No one wins.");

      if (thisGameData && !postedEndGame) {
        postData(thisGameData.id.replace(/^connect-4-wj-/, ""));
        setPostedEndGame(true);
      }
      setOpenEndGame(true);
    }
  }, [winnerFound, board, lastMove, thisGameData, postedEndGame, postData]);

  useEffect(() => {
    const delay = (ms: number): Promise<void> =>
      new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    const computerMove = async () => {
      const tempBoard = board.map((row) => [...row]);
      const colIdxLimit = 6;
      const rowIdxLimit = 5;

      const determineMove = () => {
        // 1. Check for winning move
        for (let col = 0; col <= colIdxLimit; col += 1) {
          for (let row = 0; row <= rowIdxLimit; row += 1) {
            if (tempBoard[col][row] === null) {
              if (checkWinner(col, row, "lol", tempBoard)) {
                return { column: col, row };
              }
              break;
            }
          }
        }

        // 2. Check for blocking move
        for (let col = 0; col <= colIdxLimit; col += 1) {
          for (let row = 0; row <= rowIdxLimit; row += 1) {
            if (tempBoard[col][row] === null) {
              if (checkWinner(col, row, "<3", tempBoard)) {
                return { column: col, row };
              }
              break;
            }
          }
        }

        // 3. Check for strategic move
        for (let col = 0; col <= colIdxLimit; col += 1) {
          for (let row = 0; row <= rowIdxLimit; row += 1) {
            if (tempBoard[col][row] === null) {
              const sameCol =
                checkLinesAndDiagonals(col, row, colIdxLimit, rowIdxLimit, 0, -1, "lol", tempBoard) +
                checkLinesAndDiagonals(col, row, colIdxLimit, rowIdxLimit, 0, 1, "lol", tempBoard);
              const sameRow =
                checkLinesAndDiagonals(col, row, colIdxLimit, rowIdxLimit, 1, 0, "lol", tempBoard) +
                checkLinesAndDiagonals(col, row, colIdxLimit, rowIdxLimit, -1, 0, "lol", tempBoard);
              const diagonal1 =
                checkLinesAndDiagonals(col, row, colIdxLimit, rowIdxLimit, -1, 1, "lol", tempBoard) +
                checkLinesAndDiagonals(col, row, colIdxLimit, rowIdxLimit, 1, -1, "lol", tempBoard);
              const diagonal2 =
                checkLinesAndDiagonals(col, row, colIdxLimit, rowIdxLimit, 1, 1, "lol", tempBoard) +
                checkLinesAndDiagonals(col, row, colIdxLimit, rowIdxLimit, -1, -1, "lol", tempBoard);

              if (sameCol > 0 || sameRow > 0 || diagonal1 > 0 || diagonal2 > 0) {
                return { column: col, row };
              }
              break;
            }
          }
        }

        // 4. Make a random move
        const validColumns = [];

        for (let col = 0; col <= colIdxLimit; col += 1) {
          if (tempBoard[col].includes(null)) {
            for (let row = 0; row <= rowIdxLimit; row += 1) {
              if (
                (col === 0 && (tempBoard[col][row] === "<3" || tempBoard[col + 1]?.[row] === "<3")) ||
                (col === 6 && (tempBoard[col][row] === "<3" || tempBoard[col - 1]?.[row] === "<3")) ||
                (col > 0 &&
                  col < 6 &&
                  (tempBoard[col][row] === "<3" ||
                    tempBoard[col - 1]?.[row] === "<3" ||
                    tempBoard[col + 1]?.[row] === "<3"))
              ) {
                validColumns.push(col);
                break;
              }
            }
          }
        }
        if (validColumns.length > 0) {
          const randomCol = validColumns[Math.floor(Math.random() * validColumns.length)];
          for (let row = 0; row <= rowIdxLimit; row += 1) {
            if (tempBoard[randomCol][row] === null) {
              return { column: randomCol, row };
            }
          }
        }

        return null;
      };

      const move = determineMove();
      if (move) {
        await delay(500);
        tempBoard[move.column][move.row] = "lol";
        setLastMove({ column: move.column, row: move.row });
        setBoard(tempBoard);
        setPlayerTurn(true);
      }
    };

    if (!isPlayerTurn && !winnerFound) {
      computerMove();
    }
  }, [isPlayerTurn, winnerFound, board]);

  function handlePlayerToken(columnIndex: number) {
    let column = 0;
    let row = 0;

    if (!winnerFound) {
      setBoard((prevBoard) => {
        const newBoard = prevBoard.map((col, idx) => {
          if (idx === columnIndex && col.includes(null)) {
            setOpenError(false);
            let nullFound = false;
            return col.map((item, idx2) => {
              if (item === null && !nullFound) {
                nullFound = true;
                column = idx;
                row = idx2;
                setLastMove({ column: idx, row: idx2 });
                setPlayerTurn(false);
                return "<3"; // Player token
              }
              return item;
            });
          }

          if (idx === columnIndex && !col.includes(null)) {
            setErrorText("You cannot place tokens in a full column!");
            setOpenError(true);
          }
          return col;
        });

        // Track the last move
        return newBoard;
      });

      // Check for a winner after the board has been updated
      const token = "<3"; // Player token
      const isWinner = checkWinner(column, row, token, board);
      if (isWinner) {
        setWinnerFound(true);
      }
    }
  }

  function getTokenType(item: string | null) {
    if (item === "<3") {
      return "#ff3838";
    }
    if (item === "lol") {
      return "#ffd138";
    }
    return "#272727";
  }

  function resetGame() {
    setBoard(
      Array(7)
        .fill(null)
        .map(() => Array(6).fill(null))
    );
    setPlayerTurn(true);
    setWinnerFound(false);
    setGameOver(null);
    setLastMove(null);
    setOpenError(false);
    setOpenEndGame(false);
    handleCloseConfirmRestart();
    setThisGameData(undefined);
  }

  const gameIDRef = useRef<HTMLInputElement>(null);

  const handleSaveGameInput = async () => {
    if (gameIDRef.current) {
      const gameID = gameIDRef.current.value.trim();

      if (gameID.trim() === "") {
        setErrorText("Game ID cannot be empty.");
        setOpenError(true);
        return;
      }
      if (!/^[a-zA-Z0-9]+$/.test(gameID)) {
        setErrorText("Game ID must be alphanumeric and cannot contain spaces.");
        setOpenError(true);
        return; // Exit the function if validation fails
      }

      try {
        const exist = await fetchData(gameID);
        if (exist.message === "Entry not found") {
          setOpenError(false);
          await postData(gameID);
        } else {
          setErrorText("Game ID is already taken.");
          setOpenError(true);
        }
      } catch (error) {
        console.error("Error while saving game or fetching data:", error);
      }
    }
  };

  return (
    <>
      {thisGameData?.id ? (
        <p>Game ID: {thisGameData.id.replace(/^connect-4-wj-/, "")}</p>
      ) : (
        <p>No game data available.</p>
      )}
      <Confirmation
        open={openConfirmQuit}
        close={handleCloseConfirmQuit}
        confirmationText="Are you sure you want to quit the game?"
        to="/"
      />
      <Confirmation
        open={openConfirmRestart}
        close={handleCloseConfirmRestart}
        confirmationText="Are you sure you want to start a new game?"
        action={() => resetGame()}
      />

      {/* no game id found, prompt to enter keyword */}
      <Modal open={openSaveGameInput} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box className={styles.actionModal}>
          <h1 className={styles.saveGameTitle}>Save Game</h1>
          <div className={styles.saveGameInputText}>
            <CustomGameIDTextField
              inputRef={gameIDRef}
              helperText="Create a unique game ID to save your game (alphanumeric)"
              label="Game ID"
              id="custom-css-outlined-input"
              action={handleSaveGameInput}
            />
          </div>
          <div className={styles.modalButtonsContainer}>
            <CustomButton save label="Save Game" onClick={handleSaveGameInput} />
            <CustomButton label="Cancel" onClick={handleCloseSaveGameInput} />
          </div>
        </Box>
      </Modal>

      <Modal open={openEndGame} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box className={styles.actionModal}>
          <h1 className={styles.gameOverTitle}>Game Over!</h1>
          <div className={styles.gameOverText}>{gameOver}</div>

          <div className={styles.modalButtonsContainer}>
            <CustomButton label="New Game" onClick={() => resetGame()} />
            <CustomButton label="Quit Game" to="/" />
          </div>
        </Box>
      </Modal>

      {/* error snackbar */}
      <Snackbar
        open={openError}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={2000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="error" variant="filled" sx={{ width: "100%" }}>
          {errorText}
        </Alert>
      </Snackbar>

      {/* success snackbar */}
      <Snackbar
        open={openSaveGameSuccess}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={2000}
        onClose={handleCloseSaveGameSuccess}
      >
        <Alert onClose={handleCloseSaveGameSuccess} severity="success" variant="filled" sx={{ width: "100%" }}>
          Game saved.
        </Alert>
      </Snackbar>

      <div className={styles.grid}>
        {board.map((column, columnIndex) => (
          <div
            id={`col-${columnIndex}`}
            // key={`col-${columnIndex}`}
            className={clsx(styles.gridColumn, {
              [styles.playerTurn]: isPlayerTurn,
              [styles.notPlayerTurn]: !isPlayerTurn,
              [styles.columnFull]: !board[columnIndex].includes(null),
            })}
            onClick={() => {
              isPlayerTurn ? handlePlayerToken(columnIndex) : console.log("not your turn");
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                isPlayerTurn ? handlePlayerToken(columnIndex) : console.log("not your turn");
              }
            }}
          >
            {column
              .slice()
              .reverse()
              .map((item, rowIndex) => (
                <div
                  id={`col-${columnIndex}-row-${rowIndex}`}
                  // key={`col-${columnIndex}-row-${rowIndex}`}
                  className={clsx({
                    [styles.gridItemEmpty]: getTokenType(item) === "#272727",
                    [styles.gridItem]: getTokenType(item) !== "#272727",
                  })}
                  style={{ backgroundColor: getTokenType(item) }}
                />
              ))}
          </div>
        ))}
      </div>
      <div className={styles.boardButtonsContainer}>
        <CustomButton label="Restart Game" onClick={handleOpenConfirmRestart} />
        <CustomButton label="End Game" onClick={handleOpenConfirmQuit} />
        <CustomButton label="Save Game" save onClick={handleOpenSaveGame} />
        <Instructions label="" />
      </div>
    </>
  );
}

export default Board;
