import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const FilterSelect = ({
  value,
  onChange = () => {},
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
     <InputLabel size="small">{label}</InputLabel>
      <Select
        labelId={"FilterSelect-" + id + "-label"}
        value={value}
        label={label}
        onChange={onChange}
        variant={variant}
        error={error}
        style={{ width }}
        size="small"
        {...props}
      > 
      <MenuItem  style={{ justifyContent: "start" }} value={""}> All </MenuItem>
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

export default FilterSelect;
