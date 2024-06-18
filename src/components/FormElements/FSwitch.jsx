import { Switch } from "@mui/material";
import { get } from "lodash-es";

const FSwitch = ({
  formik,
  name,
  label,
  labelProps,
  containerStyle,
  ...props
}) => {
  return (
    <div style={{ ...containerStyle }}>
      <Switch
        id={`switch`}
        checked={get(formik?.values, name)}
        onChange={(e, val) => formik.setFieldValue(name, val)}
        {...props}
      />
      <label htmlFor={`switch`} {...labelProps}>
        {label}
      </label>
    </div>
  );
};

export default FSwitch;
