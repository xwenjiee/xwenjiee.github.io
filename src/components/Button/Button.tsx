import Button from "@mui/material/Button";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import styles from "./Button.module.css";

type CustomButtonProps = {
  label: string;
  primary?: boolean;
  onClick?: () => void;
  to?: string;
  startIcon?: React.ReactNode;
};

const CustomButton: React.FC<CustomButtonProps> = ({ label, primary = false, onClick, to, startIcon }) => (
  <button type="button" className={`${styles.pushable}`}>
    <Button
      variant="contained"
      disableElevation
      className={`${styles.front} ${primary ? styles.primary : ""}`}
      onClick={onClick}
      {...(to ? { to } : {})}
      component={to ? Link : "button"}
      startIcon={startIcon}
    >
      {label}
    </Button>
  </button>
);

CustomButton.propTypes = {
  label: PropTypes.string.isRequired,
  primary: PropTypes.bool,
  onClick: PropTypes.func,
  to: PropTypes.string,
  startIcon: PropTypes.node,
};

export default CustomButton;
