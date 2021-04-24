import numeral from 'numeral';
import { RECENT_ACTIVITIES, RESET_ERRORS, ERRORS } from '../actions/types';

const initialState = {
  acitivties: {},
  recent: [],
};

function recentdescsorted(activities, root1) {
  const data1 = [];
  for (let s = 0; s < activities.transactions.length; s += 1) {
    for (let t = 0; t < activities.transactions[s].length; t += 1) {
      data1.push(activities.transactions[s][t]);
    }
  }
  const data2 = activities.settleup;
  let mergedata1anddata2 = [];
  const defaultcurrency =
    root1.login.user.currencydef || localStorage.getItem('defaultcurr');
  const regExp = /\(([^)]+)\)/;
  const getvalue = regExp.exec(defaultcurrency);
  const symbolvalue = getvalue[1];
  const arrayofrecentactivitiesdata1 = data1.map((el1) => ({
    paid: el1.payedBy.username,
    gpname: el1.groupid.groupname,
    descp: el1.tdescription,
    amnt: symbolvalue + numeral(el1.tamount.$numberDecimal).format('0,0.00'),
    date1: el1.tdate,
    time1: new Date(el1.tdate).toLocaleTimeString(),
    formatedmonth: new Date(el1.tdate).toLocaleString('default', {
      month: 'short',
    }),
    formatedday: new Date(el1.tdate).getUTCDate(),
    formatedyear: new Date(el1.tdate).getUTCFullYear(),
  }));
  console.log(arrayofrecentactivitiesdata1);

  const arrayofrecentactivitiesdata2 = data2.map((el2) => ({
    paid: el2.payedBy.username,
    gpname: null,
    descp: el2.tdescription,
    amnt: symbolvalue + numeral(el2.tamount.$numberDecimal).format('0,0.00'),
    date1: el2.tdate,
    time1: new Date(el2.tdate).toLocaleTimeString(),
    formatedmonth: new Date(el2.tdate).toLocaleString('default', {
      month: 'short',
    }),
    formatedday: new Date(el2.tdate).getUTCDate(),
    formatedyear: new Date(el2.tdate).getUTCFullYear(),
  }));
  console.log(arrayofrecentactivitiesdata2);
  mergedata1anddata2 = [
    ...arrayofrecentactivitiesdata1,
    ...arrayofrecentactivitiesdata2,
  ];

  const sortades = (recentsettle) => (key) =>
    [...recentsettle]
      .sort(
        (intitial, next) =>
          new Date(intitial[key]).getTime() - new Date(next[key]).getTime()
      )
      .reverse();

  const descsortsettle = sortades(mergedata1anddata2)('date1');
  return descsortsettle;
}

export default function transactionsReducer(
  state = initialState,
  action,
  root
) {
  switch (action.type) {
    case RECENT_ACTIVITIES:
      return {
        ...state,
        acitivties: action.payload,
        recent: recentdescsorted(action.payload, root),
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
