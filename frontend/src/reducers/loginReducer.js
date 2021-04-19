import {
  USER_LOGIN,
  USER_LOGOUT,
  USER_SIGNUP,
  ERRORS,
  RESET,
  UPDATE_PROFILE,
} from '../actions/types';

const initialState = {
  islogged: 'false',
  user: {},
  error: null,
};

export default function loginReducer(state = initialState, action) {
  switch (action.type) {
    /* case EMAIL_CHANGE:
      return {
        ...state,
        email: action.payload,
      }; */
    case USER_SIGNUP:
      return {
        ...state,
        islogged: 'true',
        user: action.payload,
        error: null,
      };
    case USER_LOGIN:
      return {
        ...state,
        islogged: 'true',
        user: action.payload,
        error: null,
      };
    case ERRORS:
      return {
        ...state,
        error: action.payload,
      };
    case USER_LOGOUT:
      return {
        islogged: 'false',
        user: {},
        error: null,
      };
    case UPDATE_PROFILE:
      return {
        ...state,
        user: action.payload,
        error: null,
      };
    case RESET:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
}
