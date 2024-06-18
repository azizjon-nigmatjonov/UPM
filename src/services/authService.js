



import requestAuth from "../utils/requestAuth";

const authService = {
  login: (data) => requestAuth.post(`/login`, data),
  sendResetMessageToEmail: (data) => requestAuth.post(`/user/send-message`, data),
  resetPassword: (data) => requestAuth.put(`/user/reset-password`, data),
  refreshToken: (data) => requestAuth.put(`/refresh`, data),
  logout: (data) => requestAuth.delete(`/logout`, {data}),
  logoutById: (userId) => requestAuth.delete(`/logout/${userId}`),
}

export default authService


