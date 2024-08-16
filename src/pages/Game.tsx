import Board from "../components/Board";
import CustomButton from "../components/Button";
import Instructions from "../components/Instructions";
import styles from "./Game.module.css";

function TokenIndicator() {
  return (
    <div className={styles.legendSection}>
      <div className={styles.card}>
        <h1>Your token: </h1> <div className={styles.tokenSample} style={{ backgroundColor: "#ff3838" }} />
      </div>
      <div className={styles.card}>
        <h1>Computer&rsquo;s token: </h1>
        <div className={styles.tokenSample} style={{ backgroundColor: "#ffd138" }} />
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
    <div className={styles.game}>
      {/* <TurnIndicator turn={turn}></TurnIndicator> */}
      <img alt="Connect 4 logo" className={styles.logo} src="src\assets\logo-removebg-preview.png" />
      <TokenIndicator />
      <div className={`${styles.section} ${styles.card}`}>
        <Board />
      </div>
      <div className={styles.section}>
        <div className={styles.buttonsDiv}>
          <CustomButton label="Restart Game" />
          <CustomButton label="End Game" to="/" />
          <Instructions label="" />
        </div>
      </div>
    </div>
  );
}
