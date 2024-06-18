import {
  Button,
  IconButton,
  InputAdornment,
  OutlinedInput,
  TextField,
} from "@mui/material";
import React from "react";
import cls from "./style.module.scss";
import SaveIcon from "@mui/icons-material/Save";

const ClickAwayInput = ({
  editing = false,
  onClickAway,
  title,
  onInputChange,
  value = "google.com",
  handleEditing,
}) => {
  return (
    <div className={cls.clickAwayInputWrapper}>
      <div className={cls.title} onClick={() => handleEditing()}>
        {editing ? (
          <OutlinedInput
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                onClickAway();
              }
            }}
            size="small"
            fullWidth
            type="text"
            onChange={onInputChange}
            defaultValue={value}
            autoFocus
            onBlur={onClickAway}
            placeholder="description"
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={onClickAway}
                  color="primary"
                  aria-label="toggle password visibility"
                  edge="end"
                >
                  <SaveIcon />
                </IconButton>
              </InputAdornment>
            }
          />
        ) : (
          <div className={cls.link}>
            {value ? (
              <a
                href={`https://www.${value}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {value}
              </a>
            ) : (
              <span className={cls.placeholder}>Add link</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClickAwayInput;
