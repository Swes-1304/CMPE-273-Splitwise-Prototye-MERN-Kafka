import axios from 'axios';
import { GET_GRPEXPENSES, GET_GRPSUMMARIES, ERRORS } from './types';
import backendServer from '../webConfig';

export const getgrpExpenses = (gpname) => (dispatch) => {
  const token = localStorage.getItem('token');
  axios
    .get(`${backendServer}/getgrpexpenses/${gpname}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'content-type': 'application/json',
      },
    })
    .then((response) => {
      if (response.status === 200) {
        return dispatch({
          type: GET_GRPEXPENSES,
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

export const getgrpsummaryExpenses = (gpname) => (dispatch) => {
  const token = localStorage.getItem('token');
  axios
    .get(`${backendServer}/getsummaryexpenses/${gpname}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'content-type': 'application/json',
      },
    })
    .then((response) => {
      if (response.status === 200) {
        return dispatch({
          type: GET_GRPSUMMARIES,
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
