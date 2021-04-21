import axios from 'axios';
import { RECENT_ACTIVITIES, ERRORS, RESET_ERRORS } from './types';
import backendServer from '../webConfig';

export const recentActivities = () => (dispatch) => {
  const token = localStorage.getItem('token');

  axios
    .get(`${backendServer}/getrecentacitvities`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'content-type': 'application/json',
      },
    })
    .then((response) => {
      if (response.status === 200) {
        return dispatch({
          type: RECENT_ACTIVITIES,
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
export const reset = () => (dispatch) => dispatch({ type: RESET_ERRORS });
