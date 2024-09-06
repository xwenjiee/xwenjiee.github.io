import { Clear } from "@mui/icons-material";
import { IconButton, InputAdornment } from "@mui/material";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
import React, { ChangeEvent, useState } from "react";

const GameIDTextField = styled(TextField)({
  width: "100%",

  "& label.Mui-focused": {
    color: "#FFFFFF",
  },
  "& label": {
    color: "#cccccc",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#cccccc",
    },
    "&:hover fieldset": {
      borderColor: "#FFFFFF",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#FFFFFF",
    },
  },
  "& .MuiFormHelperText-root": {
    color: "#cccccc",
    marginLeft: 0,
    marginBottom: "15px",
  },

  "& .MuiInputBase-input": {
    color: "#cccccc",
  },
});

const CustomGameIDTextField: React.FC<{
  helperText: string;
  label: string;
  id: string;
  inputRef?: React.Ref<HTMLInputElement>;
  action: () => void;
}> = ({ helperText, label, id, inputRef, action }) => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === " ") {
      event.preventDefault();
    }
    if (event.key === "Enter") {
      action();
    }
  };
  const clear = () => {
    setInputValue("");
    if (inputRef && "current" in inputRef && inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  return (
    <GameIDTextField
      helperText={helperText}
      label={label}
      id={id}
      variant="outlined"
      inputRef={inputRef}
      value={inputValue}
      onKeyDown={handleKeyPress}
      onChange={handleInputChange}
      InputProps={{
        endAdornment: inputValue && (
          <InputAdornment position="end">
            <IconButton sx={{ padding: "0" }} onClick={clear}>
              <Clear sx={{ color: "red" }} />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default CustomGameIDTextField;
