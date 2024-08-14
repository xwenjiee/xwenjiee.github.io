import CustomButton from "../components/Button";
import Instructions from "../components/Instructions";
import styles from "./App.module.css";

function App() {
  return (
    <div className={styles.root}>
      <img className={styles.logo} alt="Connect 4 logo" src="src\assets\logo-removebg-preview.png" />
      <div className={styles.card}>
        <CustomButton label="Start Game" to="/game" />
        <Instructions label="Instructions and Rules" />
      </div>
    </div>
  );
}

export default App;
