import {
  USER_LOGIN,
  USER_SIGNUP,
  ERRORS,
  RESET_ERRORS,
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
    case UPDATE_PROFILE:
      return {
        ...state,
        user: action.payload,
        error: null,
      };
    case RESET_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
}
