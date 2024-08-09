import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import clsx from "clsx";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import styles from "./Button.module.css";

type CustomButtonProps = {
  label: string;
  primary?: boolean;
  help?: boolean;
  onClick?: () => void;
  to?: string;
  startIcon?: React.ReactNode;
};

const CustomButton: React.FC<CustomButtonProps> = ({
  label,
  primary = false,
  help = false,
  onClick,
  to,
  startIcon,
}) => (
  <button type="button" className={clsx(styles.pushable, { [styles.helpPushable]: help })}>
    {label ? (
      <Button
        variant="contained"
        disableElevation
        className={clsx(styles.front, { [styles.primary]: primary }, { [styles.help]: help })}
        onClick={onClick}
        {...(to ? { to } : {})}
        component={to ? Link : "button"}
        startIcon={startIcon}
      >
        {label}
      </Button>
    ) : (
      <IconButton
        className={clsx(styles.front, { [styles.primary]: primary }, { [styles.help]: help })}
        onClick={onClick}
      >
        {startIcon}
      </IconButton>
    )}
  </button>
);

CustomButton.propTypes = {
  label: PropTypes.string.isRequired,
  primary: PropTypes.bool,
  help: PropTypes.bool,
  onClick: PropTypes.func,
  to: PropTypes.string,
  startIcon: PropTypes.node,
};

export default CustomButton;
