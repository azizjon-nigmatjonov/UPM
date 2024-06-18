import { lazy } from "react"

const LoginPage = lazy(() => import( "../views/Login"))
const ForgetPasswordpage = lazy(() => import("../views/Login/ForgetPasswordPage"))


export const authRoutes = [
  {
    path: "/login",
    component: LoginPage
  },
  {
    path: "/reset-password",
    component: ForgetPasswordpage
  }
]