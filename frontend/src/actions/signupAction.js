import axios from 'axios';
import { USER_SIGNUP, ERRORS } from './types';
import backendServer from '../webConfig';

export const userSignup = (signupData) => (dispatch) => {
  axios.defaults.withCredentials = true;
  axios
    .post(`${backendServer}/signup`, signupData)
    .then((response) => {
      if (response.status === 200) {
        dispatch({
          type: USER_SIGNUP,
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

export default userSignup;