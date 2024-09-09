import { Snackbar, SnackbarCloseReason, Alert } from "@mui/material";
import axios from "axios";
import { useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GameContext } from "../GameContext";
import CustomButton from "../components/Button";
import CustomGameIDTextField from "../components/GameIDTextField";
import Instructions from "../components/Instructions";
import styles from "./App.module.css";

function App() {
  const [openError, setOpenError] = useState(false);
  const [errorText, setErrorText] = useState("");

  const gameContext = useContext(GameContext);
  const gameIDRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Add a guard clause for gameContext if it is not available
  if (!gameContext) {
    setErrorText("Error: Game context unavailable.");
    setOpenError(true);
    return null;
  }

  const { setGameData } = gameContext;
  setGameData(null); // Always reset gameData at the beginning

  const handleClose = (_event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenError(false);
  };

  const prefix = "connect-4-wj-";

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
      console.log("Data fetched successfully:", response.data);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        setErrorText("Error loading game.");
        setOpenError(true);
        console.error("Error fetching data:", error.response.data);
      } else {
        console.error("Error message:", (error as Error).message);
      }
      return null;
    }
  };

  const handleStartGame = async () => {
    if (gameIDRef.current) {
      const gameID = gameIDRef.current.value;
      if (gameID) {
        if (!/^[a-zA-Z0-9]+$/.test(gameID)) {
          setErrorText("Please enter a valid alphanumeric game ID.");
          setOpenError(true);
        } else {
          const fetchedData = await fetchData(gameID);

          if (fetchedData?.message === "Entry not found") {
            setErrorText("Game not found.");
            setOpenError(true);
          } else if (fetchedData) {
            setGameData(fetchedData);
            navigate("/game");
          } else {
            setErrorText("Error loading game.");
            setOpenError(true);
          }
        }
      } else {
        console.log("Proceeding without data.");
        navigate("/game");
      }
    }
  };

  return (
    <div className={styles.root}>
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
      <img className={styles.logo} alt="Connect 4 logo" src="src/assets/logo-removebg-preview.png" />

      <div className={styles.card}>
        <CustomGameIDTextField
          inputRef={gameIDRef}
          helperText="Enter your game ID here"
          label="Game ID"
          id="custom-css-outlined-input"
          action={handleStartGame}
        />
        <CustomButton
          sx={{
            width: "100%",
            marginBottom: "20px",
          }}
          label="Start Game"
          onClick={handleStartGame}
        />
        <Instructions label="Instructions and Rules" />
      </div>
    </div>
  );
}

export default App;
