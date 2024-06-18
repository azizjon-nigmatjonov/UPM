import "./style.scss";
import { ReactComponent as CompanyLogo } from "../../assets/icons/login-logo.svg";
import {
  Button,
  Card,
  CircularProgress,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { AccountCircle, LocalPhone, Lock } from "@mui/icons-material";
import FTextField from "../../components/FormElements/FTextField";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { loginAction } from "../../redux/thunks/auth.thunk";
import FPasswordField from "../../components/FormElements/FPasswordField";
import { Link } from "react-router-dom";
import { useState } from "react";

const validationSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
});

const LoginPage = () => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const onSubmit = (values) => {
    setLoading(true);

    dispatch(loginAction(values))
      .unwrap()
      .catch(() => setLoading(false));
  };

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema,
    onSubmit,
  });

  return (
    <div className="LoginPage">
      <div className="logo-side">
        <CompanyLogo />
      </div>
      <form onSubmit={formik.handleSubmit} className="form-side">
        <div></div>
        <Card elevation={10} className="form-card">
          <div className="form-card-title silver-bottom-border">
            Log in to the system
          </div>
          <div onSubmit={formik.handleSubmit} className="form">
            <div className="form-row">
              <p className="label">Username</p>
              <FTextField
                placeholder="Enter the username or email"
                fullWidth
                size="medium"
                formik={formik}
                name="username"
                autoFocus
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircle style={{ fontSize: 28 }} />
                    </InputAdornment>
                  ),
                }}
              />
            </div>

            <div className="form-row">
              <p className="label">Password</p>
              <FPasswordField
                placeholder="Enter the password"
                fullWidth
                size="medium"
                formik={formik}
                name="password"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock style={{ fontSize: 28 }} />
                    </InputAdornment>
                  ),
                }}
              />
            </div>

            <Link to="/reset-password" className="forget-link">
              Forget password ?
            </Link>
          </div>

          <div className="btn-area">
            <Button
              className="login-btn"
              variant="contained"
              fullWidth
              size="large"
              type="submit"
              endIcon={
                loading && (
                  <CircularProgress size={16} style={{ color: "#fff" }} />
                )
              }
            >
              Login
            </Button>
          </div>
        </Card>

        <Card className="extra-card">
          <div className="side">
            <IconButton color="primary">
              <LocalPhone />
            </IconButton>
            <p className="title">Служба поддержки</p>
          </div>
          <div className="side">
            <div className="value">+998 (90) 123-45-67</div>
          </div>
        </Card>
      </form>
    </div>
  );
};

export default LoginPage;
