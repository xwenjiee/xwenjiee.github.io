import CustomButton from "../components/Button/Button";
import Instructions from "../components/Instructions";
import styles from "./App.module.css";

function App() {
  return (
    <>
      {/* <h1>Hello, Welcome to Connect 4</h1> */}
      <div className={styles.root}>
        <img alt="Connect 4 logo" src="src\assets\logo-removebg-preview.png" />
        <div className={styles.card}>
          <CustomButton label="Start Game" to="/game" />
          <Instructions label="Instructions and Rules" />
        </div>
      </div>
    </>
  );
}

export default App;
