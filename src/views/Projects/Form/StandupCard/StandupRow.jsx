import { useFormik } from "formik";
import { Switch } from "@mui/material";
import projectService from "../../../../services/projectService";
import { styled } from '@mui/material/styles';
import FormControlLabel from '@mui/material/FormControlLabel';

const StandupRow = ({ standup }) => {
  const formik = useFormik({
    initialValues: {
      ...standup,
      required: standup.required ? true : false,
    },
  });

  const IOSSwitch = styled((props) => (
    <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
  ))(({ theme }) => ({
    width: 36,
    height: 20,
    padding: 0,
    '& .MuiSwitch-switchBase': {
      padding: 0,
      margin: 2,
      transitionDuration: '300ms',
      '&.Mui-checked': {
        transform: 'translateX(16px)',
        color: '#fff',
        '& + .MuiSwitch-track': {
          backgroundColor: theme.palette.mode === 'dark' ? '#0E73F6' : '#0E73F6',
          opacity: 1,
          border: 0,
        },
        '&.Mui-disabled + .MuiSwitch-track': {
          opacity: 0.5,
        },
      },
      '&.Mui-focusVisible .MuiSwitch-thumb': {
        color: '#33cf4d',
        border: '6px solid #fff',
      },
      '&.Mui-disabled .MuiSwitch-thumb': {
        color:
          theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[600],
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
      },
    },
    '& .MuiSwitch-thumb': {
      boxSizing: 'border-box',
      width: 16,
      height: 16,
    },
    '& .MuiSwitch-track': {
      borderRadius: 26 / 2,
      backgroundColor: theme.palette.mode === 'light' ? '#888' : '#39393D',
      opacity: 1,
      transition: theme.transitions.create(['background-color'], {
        duration: 500,
      }),
    },
  }));
  
  const update = (val) => {
    projectService
      .updateStandup({
        id: formik?.values?.id,
        role_id: formik?.values?.role_id,
        required: val,
      })
      .then((res) => {
        console.log("res", res);
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  return (
    <div className="GroupRow row">
      <div className="title-block">{standup?.title}</div>
      {/* <Switch
      control={<IOSSwitch sx={{ m: 1 }} defaultChecked />}
        checked={formik?.values?.required}
        onChange={(e) => {
          formik.setFieldValue("required", e.target.checked);
          update(e?.target?.checked);
        }}
      /> */}
      <FormControlLabel
        control={<IOSSwitch sx={{ m: 1 }} defaultChecked />}
        label=""
        checked={formik?.values?.required}
        onChange={(e) => {
          formik.setFieldValue("required", e.target.checked);
          update(e?.target?.checked);
        }}
      />
    </div>
  );
};

export default StandupRow;
