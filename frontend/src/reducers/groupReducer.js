import {
  CREATE_GROUP,
  GET_GROUPS,
  GET_GROUPINVITES,
  RESET_ERRORS,
  ERRORS,
} from '../actions/types';

const initialState = {
  createSuccess: 0,
  createdgroups: {},
  groups: {},
  groupinvites: {},
  success: 0,
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
        createdgroups: action.payload,
        error: null,
      };
    case GET_GROUPS:
      return {
        ...state,
        success: 1,
        groups: action.payload,
        error: null,
      };
    case GET_GROUPINVITES:
      return {
        ...state,
        success: 1,
        groupinvites: action.payload,
        error: null,
      };
    case ERRORS:
      return {
        ...state,
        error: action.payload,
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
