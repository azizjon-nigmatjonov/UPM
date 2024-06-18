import axios from "axios";
import { authActions } from "../redux/slices/auth.slice";
import { store } from "../redux/store";
import { showAlert } from "../redux/thunks/alert.thunk";
import { logoutAction } from "../redux/thunks/auth.thunk";
import Auth from "../services/authService";
export const baseURL = process.env.REACT_APP_BASE_URL;

const request = axios.create({
  baseURL,
  timeout: 100000,
});

const errorHandler = (error, hooks) => {
  const token = store.getState().auth.token;
  const logoutParams = {
    access_token: token,
  };

  if (error?.response?.status === 401) {
    const refreshToken = store.getState().auth.refreshToken;

    const params = {
      refresh_token: refreshToken,
    };

    const originalRequest = error.config;

    return Auth.refreshToken(params)
      .then((res) => {
        store.dispatch(authActions.setTokens(res));
        return request(originalRequest);
      })
      .catch((err) => {
        console.log(err);
        return Promise.reject(error);
      });
  } else {
    if (error?.response) {
      if (error.response?.data?.data) {
        if (
          error.response.data.data !==
          ("rpc error: code = Internal desc = member group is required to add new member" &&
            "rpc error: code = Internal desc = workload not found with given id" &&
            "rpc error: code = Internal desc = NOT_FOUND")
        ) {
          store.dispatch(showAlert(error.response.data.data));
        }
      }
      if (error?.response?.status === 403) {
        store.dispatch(logoutAction(logoutParams)).unwrap().catch();
      }
    } else store.dispatch(showAlert("___ERROR___"));

    return Promise.reject(error.response);
  }
};

request.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },

  (error) => errorHandler(error)
);

request.interceptors.response.use(
  (response) => response.data.data,
  errorHandler
);

export default request;
