


import axios from "axios";
import { store } from "../redux/store";
import { showAlert } from "../redux/thunks/alert.thunk";

export const baseURL = process.env.REACT_APP_CDN_API_URL

const requestCDN = axios.create({
  baseURL,
  timeout: 100000,
})

const errorHandler = (error, hooks) => {
  if (error?.response) {
    if(error.response?.data?.data) {
      store.dispatch(showAlert(error.response.data.data))
    }

    if (error?.response?.status === 403) {

    }
    else if ( error?.response?.status === 401) {
      // store.dispatch(logout())
    }
  }

  else store.dispatch(showAlert('___ERROR___'))

  return Promise.reject(error.response)
}

requestCDN.interceptors.request.use(
  config => {
    const token = store.getState().auth.token
    if(token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },

  error => errorHandler(error)
)

requestCDN.interceptors.response.use(response => response.data.data , errorHandler)

export default requestCDN
