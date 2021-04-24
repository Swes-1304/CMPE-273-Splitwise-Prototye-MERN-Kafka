import axios from 'axios';
import { GET_BALANCES, ERRORS, RESET_ERRORS } from './types';
import backendServer from '../webConfig';

export const totalBalances = () => (dispatch) => {
  const token = localStorage.getItem('token');
  console.log(' inside action of dashboad');
  axios
    .get(`${backendServer}/gettotalbalances`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'content-type': 'application/json',
      },
    })
    .then((response) => {
      console.log(' inside action of dashboad response');
      if (response.status === 200) {
        console.log(' inside if actoin ');
        return dispatch({
          type: GET_BALANCES,
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
