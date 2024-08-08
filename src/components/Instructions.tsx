import "../pages/App.css";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import * as React from "react";

// const style = {
//     top: '50%',
//     left: '50%',
//     transform: 'translate(-50%, -50%)',
//     width: '50%',
//     bgcolor: 'background.paper',
//     border: '2px solid #000',
//     boxShadow: 24,
//     p: 4,
//     color: 'black',
//     overflow: "auto",
//     height: "70%",
//   };

// const div = ;

function Instructions() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button onClick={handleOpen}>Instructions and Rules</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="instructions-modal">
          <div className="close-icon-container">
            <Button className="close-icon" onClick={() => handleClose()}>
              X
            </Button>
          </div>
          <Typography sx={{ fontWeight: "bold" }} variant="h6" component="h2">
            <u>Connect 4 Game Instructions and Rules</u>
          </Typography>
          <Typography sx={{ padding: "5px" }}>
            <img className="instructions-gif" alt="gif of placing tokens" src="src\assets\placing-tokens.gif" />

            <p className="instructions-section">Objective</p>
            <p>
              The objective of Connect 4 is to be the first player to form a horizontal, vertical, or diagonal line of
              four of your own discs.
            </p>
            <p className="instructions-section">How to Play</p>
            <ul>
              <li>
                <strong>Start the Game:</strong> The game is played on a grid with 6 rows and 7 columns.
              </li>
              <li>
                <strong>Take Turns:</strong> You will take turns with the computer dropping one of your colored discs
                from the top into any of the columns.
                <ul>
                  <li>
                    <strong>You</strong> use red discs.
                  </li>
                  <li>
                    <strong>Computer</strong> uses yellow discs.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Dropping a Disc:</strong> Click on a column to drop your disc into that column. The disc will
                fall to the lowest available space within the column. The computer will automatically make its move
                after yours.
              </li>
              <li>
                <strong>Winning the Game:</strong> To win, be the first to connect four of your discs in a row. This can
                be done:
                <ul>
                  <li>Horizontally</li>
                  <li>Vertically</li>
                  <li>Diagonally</li>
                </ul>
              </li>
              <li>
                <strong>Draw:</strong> If all columns are filled with discs and no player has connected four in a row,
                the game ends in a draw.
              </li>
            </ul>
            <p className="instructions-section">Rules</p>
            <ul>
              <li>
                <strong>Alternating Turns:</strong> You and the computer alternate turns, and only one disc can be
                dropped per turn.
              </li>
              <li>
                <strong>Legal Moves:</strong> A move is only legal if it is made in an empty column. If a column is
                full, a disc cannot be placed in that column.
              </li>
              <li>
                <strong>End of Game:</strong> The game ends when either you or the computer connects four of their discs
                in a row or when all columns are full, resulting in a draw.
              </li>
            </ul>
            <p className="instructions-section">Tips</p>
            <div>
              <ul>
                <li>Plan ahead and try to anticipate the computer&rsquo;s moves.</li>
                <li>Control the center of the board to increase your chances of forming a connection.</li>
                <li>Be mindful of potential vertical, horizontal, and diagonal connections.</li>
              </ul>
              Good luck! :)
            </div>
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}

export default Instructions;
