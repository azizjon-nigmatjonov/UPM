import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const CSelect = ({
  value,
  onChange = () => {},
  all = false,
  width,
  style,
  label,
  options,
  id,
  variant,
  required,
  error,
  helperText,
  customColor = false,
  ...props
}) => {
  return (
    <FormControl fullWidth style={style}>
      <InputLabel
        required={required}
        size="small"
        id={"CSelect-" + id + "-label"}
      >
        {label}
      </InputLabel>
      <Select
        labelId={"CSelect-" + id + "-label"}
        value={value}
        label={label}
        onChange={onChange}
        variant={variant}
        error={error}
        style={{ width }}
        size="small"
        {...props}
      >
        {all && <MenuItem style={{justifyContent: "start"}} value={""}> All </MenuItem>}
        {options?.map((option, index) => (
          <MenuItem
            sx={
              customColor && {
                color: option.color,
                fontWeight: "bold",
              }
            }
            style={{ justifyContent: "start" }}
            key={index}
            value={option.value}
          >
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default CSelect;
