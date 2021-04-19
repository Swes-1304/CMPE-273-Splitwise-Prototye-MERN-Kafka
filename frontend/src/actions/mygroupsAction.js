import axios from 'axios';
import { GET_GROUPS, GET_GROUPINVITES, ERRORS } from './types';
import backendServer from '../webConfig';

export const getGroups = () => (dispatch) => {
  const token = localStorage.getItem('token');
  axios
    .get(`${backendServer}/getuserpgroups`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'content-type': 'application/json',
      },
    })
    .then((response) => {
      if (response.status === 200) {
        return dispatch({
          type: GET_GROUPS,
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

export const getGroupInvites = () => (dispatch) => {
  const token = localStorage.getItem('token');
  axios
    .get(`${backendServer}/getpgroupinvites`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'content-type': 'application/json',
      },
    })
    .then((response) => {
      if (response.status === 200) {
        return dispatch({
          type: GET_GROUPINVITES,
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
