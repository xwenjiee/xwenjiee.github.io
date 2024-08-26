import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import PropTypes from "prop-types";
import CustomButton from "./Button";
import styles from "./Confirmation.module.css";

type ConfirmationProps = {
  open: boolean;
  close: () => void;
  confirmationText: string;
  to?: string;
  action?: () => void;
};

const Confirmation: React.FC<ConfirmationProps> = ({ open, close, confirmationText, to, action }) => (
    <Modal open={open} onClose={close} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <Box className={styles.confirmationModal}>
        <h1 className={styles.confirmationTitle}>Are you sure?</h1>
        <div className={styles.confirmationText}>{confirmationText}</div>

        <div className={styles.modalButtonsContainer}>
          <CustomButton label="Confirm" to={to} onClick={action} />
          <CustomButton label="Cancel" onClick={close} />
        </div>
      </Box>
    </Modal>
  );

Confirmation.propTypes = {
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  confirmationText: PropTypes.string.isRequired,
  to: PropTypes.string,
  action: PropTypes.func,
};

export default Confirmation;
