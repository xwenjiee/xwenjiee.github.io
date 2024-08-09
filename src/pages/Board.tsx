import { Alert, Snackbar, SnackbarCloseReason } from "@mui/material";
import clsx from "clsx";
import React, { useState, useEffect } from "react";
import styles from "./Board.module.css";

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
      console.log(thisCol, thisRow);
    }
  }
  console.log(consecutive);
  return consecutive;
}

function checkWinner(col: number, row: number, token: string | null, board: BoardArray) {
  // if (!board || board[col][row] === null) return;
  let winner = false;

  console.log(token);

  const colIdxLimit = 6;
  const rowIdxLimit = 5;

  // check straight same col
  console.log("printing line in same col");
  const consecutive = 1;

  const totalConsecSameCol =
    consecutive +
    checkLinesAndDiagonals(col, row, colIdxLimit, rowIdxLimit, 0, 1, token, board) +
    checkLinesAndDiagonals(col, row, colIdxLimit, rowIdxLimit, 0, -1, token, board);

  if (totalConsecSameCol === 4) {
    console.log("winner found!!!!!");
    winner = true;
  }

  // check straight same row
  console.log("printing line in same row");

  const totalConsecSameRow =
    consecutive +
    checkLinesAndDiagonals(col, row, colIdxLimit, rowIdxLimit, 1, 0, token, board) +
    checkLinesAndDiagonals(col, row, colIdxLimit, rowIdxLimit, -1, 0, token, board);

  if (totalConsecSameRow === 4) {
    console.log("winner found!!!!!");
    winner = true;
  }

  // check diagonal left up and right down
  console.log("printing diagonals left up and right down");

  const totalConsecLeftUpRightDown =
    consecutive +
    checkLinesAndDiagonals(col, row, colIdxLimit, rowIdxLimit, -1, 1, token, board) +
    checkLinesAndDiagonals(col, row, colIdxLimit, rowIdxLimit, 1, -1, token, board);

  if (totalConsecLeftUpRightDown === 4) {
    console.log("winner found!!!!!");
    winner = true;
  }

  // check diagonal right up and left down
  console.log("printing diagonals right up and left down");

  const totalConsecRightUpLeftDown =
    consecutive +
    checkLinesAndDiagonals(col, row, colIdxLimit, rowIdxLimit, 1, 1, token, board) +
    checkLinesAndDiagonals(col, row, colIdxLimit, rowIdxLimit, -1, -1, token, board);

  if (totalConsecRightUpLeftDown === 4) {
    console.log("winner found!!!!!");
    winner = true;
  }

  console.log("done");

  // exclude negatives
  console.log(winner);

  return winner;
}

function Board() {
  const [board, setBoard] = useState<BoardArray>([
    [null, null, null, null, null, null],
    [null, null, null, null, null, null],
    [null, null, null, null, null, null],
    [null, null, null, null, null, null],
    [null, null, null, null, null, null],
    [null, null, null, null, null, null],
    [null, null, null, null, null, null],
  ]);

  // const [isPlayerTurn, setPlayerTurn] = useState(true);
  const isPlayerTurn = true;

  const [winnerFound, setWinnerFound] = useState(false);
  const [lastMove, setLastMove] = useState<{ column: number; row: number } | null>(null);

  const [open, setOpenError] = React.useState(false);

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
    if (!isPlayerTurn && winnerFound === false) {
      // computerMove();
    }
  }, [isPlayerTurn, winnerFound]);

  // check which move will result in a win/which move to block for the player
  // function checkWinningMove() {

  // }

  function handlePlayerToken(columnIndex: number) {
    let column = 0;
    let row = 0;

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
              // checkWinner(column, row)
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

      setLastMove({ column, row }); // Track the last move
      return newBoard;
    });

    // After board state updates and lastMove is set, `checkWinner` will be called
    // setPlayerTurn(false); // Optional: Update player turn status
    // computerMove();
  }

  // function computerMove() {
  //   let column = 0;
  //   let row = 0;

  //   if (winnerFound === false) {
  //     setTimeout(() => {
  //       setBoard((prevBoard) => {
  //         const newBoard = prevBoard.map((col, idx) => {
  //           if (idx === 1 && prevBoard[1].includes(null)) {
  //             let nullFound = false;
  //             return col.map((item, idx2) => {
  //               if (item === null && !nullFound) {
  //                 nullFound = true;
  //                 column = idx;
  //                 row = idx2;
  //                 setPlayerTurn(true);
  //                 return "lol"; // Computer token
  //               }
  //               return item;
  //             });
  //           }
  //           return col;
  //         });
  //         setLastMove({ column, row });

  //         return newBoard;
  //       });

  //        // Optional: Update player turn status
  //     }, 500);

  //   }

  // }

  function getTokenType(item: string | null) {
    if (item === "<3") {
      return "pink";
    }
    if (item === "lol") {
      return "red";
    }
    return "#272727";
  }

  return (
    <>
      <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" variant="filled" sx={{ width: "100%" }}>
          You cannot place tokens in a full column!
        </Alert>
      </Snackbar>
      <div className={styles.cardContent}>
        <div className={styles.grid}>
          {board.map((column, columnIndex) => (
            <div
              id={`col-${columnIndex}`}
              //   key={`column-${columnIndex}`}
              className={clsx(styles.gridColumn, {
                [styles.playerTurn]: isPlayerTurn,
                [styles.notPlayerTurn]: !isPlayerTurn,
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
      </div>
    </>
  );
}

export default Board;
