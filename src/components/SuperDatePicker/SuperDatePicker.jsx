import { DatePicker, LocalizationProvider } from "@mui/lab";
import { enGB } from "date-fns/locale";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { Box } from "@mui/material";
import cls from "./styles.module.scss";

const SuperDatePicker = ({ value, onChange }) => {
  return (
    <LocalizationProvider locale={enGB} dateAdapter={AdapterDateFns}>
      <DatePicker
        inputFormat="dd-MM-yyyy"
        mask="__.__.____"
        toolbarFormat="dd-MM-yyyy"
        value={value}
        onChange={onChange}
        renderInput={({ inputRef, inputProps, InputProps }) => (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#eaecf0",
              padding: "8px 16px 8px 0",
              borderRadius: "4px",
            }}
          >
            <input
              ref={inputRef}
              {...inputProps}
              className={cls.datepickerInput}
            />
            {InputProps?.endAdornment}
          </Box>
        )}
      />
    </LocalizationProvider>
  );
};

export default SuperDatePicker;
