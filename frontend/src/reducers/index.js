import { combineReducers } from 'redux';
import loginReducer from './loginReducer';
import groupReducer from './groupReducer';
// import signupReducer from './signupReducer';

export default combineReducers({
  login: loginReducer,
  groups: groupReducer,
  // signup: signupReducer,
});
