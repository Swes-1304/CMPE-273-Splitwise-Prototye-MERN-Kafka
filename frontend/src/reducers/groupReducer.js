/* eslint-disable no-underscore-dangle */
import numeral from 'numeral';
import { isEmpty } from 'lodash';
import {
  CREATE_GROUP,
  GET_GROUPS,
  GET_GROUPINVITES,
  RESET_ERRORS,
  ERRORS,
  GET_GRPEXPENSES,
  GET_GRPSUMMARIES,
} from '../actions/types';

const initialState = {
  createSuccess: 0,
  createdgroups: [],
  groups: [],
  groupinvites: [],
  rawgrpexpenses: [],
  activities: [],
  rawgrpsummaries: [],
  individuals: [{}],
  summaries: [{}],
  success: 0,
  error: null,
};

function activities(expenses, root1) {
  console.log('expenses ', expenses);
  const defaultcurrency =
    root1.login.user.currencydef || localStorage.getItem('defaultcurr');
  const regExp = /\(([^)]+)\)/;
  const getvalue = regExp.exec(defaultcurrency);
  const symbolvalue = getvalue[1];
  const arrayofactivities = expenses.map((el) => ({
    // eslint-disable-next-line no-underscore-dangle
    value: el._id,
    expdate: el.tdate,
    descp: el.tdescription,
    paid: el.payedBy.username,
    amnt: symbolvalue + numeral(el.tamount.$numberDecimal).format('0,0.00'),
    formatedmonth: new Date(el.tdate).toLocaleString('default', {
      month: 'short',
    }),
    formatedday: new Date(el.tdate).getUTCDate(),
    // eslint-disable-next-line no-underscore-dangle
    comments: el.tnotes.map((cmt) => ({
      cmtid: cmt._id,
      commentedby: cmt.commentBy.username,
      comment: cmt.comment,
      date: cmt.commentdate,
      formatedcmtmonth: new Date(cmt.commentdate).toLocaleString('default', {
        month: 'short',
      }),
      formatedcmtday: new Date(cmt.commentdate).getUTCDate(),
    })),
  }));
  return arrayofactivities;
}

function individuals(expenses, root1) {
  const defaultcurrency =
    root1.login.user.currencydef || localStorage.getItem('defaultcurr');
  const regExp = /\(([^)]+)\)/;
  const getvalue = regExp.exec(defaultcurrency);
  const symbolvalue = getvalue[1];
  console.log('expenses', expenses);
  const arrayofindividuals = expenses.map((el) => ({
    // eslint-disable-next-line no-underscore-dangle
    id: el._id,
    // eslint-disable-next-line no-underscore-dangle
    payer: el.payeremail,
    // eslint-disable-next-line no-underscore-dangle
    payee: el.payeeemail,
    payername: el.payer,
    payeename: el.payee,
    balance: el.balance,
    formatedbalance: symbolvalue + numeral(el.balance).format('0,0.00'),
  }));

  return arrayofindividuals;
}

function summaries(expenses, root1) {
  const arrayofindividuals = individuals(expenses, root1);
  const defaultcurrency =
    root1.login.user.currencydef || localStorage.getItem('defaultcurr');
  const regExp = /\(([^)]+)\)/;
  const getvalue = regExp.exec(defaultcurrency);
  const symbolvalue = getvalue[1];

  let x;
  const payeeperson = [];
  const payeebalance = [];
  const payeename = [];

  for (let i = 0; i < arrayofindividuals.length; i += 1) {
    x = -1;
    if (!isEmpty(payeeperson)) {
      x = payeeperson.findIndex((el) => el === arrayofindividuals[i].payee);
    }

    if (x === -1) {
      payeeperson.push(arrayofindividuals[i].payee);
      payeename.push(arrayofindividuals[i].payeename);
      payeebalance.push(arrayofindividuals[i].balance);
    } else {
      payeebalance[x] += arrayofindividuals[i].balance;
    }
  }

  const pp = Object.keys(payeeperson);
  const arrayofsummaries = pp.map((indx) => ({
    payee: payeename[indx],
    totalamt: payeebalance[indx],
    formattotalamt: symbolvalue + numeral(payeebalance[indx]).format('0,0.00'),
  }));
  return arrayofsummaries;
}

export default function groupReducer(state = initialState, action, root) {
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
    case GET_GRPEXPENSES:
      return {
        ...state,
        rawgrpexpenses: action.payload,
        activities: activities(action.payload, root),
        error: null,
      };
    case GET_GRPSUMMARIES:
      return {
        ...state,
        rawgrpsummaries: action.payload,
        individuals: individuals(action.payload, root),
        summaries: summaries(action.payload, root),
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
        createSuccess: 0,
      };
    default:
      return state;
  }
}
