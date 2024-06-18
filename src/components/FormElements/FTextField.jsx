import { TextField } from "@mui/material";
import { get } from "lodash-es";
import { useMemo } from "react";

const FTextField = ({ formik, name, disabledHelperText = false, fullWidth = false, ...props }) => {
  const computedHelperText = useMemo(() => {
    if (disabledHelperText) return null;
    return (get(formik.touched, name) && get(formik.errors, name)) ?? " ";
  }, [formik.touched, formik.errors]);

  return (
    <TextField
      size="small"
      fullWidth={fullWidth}
      value={get(formik.values, name)}
      name={name}
      onChange={formik.handleChange}
      error={get(formik.touched, name) && Boolean(get(formik.errors, name))}
      helperText={computedHelperText}
      onKeyDown={(evt) =>
        ["-", "+", ","].includes(evt.key) && evt.preventDefault()
      }
      {...props}
    />
  );
};

export default FTextField;
