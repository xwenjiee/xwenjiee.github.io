import Board from "../components/Board";
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

export default function Game() {
  return (
    <div className={styles.game}>
      <img alt="Connect 4 logo" className={styles.logo} src="src\assets\logo-removebg-preview.png" />
      <TokenIndicator />
      <div className={`${styles.section}`}>
        <Board />
      </div>
    </div>
  );
}
