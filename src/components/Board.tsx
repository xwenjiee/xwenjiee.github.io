import { Alert, Snackbar, SnackbarCloseReason } from "@mui/material";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import clsx from "clsx";
import { useState, useEffect } from "react";
import styles from "./Board.module.css";
import CustomButton from "./Button";

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

function Board() {
  const [board, setBoard] = useState<BoardArray>(
    Array(7)
      .fill(null)
      .map(() => Array(6).fill(null))
  );

  const [isPlayerTurn, setPlayerTurn] = useState(true);

  const [winnerFound, setWinnerFound] = useState(false);
  const [gameOver, setGameOver] = useState<string | null>(null);
  const [lastMove, setLastMove] = useState<{ column: number; row: number } | null>(null);

  const [open, setOpenError] = useState(false);

  const [openEndGame, setOpenEndGame] = useState(false);

  const handleClose = (_event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenError(false);
  };

  useEffect(() => {
    if (lastMove) {
      setWinnerFound(checkWinner(lastMove.column, lastMove.row, board[lastMove.column][lastMove.row], board));
    }
  }, [board, lastMove]); // Dependency array includes `board` and `lastMove`

  useEffect(() => {
    if (winnerFound && lastMove) {
      let gameOverText = "";
      if (board[lastMove.column][lastMove.row] === "<3") {
        gameOverText = "You win! Congratulations.";
      } else if (board[lastMove.column][lastMove.row] === "lol") {
        gameOverText = "You lose! Computer wins.";
      }
      setGameOver(gameOverText);
      setOpenEndGame(true);
    }
  }, [winnerFound, board, lastMove]);

  useEffect(() => {
    const delay = (ms: number): Promise<void> =>
      new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve(); // Call resolve without returning a value
        }, ms);
      });
    const computerMove = async () => {
      const tempBoard = board.map((row) => [...row]);
      const colIdxLimit = 6; // Adjusted based on the board size (0-6 for 7 columns)
      const rowIdxLimit = 5; // Adjusted based on the board size (0-5 for 6 rows)

      const determineMove = () => {
        // 1. Check for winning move
        for (let col = 0; col < colIdxLimit; col += 1) {
          for (let row = 0; row < rowIdxLimit; row += 1) {
            if (tempBoard[col][row] === null) {
              if (checkWinner(col, row, "lol", tempBoard)) {
                return { column: col, row };
              }
              break;
            }
          }
        }

        // 2. Check for blocking move
        for (let col = 0; col < colIdxLimit; col += 1) {
          for (let row = 0; row < rowIdxLimit; row += 1) {
            if (tempBoard[col][row] === null) {
              if (checkWinner(col, row, "<3", tempBoard)) {
                return { column: col, row };
              }
              break;
            }
          }
        }

        // 3. Check for strategic move
        for (let col = 0; col < colIdxLimit; col += 1) {
          for (let row = 0; row < rowIdxLimit; row += 1) {
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

        for (let col = 0; col < colIdxLimit; col += 1) {
          if (tempBoard[col].includes(null)) {
            for (let row = 0; row < rowIdxLimit; row += 1) {
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
                break; // No need to keep checking rows in this column
              }
            }
          }
        }

        if (validColumns.length > 0) {
          const randomCol = validColumns[Math.floor(Math.random() * validColumns.length)];
          for (let row = 0; row < rowIdxLimit; row += 1) {
            if (tempBoard[randomCol][row] === null) {
              return { column: randomCol, row };
            }
          }
        }

        return null; // In case no valid move is found (shouldn't happen)
      };

      const move = determineMove();
      if (move) {
        await delay(500); // Introduce a delay before making the move
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
            // return col.map((item) => {
            return col.map((item, idx2) => {
              if (item === null && !nullFound) {
                nullFound = true;
                column = idx;
                row = idx2;
                // checkWinner(column, row)
                setLastMove({ column: idx, row: idx2 });
                setPlayerTurn(false); // Optional: Update player turn status
                return "<3"; // Player token
              }
              return item;
            });
          }
          if (idx === columnIndex && !col.includes(null)) {
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
      } else {
        setPlayerTurn(false); // Switch to computer's turn
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
  // const handleEndGameClose = () => setOpenEndGame(false);

  return (
    <>
      <Modal
        open={openEndGame}
        // onClose={handleEndGameClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className={styles.gameOverModal}>
          <h1 className={styles.gameOverTitle}>Game Over!</h1>
          <div className={styles.gameOverText}>{gameOver}</div>

          <div className={styles.buttonsDiv}>
            <CustomButton label="New Game" />
            <CustomButton label="Quit Game" />
          </div>
        </Box>
      </Modal>
      <Snackbar
        open={open}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={2000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="error" variant="filled" sx={{ width: "100%" }}>
          You cannot place tokens in a full column!
        </Alert>
      </Snackbar>
      <div className={styles.grid}>
        {board.map((column, columnIndex) => (
          <div
            id={`col-${columnIndex}`}
            //   key={`column-${columnIndex}`}
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
    </>
  );
}

export default Board;
