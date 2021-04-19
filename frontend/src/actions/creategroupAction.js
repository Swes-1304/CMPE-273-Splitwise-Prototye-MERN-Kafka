import axios from 'axios';
import { CREATE_GROUP, ERRORS, RESET_ERRORS } from './types';
import backendServer from '../webConfig';

export const createGroup = (creategrpData) => (dispatch) => {
  const token = localStorage.getItem('token');
  axios
    .post(`${backendServer}/createnewgroup`, creategrpData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'content-type': 'application/json',
      },
    })
    .then((response) => {
      if (response.status === 200) {
        return dispatch({
          type: CREATE_GROUP,
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
