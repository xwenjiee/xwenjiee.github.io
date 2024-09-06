import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { StyledEngineProvider } from "@mui/material/styles";
import clsx from "clsx";
import PropTypes from "prop-types";
import React, { CSSProperties } from "react";
import { Link } from "react-router-dom";
import styles from "./Button.module.css";

type CustomButtonProps = {
  label: string;
  save?: boolean;
  help?: boolean;
  onClick?: () => void;
  to?: string;
  startIcon?: React.ReactElement;
  sx?: CSSProperties;
};

const CustomButton: React.FC<CustomButtonProps> = ({
  label,
  save = false,
  help = false,
  onClick,
  to,
  startIcon,
  sx,
}) => (
  <StyledEngineProvider injectFirst>
    <div className={clsx(styles.pushable, { [styles.helpPushable]: help }, { [styles.savePushable]: save })} style={sx}>
      {label ? (
        <Button
          variant="contained"
          disableElevation
          className={clsx(styles.front, { [styles.save]: save }, { [styles.help]: help })}
          onClick={onClick}
          {...(to ? { to } : {})}
          component={to ? Link : "button"}
          startIcon={startIcon ? React.cloneElement(startIcon, { className: styles.icon }) : null}
        >
          {label}
        </Button>
      ) : (
        <IconButton
          className={clsx(styles.front, styles.iconButton, { [styles.save]: save }, { [styles.help]: help })}
          onClick={onClick}
        >
          {startIcon ? React.cloneElement(startIcon, { className: styles.icon }) : null}
        </IconButton>
      )}
    </div>
  </StyledEngineProvider>
);

CustomButton.propTypes = {
  label: PropTypes.string.isRequired,
  save: PropTypes.bool,
  help: PropTypes.bool,
  onClick: PropTypes.func,
  to: PropTypes.string,
  startIcon: PropTypes.element,
  sx: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.func]),
};

export default CustomButton;
