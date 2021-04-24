import axios from 'axios';
import { UPDATE_PROFILE, ERRORS } from './types';
import backendServer from '../webConfig';

export const updateProfile = (updateData) => (dispatch) => {
  const token = localStorage.getItem('token');
  axios
    .post(`${backendServer}/updateprofile`, updateData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'content-type': 'application/json',
      },
    })
    .then((response) => {
      if (response.status === 200) {
        localStorage.setItem('profilepic', response.data.profilepic);
        localStorage.setItem('username', response.data.username);
        return dispatch({
          type: UPDATE_PROFILE,
          payload: response.data,
        });
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

export default updateProfile;
