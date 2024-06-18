import "./style.scss"
import { ReactComponent as CompanyLogo } from "../../assets/icons/login-logo.svg"
import {
  Button,
  Card,
  CircularProgress,
  IconButton,
  InputAdornment,
} from "@mui/material"
import { AlternateEmail, LocalPhone, Lock } from "@mui/icons-material"
import FTextField from "../../components/FormElements/FTextField"
import { useFormik } from "formik"
import * as Yup from "yup"
import { useDispatch } from "react-redux"
import { resetPasswordAction, sendMessageToEmailAction } from "../../redux/thunks/auth.thunk"
import { useSearchParams } from "react-router-dom"
import { useMemo, useState } from "react"
import FPasswordField from "../../components/FormElements/FPasswordField"
import BackButton from "../../components/BackButton"

const emailValidation = Yup.object().shape({
  email: Yup.string()
    .required("Email is required")
    .email("Email is incorrect"),
})

const passwordValidation = Yup.object().shape({
  password: Yup.string()
    .required('Password is required')
    .min(6, "The password length must be at least 6")
})

const ForgetPasswordPage = () => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)

  const [search, setSearch] = useSearchParams()

  const token = useMemo(() => search.get("token"), [])
  
  const sendMessageToEmail = ({ email }) => {
    setLoading(true)
    const data = {
      base_url: window.location.href,
      email,
    }

    dispatch(sendMessageToEmailAction(data)).then(() => setLoading(false))
  }

  const resetPassword = ({ password }) => {
    setLoading(true)
    const data = {
      password,
      token
    }

    dispatch(resetPasswordAction(data)).unwrap().catch(() => setLoading(false))

  }

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: token ? passwordValidation : emailValidation,
    onSubmit: token ? resetPassword : sendMessageToEmail,
  })
  
  return (
    <div className="LoginPage">
      <div className="logo-side">
        <CompanyLogo />
      </div>
      <form onSubmit={formik.handleSubmit} className="form-side">
        <div></div>
        <Card elevation={10} className="form-card">
          <div className="form-card-title silver-bottom-border">
            <BackButton link={"/login"} />
            Reset password
          </div>
          <div onSubmit={formik.handleSubmit} className="form">
            {!token ? (
              <div className="form-row">
                <p className="label">Email</p>
                <FTextField
                  placeholder="Enter the email"
                  fullWidth
                  size="medium"
                  formik={formik}
                  autoFocus
                  name="email"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AlternateEmail style={{ fontSize: 28 }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
            ) : (
              <div className="form-row">
                <p className="label">New password</p>
                <FPasswordField
                  placeholder="Enter a new password"
                  fullWidth
                  size="medium"
                  formik={formik}
                  autoFocus
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
            )}
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
              {
                token ? "Change password" : "Send message"
              }
            </Button>
          </div>
        </Card>

        <Card className="extra-card">
          <div className="side">
            <IconButton color="primary">
              <LocalPhone />
            </IconButton>
            <p className="title">Support service</p>
          </div>
          <div className="side">
            <div className="value">+998 (90) 123-45-67</div>
          </div>
        </Card>
      </form>
    </div>
  )
}

export default ForgetPasswordPage
