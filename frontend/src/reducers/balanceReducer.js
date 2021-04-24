import numeral from 'numeral';
import { isEmpty } from 'lodash';
import { GET_BALANCES, RESET_ERRORS, ERRORS } from '../actions/types';
// eslint-disable-next-line import/no-cycle
// import store from '../store';

// // console.log(store.getState().login.defaultcurrency);

const initialState = {
  balances: [],
  error: null,
  totalsummary: [],
  payeebalances: [],
  payerbalances: [],
  totalpayeeuser: [],
  totalpayeruser: [],
  settleuplist: [],
};

function totalsummary(balances, root1) {
  console.log(' inside total reducer ');
  const defaultcurrency1 =
    root1.login.user.currencydef || localStorage.getItem('defaultcurr');
  console.log(' inside total reducer default currency ', defaultcurrency1);
  const regExp = /\(([^)]+)\)/;
  const getvalue = regExp.exec(defaultcurrency1);
  const symbolvalue = getvalue[1];
  const arraytotalsummary = balances.map((el) => ({
    totalblc: symbolvalue + numeral(el.total).format('0,0.00'),
    youowe: symbolvalue + numeral(el.totalyouowe).format('0,0.00'),
    youareowed: symbolvalue + numeral(el.totalyouareowed).format('0,0.00'),
  }));
  console.log('arraytotalsummary', arraytotalsummary);
  return arraytotalsummary;
}

function payerbalances(balances, root1) {
  // console.log(' inside payerbalances reducer ');
  const defaultcurrency =
    root1.login.user.currencydef || localStorage.getItem('defaultcurr');
  const regExp = /\(([^)]+)\)/;
  const getvalue = regExp.exec(defaultcurrency);
  const symbolvalue = getvalue[1];

  // console.log('here');
  // console.log(balances[0]);
  const arrayindisummariesyouareowed = balances[0].indiyouareowed.map((el) => ({
    payer1: el.payer,
    payee1: el.payee,
    payer1email: el.payeremail,
    payee1email: el.payeeemail,
    indiamt1: el.balance,
    grpname1: el.groupname,
    formatindiamt1: symbolvalue + numeral(el.balance).format('0,0.00'),
  }));
  // console.log('here 1');
  // console.log(' arrayindisummariesyouareowed', arrayindisummariesyouareowed);
  return arrayindisummariesyouareowed;
}

function payeebalances(balances, root1) {
  const defaultcurrency =
    root1.login.user.currencydef || localStorage.getItem('defaultcurr');
  const regExp = /\(([^)]+)\)/;
  const getvalue = regExp.exec(defaultcurrency);
  const symbolvalue = getvalue[1];

  const arrayindisummariesyouowe = balances[0].indiyouowe.map((el) => ({
    payer: el.payer,
    payee: el.payee,
    payeremail: el.payeremail,
    payeeemail: el.payeeemail,
    indiamt: el.balance,
    grpname: el.groupname,
    formatindiamt: symbolvalue + numeral(el.balance).format('0,0.00'),
  }));
  // console.log(' arrayindisummariesyouowe', arrayindisummariesyouowe);
  return arrayindisummariesyouowe;
}

function totalpayeruser(balances, root1) {
  const defaultcurrency =
    root1.login.user.currencydef || localStorage.getItem('defaultcurr');
  const regExp = /\(([^)]+)\)/;
  const getvalue = regExp.exec(defaultcurrency);
  const symbolvalue = getvalue[1];
  const arrayindisummariesyouareowed = payerbalances(balances, root1);
  const totalpayeename1 = [];
  const totalpayername1 = [];
  const totalamaount1 = [];
  const username1 =
    root1.login.user.username || localStorage.getItem('username');
  let x;
  for (let i = 0; i < arrayindisummariesyouareowed.length; i += 1) {
    x = -1;
    if (
      username1 === arrayindisummariesyouareowed[i].payer1 &&
      arrayindisummariesyouareowed[i].indiamt1 !== 0
    ) {
      if (!isEmpty(totalpayeename1)) {
        x = totalpayeename1.findIndex(
          (el) => el === arrayindisummariesyouareowed[i].payee1
        );
      }
      if (x > -1) {
        totalamaount1[x] += arrayindisummariesyouareowed[i].indiamt1;
      } else {
        totalpayeename1.push(arrayindisummariesyouareowed[i].payee1);
        totalamaount1.push(arrayindisummariesyouareowed[i].indiamt1);
        totalpayername1.push(username1);
      }
    }
  }

  const payertotalblnc = Object.keys(totalpayeename1);
  const arrayofpayertotalblnc = payertotalblnc.map((indx) => ({
    payee3: totalpayeename1[indx],
    indiamt3: totalamaount1[indx],
    formatindiamt3: symbolvalue + numeral(totalamaount1[indx]).format('0,0.00'),
    payer3: totalpayername1[indx],
  }));
  // console.log('arrayofpayertotalblnc', arrayofpayertotalblnc);

  return arrayofpayertotalblnc;
}

