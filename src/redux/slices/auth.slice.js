import { createSlice } from '@reduxjs/toolkit'
import { listToMap } from '../../utils/listToMap'

const initialState = {
  isAuth: false,
  token: null,
  refreshToken: null,
  userInfo: null,
  roleInfo: null,
  permissions: {}
}

export const {
  actions: authActions,
  reducer: authReducer 
} = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess(state, {payload}) {
      state.isAuth = true
      state.token = payload.token.access_token
      state.refreshToken = payload.token.refresh_token
      state.userInfo = payload.user
      state.roleInfo = payload.role


      state.permissions = listToMap(payload.permissions?.map(el => ({...el, name: el.name?.replace('ROOT/', '')})), "name")
      state.loading = false
    },
    setTokens(state, { payload }) {
      state.token = payload.token.access_token
      state.refreshToken = payload.token.refresh_token
    },
    logout: (state) => initialState,
  }
})
