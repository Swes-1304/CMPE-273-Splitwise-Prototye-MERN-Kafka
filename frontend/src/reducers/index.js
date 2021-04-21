// import { combineReducers } from 'redux';
import loginReducer from './loginReducer';
import groupReducer from './groupReducer';
// eslint-disable-next-line import/no-cycle
import balanceReducer from './balanceReducer';
import transactionsReducer from './transactionsReducer';
import { USER_LOGOUT } from '../actions/types';

// import signupReducer from './signupReducer';

/* const appReducer = combineReducers({
  login: loginReducer,
  groups: groupReducer,
  balance: balanceReducer,
  // signup: signupReducer,
}); */

const rootReducer = (state, action) => {
  if (action.type === USER_LOGOUT) {
    // eslint-disable-next-line no-param-reassign
    state.login = undefined;
    // eslint-disable-next-line no-param-reassign
    state.groups = undefined;
    // eslint-disable-next-line no-param-reassign
    state.balance = undefined;
    // eslint-disable-next-line no-param-reassign
    state.transactions = undefined;
  }
  // return appReducer(state, action);
  return {
    login: loginReducer(state.login, action, state),
    groups: groupReducer(state.groups, action, state),
    balance: balanceReducer(state.balance, action, state),
    transactions: transactionsReducer(state.transactions, action, state),
  };
};

export default rootReducer;
