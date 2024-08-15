import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import Board from "../components/Board";
import Instructions from "../components/Instructions";
import styles from "./Game.module.css";

function TokenIndicator() {
  return (
    <div className={styles.cardContent}>
      <div className={styles.card}>
        <h1>Your token: </h1> <div className={styles.tokenSample} style={{ backgroundColor: "pink" }} />
      </div>
      <div className={styles.card}>
        <h1>Computer&rsquo;s token: </h1>
        <div className={styles.tokenSample} style={{ backgroundColor: "red" }} />
      </div>
    </div>
  );
}

// function TurnIndicator (turn : string) {
//   return (
//     <div>
//       It is {turn}'s turn
//     </div>
//   )
// }

export default function Game() {
  // const turn = "Wen Jie";
  return (
    <>
      <h1>Game has commenced...</h1>

      {/* <Snackbar>
        <Alert severity="error">This is an error Alert.</Alert>
      </Snackbar> */}
      {/* <TurnIndicator turn={turn}></TurnIndicator> */}
      <div className={styles.card}>
        <TokenIndicator />
        <Board />
      </div>
      <Button>Restart Game</Button>
      <Link to="/">
        <Button>End Game</Button>
      </Link>
      <Instructions />
    </>
  );
}
