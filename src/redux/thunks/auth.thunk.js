import { createAsyncThunk } from "@reduxjs/toolkit"
import authService from "../../services/authService"
import { authActions } from "../slices/auth.slice"
import { showAlert } from "./alert.thunk"

export const loginAction = createAsyncThunk(
  'auth/login',
  async (data, { dispatch }) => {

    try {
      
      const res = await authService.login(data)
      dispatch(authActions.loginSuccess(res))

    } catch (error) {
      throw new Error(error)
      // dispatch(showAlert('Username or password is incorrect'))
    }

  }
)
export const logoutAction = createAsyncThunk(
  'auth/logout',
  async (data, { dispatch }) => {

    try {
      
      const res = await authService.logout(data)
      dispatch(authActions.logout(res))

    } catch (error) {
      throw new Error(error)
      // dispatch(showAlert('Username or password is incorrect'))
    }

  }
)
export const logoutByIdAction = createAsyncThunk(
  'auth/logout',
  async (data, { dispatch }) => {

    try {
      
      const res = await authService.logoutById(data)
      dispatch(authActions.logout(res))

    } catch (error) {
      throw new Error(error)
      // dispatch(showAlert('Username or password is incorrect'))
    }

  }
)

export const sendMessageToEmailAction = createAsyncThunk(
  'auth/sendMessageToEmail',
  async (data, { dispatch }) => {
    try {
      
      const res = await authService.sendResetMessageToEmail(data)

      dispatch(showAlert(`The message was sent to email: ${data.email}`, 'success'))


      return res

    } catch (error) {
      throw new Error(error)
    }
  }
)

export const resetPasswordAction = createAsyncThunk(
  'auth/resetPassword',
  async (data, { dispatch }) => {
    try {
      
      const res = await authService.resetPassword(data)

      dispatch(authActions.loginSuccess(res))

      return res

    } catch (error) {
      throw new Error(error)
    }
  }
)