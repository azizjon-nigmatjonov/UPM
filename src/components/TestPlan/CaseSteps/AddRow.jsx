import SaveIcon from "@mui/icons-material/Save";
import { IconButton, InputAdornment, OutlinedInput } from "@mui/material";
import React, { useState } from "react";
import "./style.scss";
export default function AddRow({ title, onCreate }) {
  const [value, setValue] = useState("");

  return (
    <form className="AddRow">
      <p className="add-row-title">{title}</p>
      <div className="field-row">
        <OutlinedInput
          size="small"
          fullWidth
          placeholder="Enter name"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              if (Boolean(event.target.value.trim())) {
                onCreate(value);
              }
              setValue("");
            }
          }}
          endAdornment={
            <InputAdornment position="end">
              {value ? (
                <IconButton
                  onClick={(e) => {
                    e.preventDefault();
                    onCreate(value);
                    setValue("");
                  }}
                  aria-label="toggle password visibility"
                  edge="end"
                  color="primary"
                >
                  <SaveIcon />
                </IconButton>
              ) : (
                ""
              )}
            </InputAdornment>
          }
        />
      </div>
    </form>
  );
}
