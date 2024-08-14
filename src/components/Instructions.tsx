import "../pages/App.module.css";
import CloseIcon from "@mui/icons-material/Close";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Modal from "@mui/material/Modal";
import * as React from "react";
import CustomButton from "./Button";
import styles from "./Instructions.module.css";

function Instructions({ label }: { label: string }) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <CustomButton label={label} help onClick={handleOpen} startIcon={<QuestionMarkIcon />} />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className={styles.instructionsModal}>
          <IconButton className={styles.closeIcon} onClick={handleClose}>
            <CloseIcon />
          </IconButton>
          <div className={styles.myScroll}>
            <div className={styles.padded}>
              <h1 className={styles.instructionsTitle}>Connect 4 Game Instructions and Rules</h1>
              <img className={styles.instructionsGif} alt="gif of placing tokens" src="src\assets\placing-tokens.gif" />

              <h2 className={styles.instructionsSection}>Objective</h2>
              <p>
                The objective of Connect 4 is to be the first player to form a horizontal, vertical, or diagonal line of
                four of your own discs.
              </p>
              <h2 className={styles.instructionsSection}>How to Play</h2>
              <ul>
                <li>
                  <strong>Start the Game:</strong> The game is played on a grid with 6 rows and 7 columns.
                </li>
                <li>
                  <strong>Take Turns:</strong> You will take turns with the computer dropping one of your colored discs
                  from the top into any of the columns.
                  <ul>
                    <li>
                      <strong>You</strong> use red discs. 🔴
                    </li>
                    <li>
                      <strong>Computer</strong> uses yellow discs. 🟡
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>Dropping a Disc:</strong> Click on a column to drop your disc into that column. The disc will
                  fall to the lowest available space within the column. The computer will automatically make its move
                  after yours.
                </li>
                <li>
                  <strong>Winning the Game:</strong> To win, be the first to connect four of your discs in a row. This
                  can be done:
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
              <h2 className={styles.instructionsSection}>Rules</h2>
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
                  <strong>End of Game:</strong> The game ends when either you or the computer connects four of their
                  discs in a row or when all columns are full, resulting in a draw.
                </li>
              </ul>
              <h2 className={styles.instructionsSection}>Tips</h2>
              <ul>
                <li>Plan ahead and try to anticipate the computer&rsquo;s moves.</li>
                <li>Control the center of the board to increase your chances of forming a connection.</li>
                <li>Be mindful of potential vertical, horizontal, and diagonal connections.</li>
              </ul>
              <div className={styles.instructionsSection}>Good luck and have fun! 😀</div>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
}

export default Instructions;
