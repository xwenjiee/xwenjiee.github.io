import CustomButton from "../components/Button/Button";
import Instructions from "../components/Instructions";
import Board from "./Board";
import styles from "./Game.module.css";

function TokenIndicator() {
  return (
    <div className={`${styles.legendSection}`}>
      <div className={`${styles.card}`}>
        <h1>Your token: </h1> <div className={styles.tokenSample} style={{ backgroundColor: "pink" }} />
      </div>
      <div className={`${styles.card}`}>
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
      {/* <TurnIndicator turn={turn}></TurnIndicator> */}
      <img alt="Connect 4 logo" className={styles.logo} src="src\assets\logo-removebg-preview.png" />
      <div>
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
    </>
  );
}
