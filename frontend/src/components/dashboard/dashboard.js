import React, { Component } from 'react';
import cookie from 'react-cookies';
import axios from 'axios';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import numeral from 'numeral';
import { Modal, Form } from 'react-bootstrap';
import { isEmpty } from 'lodash';
import Select from 'react-select';
import Navheader from '../navbar/navbar';
import Sidebarcomp from '../navbar/sidebar';
import '../navbar/navbar.css';
import './dashboard.css';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userid: '',
      useremail: '',
      popup: false,
      settleupwith: {},
      totalsummary: [],
      payeebalances: [],
      payerbalances: [],
      totalpayeeuser: [],
      totalpayeruser: [],
      settleuplist: [],
    };
    this.settleuphandler = this.settleuphandler.bind(this);
    this.settleupchnagehandler = this.settleupchnagehandler.bind(this);
  }

  // get the total balances
  componentWillMount() {
    const userid1 = sessionStorage.getItem('userid');
    const useremail1 = sessionStorage.getItem('useremail');
    this.gettotalbalances(userid1);
    this.setState({
      userid: userid1,
      useremail: useremail1,
    });
  }

  showHandler = () => {
    this.setState({ popup: true });
  };

  closeHandler = () => {
    this.setState({ popup: false, settleuplist: [] });
  };

  settleupchnagehandler = (e) => {
    const newarr = e.value;
    console.log(e.value);
    this.setState({ settleupwith: newarr });
  };

  // send data to settle up with an user
  settleuphandler = (settleupwith1, e) => {
    e.preventDefault();
    this.setState({ popup: false, settleuplist: [], settleupwith: '' });
    const { settleupwith, userid, useremail } = this.state;
    console.log(settleupwith);
    const data = {
      settleupwith,
      userid,
      useremail,
    };
    axios
      .post('http://localhost:3001/settleup', data)
      .then((response) => {
        console.log('Status Code : ', response.status);
        console.log('response ', response.data);
        if (response.status === 200) {
          console.log(response.data);
          this.gettotalbalances(userid);
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
  gettotalbalances = (userid) => {
    axios
      .get(`http://localhost:3001/gettotalbalances/${userid}`, {
        headers: {
          'content-type': 'application/json',
        },
      })
      .then((response) => {
        const data = response.data[1];
        const username = sessionStorage.getItem('username');
        const useremail = sessionStorage.getItem('useremail');
        const defaultcurr = sessionStorage.getItem('defaultcurrency');
        const regExp = /\(([^)]+)\)/;
        const getvalue = regExp.exec(defaultcurr);
        const symbolvalue = getvalue[1];
        const arraytotalsummary = data.map((el) => ({
          totalblc: symbolvalue + numeral(el.Total_balance).format('0,0.00'),
          youowe: symbolvalue + numeral(el.You_owe).format('0,0.00'),
          youareowed: symbolvalue + numeral(el.You_are_owed).format('0,0.00'),
        }));

        this.setState({
          totalsummary: arraytotalsummary,
        });

        const data1 = response.data[0];
        const arrayindisummaries = data1.map((el) => ({
          payername: el.payer_username,
          payeremail: el.payer,
          payeename: el.payee_username,
          payeeemail: el.payee,
          balance: el.balance,
          grpname: el.gpname,
        }));

        this.setState({
          totalsummary: arraytotalsummary,
        });

        // payee details for the logged in user
        const payeearr = [];
        const payeegrouparr = [];
        const payeebalancearr = [];
        const payerarr = [];

        // payer details for the logged in user
        const payeepaysarr = [];
        const payeepaysbalancearr = [];
        const payergetsarr = [];
        const payergrouparr = [];

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
        for (let i = 0; i < arrayindisummaries.length; i += 1) {
          x = -1;
          if (
            username === arrayindisummaries[i].payeename &&
            arrayindisummaries[i].balance !== 0
          ) {
            payeearr.push(username);
            payeegrouparr.push(arrayindisummaries[i].grpname);
            payeebalancearr.push(arrayindisummaries[i].balance);
            payerarr.push(arrayindisummaries[i].payername);
            if (!isEmpty(totalpayername)) {
              x = totalpayername.findIndex(
                (el) => el === arrayindisummaries[i].payername
              );
            }
            if (x > -1) {
              totalamaount[x] += arrayindisummaries[i].balance;
            } else {
              totalpayername.push(arrayindisummaries[i].payername);
              totalamaount.push(arrayindisummaries[i].balance);
              totalpayeename.push(username);
            }
          } else if (
            username === arrayindisummaries[i].payername &&
            arrayindisummaries[i].balance !== 0
          ) {
            payeepaysbalancearr.push(arrayindisummaries[i].balance);
            payeepaysarr.push(arrayindisummaries[i].payeename);
            payergrouparr.push(arrayindisummaries[i].grpname);
            payergetsarr.push(username);
            // x = -1;
            if (!isEmpty(totalpayeename1)) {
              x = totalpayeename1.findIndex(
                (el) => el === arrayindisummaries[i].payeename
              );
            }
            if (x > -1) {
              totalamaount1[x] += arrayindisummaries[i].balance;
            } else {
              totalpayeename1.push(arrayindisummaries[i].payeename);
              totalamaount1.push(arrayindisummaries[i].balance);
              totalpayername1.push(username);
            }
          }
        }

        const payeearray = Object.keys(payeearr);
        const arrayofindipayee = payeearray.map((indx) => ({
          payee: payeearr[indx],
          grpname: payeegrouparr[indx],
          indiamt: payeebalancearr[indx],
          formatindiamt:
            symbolvalue + numeral(payeebalancearr[indx]).format('0,0.00'),
          payer: payerarr[indx],
        }));
        console.log(arrayofindipayee);
        this.setState({
          payeebalances: [...arrayofindipayee],
        });

        const payerarray = Object.keys(payergetsarr);
        const arrayofindipayer = payerarray.map((indx) => ({
          payee1: payeepaysarr[indx],
          grpname1: payergrouparr[indx],
          indiamt1: payeepaysbalancearr[indx],
          formatindiamt1:
            symbolvalue + numeral(payeepaysbalancearr[indx]).format('0,0.00'),
          payer1: payergetsarr[indx],
        }));
        console.log(arrayofindipayer);
        this.setState({
          payerbalances: [...arrayofindipayer],
        });

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
        for (let j = 0; j < arrayindisummaries.length; j += 1) {
          y = -1;
          if (
            useremail !== arrayindisummaries[j].payeeemail &&
            arrayindisummaries[j].balance !== 0
          ) {
            if (!isEmpty(settleupemaillist)) {
              y = settleupemaillist.findIndex(
                (el) => el === arrayindisummaries[j].payeeemail
              );
            }

            if (y === -1) {
              settleupnamelist.push(arrayindisummaries[j].payeename);
              settleupemaillist.push(arrayindisummaries[j].payeeemail);
            }
          } else if (
            JSON.stringify(useremail) !==
              JSON.stringify(arrayindisummaries[j].payeremail) &&
            arrayindisummaries[j].balance !== 0
          ) {
            if (!isEmpty(settleupemaillist)) {
              y = settleupemaillist.findIndex(
                (el) => el === arrayindisummaries[j].payeremail
              );
            }

            if (y === -1) {
              settleupnamelist.push(arrayindisummaries[j].payername);
              settleupemaillist.push(arrayindisummaries[j].payeremail);
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
      })
      .catch((err) => console.log(err));
  };

  render() {
    let redirectVar = null;
    if (!cookie.load('cookie')) {
      redirectVar = <Redirect to="/" />;
    }
    const {
      totalsummary,
      payeebalances,
      payerbalances,
      totalpayeeuser,
      totalpayeruser,
      popup,
      settleuplist,
      settleupwith,
      userid,
      useremail,
    } = this.state;
    console.log(userid, useremail);
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

          <div className="dashboard-right" />
        </div>
      </div>
    );
  }
}

export default Dashboard;
