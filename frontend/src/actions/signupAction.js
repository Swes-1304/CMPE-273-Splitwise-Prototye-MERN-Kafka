import axios from 'axios';
import { USER_SIGNUP } from './types';
import backendServer from '../webConfig';

export const userSignup = (signupData, redirectOnSuccess) => (dispatch) => {
  axios.defaults.withCredentials = true;
  axios
    .post(`${backendServer}/signup`, signupData)
    .then((response) => {
      dispatch({
        type: USER_SIGNUP,
        payload: response.data,
      });
      redirectOnSuccess();
    })
    .catch((error) => {
      if (error.response && error.response.data) {
        return dispatch({
          type: USER_SIGNUP,
          payload: error.response.data,
        });
      }
      return 'error!';
    });
};

export default userSignup;
