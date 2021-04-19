import { USER_LOGIN, USER_LOGOUT, USER_SIGNUP, ERRORS } from '../actions/types';

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
    default:
      return state;
  }
}
