import React, { Component } from 'react';
import cookie from 'react-cookies';
import axios from 'axios';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
// import numeral from 'numeral';
import { Modal, Form } from 'react-bootstrap';
import { isEmpty } from 'lodash';
import Select from 'react-select';
import { connect } from 'react-redux';
import Proptypes from 'prop-types';
import { totalBalances, reset } from '../../actions/dashboardAction';
import backendServer from '../../webConfig';
import Navheader from '../navbar/navbar';
import Sidebarcomp from '../navbar/sidebar';
import '../navbar/navbar.css';
import './dashboard.css';

class Dashboardcl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: localStorage.getItem('token'),
      popup: false,
      settleupwith: {},
      settleupliststate: [],
    };
    this.settleuphandler = this.settleuphandler.bind(this);
    this.settleupchnagehandler = this.settleupchnagehandler.bind(this);
  }

  // get the total balances
  componentWillMount() {
    console.log(' inside will mount !!');
    this.gettotalbalances();
    const { reset1, settleuplist } = this.props;
    reset1();

    this.setState({
      settleupliststate: settleuplist,
    });
  }
  /* 
  componentWillReceiveProps(nextProps) {
    console.log('props', this.props);
    const { balances } = this.props;
    if (balances && nextProps.balances !== balances) {
      const { username1, email1, defaultcurrency } = this.props;
      const regExp = /\(([^)]+)\)/;
      const getvalue = regExp.exec(defaultcurrency);
      const symbolvalue = getvalue[1];
      const arraytotalsummary = nextProps.balances.map((el) => ({
        totalblc: symbolvalue + numeral(el.total).format('0,0.00'),
        youowe: symbolvalue + numeral(el.totalyouowe).format('0,0.00'),
        youareowed: symbolvalue + numeral(el.totalyouareowed).format('0,0.00'),
      }));

      console.log(arraytotalsummary);
      this.setState({
        totalsummary: arraytotalsummary,
      });

      console.log(balances.indiyouareowed);
      const arrayindisummariesyouareowed = nextProps.balances[0].indiyouareowed.map(
        (el) => ({
          payer1: el.payer,
          payee1: el.payee,
          payer1email: el.payeremail,
          payee1email: el.payeeemail,
          indiamt1: el.balance,
          grpname1: el.groupname,
          formatindiamt1: symbolvalue + numeral(el.balance).format('0,0.00'),
        })
      );
      this.setState({
        payerbalances: [...arrayindisummariesyouareowed],
      });
      // eslint-disable-next-line react/destructuring-assignment
      console.log(this.state.payerbalances);

      const arrayindisummariesyouowe = nextProps.balances[0].indiyouowe.map(
        (el) => ({
          payer: el.payer,
          payee: el.payee,
          payeremail: el.payeremail,
          payeeemail: el.payeeemail,
          indiamt: el.balance,
          grpname: el.groupname,
          formatindiamt: symbolvalue + numeral(el.balance).format('0,0.00'),
        })
      );
      this.setState({
        payeebalances: [...arrayindisummariesyouowe],
      });

      // eslint-disable-next-line react/destructuring-assignment
      console.log(this.state.payeebalances);

      console.log(arrayindisummariesyouareowed, arrayindisummariesyouowe);

      // total payee for the logged in user
      const totalpayeename = [];
      const totalpayername = [];
      const totalamaount = [];

      // total payer for the logged in user
      const totalpayeename1 = [];
      const totalpayername1 = [];
      const totalamaount1 = [];

      const settleupemaillist = [];
      const settleupnamelist = [];

      let x;
      let y;
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

      for (let i = 0; i < arrayindisummariesyouowe.length; i += 1) {
        x = -1;
        if (
          username1 === arrayindisummariesyouowe[i].payee &&
          arrayindisummariesyouowe[i].indiamt !== 0
        ) {
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
        formatindiamt2:
          symbolvalue + numeral(totalamaount[indx]).format('0,0.00'),
        payer2: totalpayername[indx],
      }));
      console.log(arrayofpayeetotalblnc);
      this.setState({
        totalpayeeuser: [...arrayofpayeetotalblnc],
      });

      const payertotalblnc = Object.keys(totalpayeename1);
      const arrayofpayertotalblnc = payertotalblnc.map((indx) => ({
        payee3: totalpayeename1[indx],
        indiamt3: totalamaount1[indx],
        formatindiamt3:
          symbolvalue + numeral(totalamaount1[indx]).format('0,0.00'),
        payer3: totalpayername1[indx],
      }));
      console.log(arrayofpayertotalblnc);
      this.setState({
        totalpayeruser: [...arrayofpayertotalblnc],
      });

      // list of users for settle up
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
      this.setState({
        settleuplist: [...arrayforselect],
      });
    }
  }
  */

  showHandler = () => {
    this.setState({ popup: true });
  };

  closeHandler = () => {
    this.setState({ popup: false, settleupliststate: [] });
  };

  settleupchnagehandler = (e) => {
    const newarr = e.value;
    console.log(e.value);
    this.setState({ settleupwith: newarr });
  };

  // send data to settle up with an user
  settleuphandler = (settleupwith1, e) => {
    e.preventDefault();
    this.setState({ popup: false, settleupliststate: [], settleupwith: '' });
    const { settleupwith, token } = this.state;
    console.log(settleupwith);
    const data = {
      settleupwith,
    };
    axios
      .post(`${backendServer}/settleup`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'content-type': 'application/json',
        },
      })
      .then((response) => {
        console.log('Status Code : ', response.status);
        console.log('response ', response.data);
        if (response.status === 200) {
          console.log(response.data);
          this.gettotalbalances();
        } else {
          console.log(response.data);
          alert(response.data);
        }
      })
      .catch((err) => {
        console.log(err.response.data);
        alert(err.response.data);
      });
  };

  // function to get the total balances
  gettotalbalances = () => {
    const { totalBalances1 } = this.props;
    totalBalances1();
    /* .then((response) => {
      console.log(' Inside then ');
      console.log(response);
    }); */
    console.log(' inside totalBalances1!!');
  };

  render() {
    let redirectVar = null;
    if (!cookie.load('cookie')) {
      redirectVar = <Redirect to="/" />;
    }
    const { errors } = this.props;
    const {
      popup,
      settleupliststate,
      settleupwith,
      userid,
      useremail,
    } = this.state;
    const {
      totalsummary,
      payeebalances,
      payerbalances,
      totalpayeeuser,
      totalpayeruser,
      settleuplist,
    } = this.props;

    console.log(userid, useremail, settleupliststate);
    let checkifyouowenull = false;
    if (isEmpty(totalpayeeuser)) {
      checkifyouowenull = true;
    }
    let checkifyouowednull = false;
    if (isEmpty(totalpayeruser)) {
      checkifyouowednull = true;
    }

    return (
      <div>
        {redirectVar}
        <Navheader />
        <div className="dashboard-flex">
          <div>
            <Sidebarcomp />
          </div>

          <div className="dashboard-box">
            <section className="dashboard-heading-buttons">
              <section className="dashboard-heading">
                <h1 data-testid="Dashboard">Dashboard</h1>

                <ul className="button-right">
                  <li>
                    <Button className="Signup-default">
                      <Link to="/addbill">Add Bill</Link>
                    </Button>{' '}
                    <Button
                      className="login-default"
                      onClick={this.showHandler}
                    >
                      {' '}
                      Settle Up{' '}
                    </Button>
                    <Modal show={popup} onHide={this.closeHandler}>
                      <Modal.Header closeButton>
                        <Modal.Title>Settle Up</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <Form.Group>
                          <Form.Label>
                            Whom do you want to settle up with:{' '}
                          </Form.Label>
                          <Select
                            options={settleuplist}
                            placeholder="Username"
                            className="div-select"
                            menuPlacement="auto"
                            menuPosition="fixed"
                            onChange={(e) => this.settleupchnagehandler(e)}
                          />
                        </Form.Group>
                      </Modal.Body>
                      <Modal.Footer>
                        <Button
                          className="mygroups-default"
                          onClick={(e) => this.settleuphandler(settleupwith, e)}
                        >
                          √ GO
                        </Button>
                        <Button
                          className="Signup-default"
                          onClick={this.closeHandler}
                        >
                          Cancel
                        </Button>
                      </Modal.Footer>
                    </Modal>
                  </li>
                </ul>
              </section>

              <section className="dashboard-center-sec">
                <div className="dashboard-center-section-block">
                  <div className="title">Total Balance</div>
                  {totalsummary.map((expense) => (
                    <ul
                      className="group-expenses"
                      style={{
                        color: 'black',
                        'font-weight': 'bold',
                        'list-style-type': 'none',
                      }}
                    >
                      <span>{expense.totalblc}</span>
                    </ul>
                  ))}
                </div>

                <div className="dashboard-center-section-block">
                  <div className="dashboard-block-border">
                    <div className="title">You Owe</div>
                    {totalsummary.map((expense) => (
                      <ul
                        className="group-expenses"
                        style={{
                          color: '#ff652f',
                          'font-weight': 'bold',
                          'list-style-type': 'none',
                          'text-align': 'center',
                        }}
                      >
                        <span>{expense.youowe}</span>
                      </ul>
                    ))}
                  </div>
                </div>

                <div className="dashboard-center-section-block">
                  <div className="title">You Are Owed</div>
                  {totalsummary.map((expense) => (
                    <ul
                      className="group-expenses"
                      style={{
                        color: '#3bb894',
                        'font-weight': 'bold',
                        'list-style-type': 'none',
                      }}
                    >
                      <span>{expense.youareowed}</span>
                    </ul>
                  ))}
                </div>
              </section>
            </section>

            <section className="transcations-sec">
              <div className="tranactions-heading">
                <div>You Owe</div>
                <div>You are owed</div>
              </div>
              <div className="transactions-owe">
                {checkifyouowenull ? (
                  <h7>YOU OWE NOTHING</h7>
                ) : (
                  <div>
                    {' '}
                    {totalpayeeuser.map((expense2) => (
                      <ul
                        className="group-expenses"
                        style={{
                          'list-style-type': 'none',
                        }}
                      >
                        <ul>
                          <p>
                            <span>
                              {' '}
                              You Owe{' '}
                              <h7
                                style={{
                                  color: '#ff652f',
                                  'font-weight': 'bold',
                                }}
                              >
                                {expense2.formatindiamt2}
                              </h7>{' '}
                              to {expense2.payer2}
                              {payeebalances
                                .filter(
                                  (exp1) => exp1.payer === expense2.payer2
                                )
                                .map((filteredexp1) => (
                                  <ul
                                    className="group-expenses"
                                    style={{
                                      'list-style-type': 'none',
                                    }}
                                  >
                                    <p
                                      style={{
                                        color: 'rgb(136, 135, 135)',
                                      }}
                                    >
                                      <div>
                                        <span>
                                          {' '}
                                          You Owe{' '}
                                          <h7
                                            style={{
                                              color: '#ff652f',
                                              'font-weight': 'bold',
                                            }}
                                          >
                                            {filteredexp1.formatindiamt}
                                          </h7>{' '}
                                          to {filteredexp1.payer} for{' '}
                                          {filteredexp1.grpname}{' '}
                                        </span>
                                      </div>
                                    </p>
                                  </ul>
                                ))}
                            </span>
                          </p>
                        </ul>
                      </ul>
                    ))}
                  </div>
                )}
              </div>
              <div className="transactions-owed">
                {checkifyouowednull ? (
                  <h7>YOU ARE OWED NOTHING</h7>
                ) : (
                  <div>
                    {' '}
                    {totalpayeruser.map((expense3) => (
                      <ul
                        className="group-expenses"
                        style={{
                          'list-style-type': 'none',
                        }}
                      >
                        <li>
                          <p>
                            <span>
                              {' '}
                              <b>{expense3.payee3}</b>
                              <br />{' '}
                              <h7
                                style={{
                                  color: '#3bb894',
                                  'font-weight': 'bold',
                                }}
                              >
                                owes you {expense3.formatindiamt3}
                              </h7>
                              {payerbalances
                                .filter((exp) => exp.payee1 === expense3.payee3)
                                .map((filteredexp) => (
                                  <ul className="group-expenses">
                                    <ul
                                      style={{
                                        'list-style-type': 'circle',
                                      }}
                                    >
                                      <p
                                        style={{
                                          color: 'rgb(136, 135, 135)',
                                        }}
                                      >
                                        <span>
                                          {' '}
                                          {filteredexp.payee1} owes you{' '}
                                          <h7
                                            style={{
                                              color: '#3bb894',
                                              'font-weight': 'bold',
                                            }}
                                          >
                                            {filteredexp.formatindiamt1}{' '}
                                          </h7>{' '}
                                          for {filteredexp.grpname1}{' '}
                                        </span>
                                      </p>
                                    </ul>
                                  </ul>
                                ))}
                            </span>
                          </p>
                        </li>
                      </ul>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>
          <p className="errmsg" style={{ color: 'maroon' }}>
            {' '}
            {errors}{' '}
          </p>
          <div className="dashboard-right" />
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    totalBalances1: () => dispatch(totalBalances()),
    reset1: () => dispatch(reset()),
  };
}

function mapStateToProps(store) {
  console.log(store);
  return {
    username1: store.login.user.username,
    email1: store.login.user.email,
    defaultcurrency: store.login.user.currencydef,
    errors: store.groups.error,
    balances: store.balance.balances,
    totalsummary: store.balance.totalsummary,
    payerbalances: store.balance.payerbalances,
    payeebalances: store.balance.payeebalances,
    totalpayeruser: store.balance.totalpayeruser,
    totalpayeeuser: store.balance.totalpayeeuser,
    settleuplist: store.balance.settleuplist,
  };
}

const Dashboard = connect(mapStateToProps, mapDispatchToProps)(Dashboardcl);

Dashboardcl.propTypes = {
  reset1: Proptypes.func,
  errors: Proptypes.string,
  totalBalances1: Proptypes.func,
  totalsummary: Proptypes.instanceOf(Array),
  payerbalances: Proptypes.instanceOf(Array),
  payeebalances: Proptypes.instanceOf(Array),
  totalpayeruser: Proptypes.instanceOf(Array),
  totalpayeeuser: Proptypes.instanceOf(Array),
  settleuplist: Proptypes.instanceOf(Array),
};

Dashboardcl.defaultProps = {
  reset1: () => {},
  totalBalances1: () => {},
  errors: '',
  totalsummary: [],
  payerbalances: [],
  payeebalances: [],
  totalpayeruser: [],
  totalpayeeuser: [],
  settleuplist: [],
};

export default Dashboard;
