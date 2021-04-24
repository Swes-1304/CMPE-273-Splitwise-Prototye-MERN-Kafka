import axios from 'axios';
import { USER_SIGNUP, ERRORS } from './types';
import backendServer from '../webConfig';

export const userSignup = (signupData) => (dispatch) => {
  axios.defaults.withCredentials = true;
  axios
    .post(`${backendServer}/signup`, signupData)
    .then((response) => {
      if (response.status === 200) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('profilepic', response.data.profilepic);
        localStorage.setItem('username', response.data.username);
        localStorage.setItem('defaultcurr', response.data.currencydef);
        localStorage.setItem('email', response.data.email);
        return dispatch({
          type: USER_SIGNUP,
          payload: response.data,
        });
        // return localStorage.setItem('token', response.data.token);
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