function totalpayeeuser(balances, root1) {
  const defaultcurrency =
    root1.login.user.currencydef || localStorage.getItem('defaultcurr');
  const regExp = /\(([^)]+)\)/;
  const getvalue = regExp.exec(defaultcurrency);
  const symbolvalue = getvalue[1];
  const arrayindisummariesyouowe = payeebalances(balances, root1);
  const totalpayeename = [];
  const totalpayername = [];
  const totalamaount = [];
  const username1 =
    root1.login.user.username || localStorage.getItem('username');
  let x;
  // console.log('KK:', arrayindisummariesyouowe);
  for (let i = 0; i < arrayindisummariesyouowe.length; i += 1) {
    x = -1;
    // console.log('KK: arrayindisummariesyouowe');
    if (
      username1 === arrayindisummariesyouowe[i].payee &&
      arrayindisummariesyouowe[i].indiamt !== 0
    ) {
      // console.log('KK: inside first if');
      if (!isEmpty(totalpayername)) {
        x = totalpayername.findIndex(
          (el) => el === arrayindisummariesyouowe[i].payer
        );
      }
      if (x > -1) {
        totalamaount[x] += arrayindisummariesyouowe[i].indiamt;
      } else {
        totalpayername.push(arrayindisummariesyouowe[i].payer);
        totalamaount.push(arrayindisummariesyouowe[i].indiamt);
        totalpayeename.push(username1);
      }
    }
  }

  const payeetotalblnc = Object.keys(totalpayeename);
  const arrayofpayeetotalblnc = payeetotalblnc.map((indx) => ({
    payee2: totalpayeename[indx],
    indiamt2: totalamaount[indx],
    formatindiamt2: symbolvalue + numeral(totalamaount[indx]).format('0,0.00'),
    payer2: totalpayername[indx],
  }));
  // console.log('arrayofpayeetotalblnc', arrayofpayeetotalblnc);

  return arrayofpayeetotalblnc;
}

function settleuplist(balances, root1) {
  const email1 = root1.login.user.email || localStorage.getItem('email');

  const arrayindisummariesyouareowed = payerbalances(balances, root1);
  const arrayindisummariesyouowe = payeebalances(balances, root1);
  const settleupemaillist = [];
  const settleupnamelist = [];

  let y;
  for (let j = 0; j < arrayindisummariesyouareowed.length; j += 1) {
    y = -1;
    if (
      email1 !== arrayindisummariesyouareowed[j].payee1email &&
      arrayindisummariesyouareowed[j].indiamt1 !== 0
    ) {
      if (!isEmpty(settleupemaillist)) {
        y = settleupemaillist.findIndex(
          (el) => el === arrayindisummariesyouareowed[j].payee1email
        );
      }

      if (y === -1) {
        settleupnamelist.push(arrayindisummariesyouareowed[j].payee1);
        settleupemaillist.push(arrayindisummariesyouareowed[j].payee1email);
      }
    } else if (
      JSON.stringify(email1) !==
        JSON.stringify(arrayindisummariesyouareowed[j].payer1email) &&
      arrayindisummariesyouareowed[j].indiamt1 !== 0
    ) {
      if (!isEmpty(settleupemaillist)) {
        y = settleupemaillist.findIndex(
          (el) => el === arrayindisummariesyouareowed[j].payer1email
        );
      }

      if (y === -1) {
        settleupnamelist.push(arrayindisummariesyouareowed[j].payer1);
        settleupemaillist.push(arrayindisummariesyouareowed[j].payer1email);
      }
    }
  }
  for (let j = 0; j < arrayindisummariesyouowe.length; j += 1) {
    y = -1;
    if (
      email1 !== arrayindisummariesyouowe[j].payeeemail &&
      arrayindisummariesyouowe[j].indiamt !== 0
    ) {
      if (!isEmpty(settleupemaillist)) {
        y = settleupemaillist.findIndex(
          (el) => el === arrayindisummariesyouowe[j].payeeemail
        );
      }

      if (y === -1) {
        settleupnamelist.push(arrayindisummariesyouowe[j].payee);
        settleupemaillist.push(arrayindisummariesyouowe[j].payeeemail);
      }
    } else if (
      JSON.stringify(email1) !==
        JSON.stringify(arrayindisummariesyouowe[j].payeremail) &&
      arrayindisummariesyouowe[j].indiamt1 !== 0
    ) {
      if (!isEmpty(settleupemaillist)) {
        y = settleupemaillist.findIndex(
          (el) => el === arrayindisummariesyouowe[j].payeremail
        );
      }

      if (y === -1) {
        settleupnamelist.push(arrayindisummariesyouowe[j].payer);
        settleupemaillist.push(arrayindisummariesyouowe[j].payeremail);
      }
    }
  }
  const setteluplist = Object.keys(settleupemaillist);
  const arrayforselect = setteluplist.map((indx) => ({
    value: settleupemaillist[indx],
    label: settleupnamelist[indx],
  }));
  // console.log('arrayforselect', arrayforselect);

  return arrayforselect;
}

export default function balanceReducer(state = initialState, action, root) {
  switch (action.type) {
    /* case EMAIL_CHANGE:
          return {
            ...state,
            email: action.payload,
          }; */
    case GET_BALANCES: {
      // console.log(' inside case getbalcnes ');
      // console.log(root);
      // const store1 = this.store.getState();
      // // console.log(' store', store1);
      return {
        ...state,
        balances: action.payload,
        totalsummary: totalsummary(action.payload, root),
        payerbalances: payerbalances(action.payload, root),
        payeebalances: payeebalances(action.payload, root),
        totalpayeruser: totalpayeruser(action.payload, root),
        totalpayeeuser: totalpayeeuser(action.payload, root),
        settleuplist: settleuplist(action.payload, root),
        error: null,
      };
    }
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
