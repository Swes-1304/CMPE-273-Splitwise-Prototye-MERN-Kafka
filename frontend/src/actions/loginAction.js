import axios from 'axios';
import { USER_LOGIN, USER_LOGOUT, ERRORS, RESET } from './types';
import backendServer from '../webConfig';

export const userLogin = (loginData) => (dispatch) => {
  axios.defaults.withCredentials = true;
  axios
    .post(`${backendServer}/login`, loginData)
    .then((response) => {
      if (response.status === 200) {
        dispatch({
          type: USER_LOGIN,
          payload: response.data,
        });
        return localStorage.setItem('token', response.data.token);
      }
      return dispatch({
        type: ERRORS,
        payload: response.data,
      });
    })
    .catch((error) => {
      if (error.response && error.response.data) {
        return dispatch({
          type: ERRORS,
          payload: error.response.data,
        });
      }
      return 'error!';
    });
};

/* export const emailChange = (email) => (dispatch) =>
  dispatch({
    type: EMAIL_CHANGE,
    payload: email,
  }); */

export const userLogout = () => (dispatch) => dispatch({ type: USER_LOGOUT });

export const reset = () => (dispatch) => dispatch({ type: RESET });
