import { CREATE_GROUP, RESET, ERRORS } from '../actions/types';

const initialState = {
  createSuccess: 0,
  groups: {},
  error: null,
};

export default function loginReducer(state = initialState, action) {
  switch (action.type) {
    /* case EMAIL_CHANGE:
        return {
          ...state,
          email: action.payload,
        }; */
    case CREATE_GROUP:
      return {
        ...state,
        createSuccess: 1,
        groups: action.payload,
        error: null,
      };
    case ERRORS:
      return {
        ...state,
        error: action.payload,
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
