import React, { Component } from 'react';

import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
// import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { Modal, Form, Image } from 'react-bootstrap';
import { connect } from 'react-redux';
import Proptypes from 'prop-types';
import { isEmpty } from 'lodash';
import numeral from 'numeral';
// import Expand from 'react-expand-animated';
import backendServer from '../../webConfig';
import Sidebarcomp from '../navbar/sidebar';
import Navheader from '../navbar/navbar';
import Groupcomments from './groupcomment';
import { reset } from '../../actions/creategroupAction';
import '../navbar/navbar.css';
import '../dashboard/dashboard.css';
import './group.css';

class Groupdetailscl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: localStorage.getItem('token'),
      grpname: '',
      popup: false,
      popup1: false,
      description: '',
      amount: 0.0,
      activties: [{}],
      individuals: [{}],
      summaries: [{}],
      comments: [{}],
      toogleopen: false,
      comment: '',
      // objofpayees: { payee: '', totalblnc: 0 },
      // arrayofsummaries: [],
      redirecttomygroup: null,
    };
    this.showHandler = this.showHandler.bind(this);
    this.closeHandler = this.closeHandler.bind(this);
    this.decschangehandler = this.decschangehandler.bind(this);
    this.amtchangehandler = this.amtchangehandler.bind(this);
    this.addhandler = this.addhandler.bind(this);
    this.leavegrouphandler = this.leavegrouphandler.bind(this);
    this.removecomment = this.removecomment.bind(this);
    this.addcomment = this.addcomment.bind(this);
    this.addcommentChangeHandler = this.addcommentChangeHandler.bind(this);
  }

  componentWillMount() {
    // eslint-disable-next-line react/prop-types
    const { location } = this.props;
    // eslint-disable-next-line react/prop-types
    console.log(location.state.gName);
    console.log(this.props);
    // eslint-disable-next-line react/prop-types
    const grpname1 = location.state.gName;
    const activities1 = this.getgrpexpenses(grpname1);
    const individuals1 = this.getsummaryexpenses(grpname1);
    const comments1 = this.getcomments(grpname1);
    this.setState({
      grpname: grpname1,
      activties: activities1,
      individuals: individuals1,
      comments: comments1,
    });
    const { reset1 } = this.props;
    reset1();
  }

  // function to get grp expenses
  getgrpexpenses = (gpname) => {
    const { token } = this.state;
    axios
      .get(`${backendServer}/getgrpexpenses/${gpname}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'content-type': 'application/json',
        },
      })
      .then((response) => {
        console.log(response.data);
        console.log(typeof response.data);
        const { data } = response;
        const { defaultcurrency } = this.props;
        const regExp = /\(([^)]+)\)/;
        const getvalue = regExp.exec(defaultcurrency);
        const symbolvalue = getvalue[1];
        const arrayofactivities = data.map((el) => ({
          // eslint-disable-next-line no-underscore-dangle
          value: el._id,
          expdate: el.tdate,
          descp: el.tdescription,
          paid: el.payedBy.username,
          amnt:
            symbolvalue + numeral(el.tamount.$numberDecimal).format('0,0.00'),
          formatedmonth: new Date(el.tdate).toLocaleString('default', {
            month: 'short',
          }),
          formatedday: new Date(el.tdate).getUTCDate(),
        }));
        console.log(arrayofactivities);
        this.setState({
          activties: arrayofactivities,
        });
      })
      .catch((err) => console.log(err));
  };

  getcomments = (gpname) => {
    const { token, comments } = this.state;
    axios
      .get(`${backendServer}/getcomments/${gpname}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'content-type': 'application/json',
        },
      })
      .then((response) => {
        console.log(response.data);
        console.log(comments);
      })
      .catch((err) => console.log(err));
  };

  // function to get summary expenses
  getsummaryexpenses = (gpname) => {
    const { token } = this.state;
    axios
      .get(`${backendServer}/getsummaryexpenses/${gpname}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'content-type': 'application/json',
        },
      })
      .then((response) => {
        console.log(response.data);
        console.log(typeof response.data);
        const { data } = response;
        // const { summaries } = this.state;
        const { defaultcurrency } = this.props;
        console.log(defaultcurrency);
        const regExp = /\(([^)]+)\)/;
        const getvalue = regExp.exec(defaultcurrency);
        const symbolvalue = getvalue[1];
        const arrayofindividuals = data.map((el) => ({
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

        console.log(arrayofindividuals);

        let x;
        const payeeperson = [];
        const payeebalance = [];
        const payeename = [];

        for (let i = 0; i < arrayofindividuals.length; i += 1) {
          x = -1;
          if (!isEmpty(payeeperson)) {
            x = payeeperson.findIndex(
              (el) => el === arrayofindividuals[i].payee
            );
          }
          console.log(x);

          if (x === -1) {
            payeeperson.push(arrayofindividuals[i].payee);
            payeename.push(arrayofindividuals[i].payeename);
            payeebalance.push(arrayofindividuals[i].balance);
          } else {
            payeebalance[x] += arrayofindividuals[i].balance;
          }
        }
        console.log(payeename);
        console.log(payeeperson);
        console.log(payeebalance);

        const pp = Object.keys(payeeperson);
        const arrayofsummaries = pp.map((indx) => ({
          payee: payeename[indx],
          totalamt: payeebalance[indx],
          formattotalamt:
            symbolvalue + numeral(payeebalance[indx]).format('0,0.00'),
        }));
        this.setState({
          summaries: [...arrayofsummaries],
        });

        this.setState({
          individuals: arrayofindividuals,
        });
      })
      .catch((err) => console.log(err));
  };

  showHandler = () => {
    this.setState({ popup: true });
  };

  closeHandler = () => {
    this.setState({ popup: false, description: '', amount: 0.0 });
  };

  showHandler1 = () => {
    const { summaries } = this.state;
    const { username1 } = this.props;
    const currentusrname = username1;
    for (let i = 0; i < summaries.length; i += 1) {
      if (
        currentusrname === summaries[i].payee &&
        summaries[i].totalamt === 0
      ) {
        this.setState({ popup1: true });
        return;
      }
    }
    if (summaries.length === 0) {
      this.setState({
        popup1: true,
      });
      return;
    }
    alert('Please Clear all the debts to leave the group!');
  };

  closeHandler1 = () => {
    this.setState({ popup1: false });
  };

  decschangehandler = (e) => {
    this.setState({ description: e.target.value });
  };

  amtchangehandler = (e) => {
    this.setState({ amount: Number(e.target.value) });
  };

  addhandler = (des, amt, e) => {
    e.preventDefault();
    if (!des || !amt || typeof amt !== 'number' || amt < 0) {
      alert(' Please enter valid description or amount!! ');
      return;
    }
    const descript = des;
    const amountvalue = amt;
    this.setState({ popup: false, description: '', amount: 0.0 });
    const { grpname } = this.state;
    const { token } = this.state;
    const bill = {
      descript,
      amountvalue,
      grpname,
    };
    console.log(bill);
    axios
      .post(`${backendServer}/addabill`, bill, {
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
          this.getgrpexpenses(grpname);
          this.getsummaryexpenses(grpname);
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

  leavegrouphandler = (e) => {
    e.preventDefault();
    this.setState({ popup: false });
    const { grpname, token } = this.state;
    const leavegrp = {
      grpname,
    };
    console.log(leavegrp);
    axios
      .post(`${backendServer}/leavegroup`, leavegrp, {
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
          const redirectVar1 = <Redirect to="/mygroups" />;
          this.setState({
            redirecttomygroup: redirectVar1,
          });
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

  toggle = () => {
    this.setState((prevState) => ({ toogleopen: !prevState.toogleopen }));
  };

  addcommentChangeHandler = (e) => {
    this.setState({
      comment: e.target.value,
    });
  };

  addcomment = (transctionid, com) => {
    // e.preventDefault();
    const trncid = transctionid;
    const { token } = this.state;
    console.log(trncid);
    const data = {
      trsncid: trncid,
      comment: com,
    };
    axios
      .post(`${backendServer}/addcomment`, data, {
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

  removecomment = (id) => {
    const { comment } = this.state;
    this.setState({
      comment: comment.filter((s) => s.gmemail !== id.gmemail),
    });
  };

  render() {
    let redirectVar = null;
    if (!cookie.load('cookie')) {
      redirectVar = <Redirect to="/" />;
    }
    const {
      grpname,
      activties,
      individuals,
      summaries,
      redirecttomygroup,
      comment,
    } = this.state;
    const { popup, popup1 } = this.state;
    const { description, amount } = this.state;
    const { errors } = this.props;
    console.log(comment);
    const expensepic = '/Group_photos/expense.png';
    let checkifactivitiesnull = false;
    if (isEmpty(activties)) {
      checkifactivitiesnull = true;
    }
    let checkifsummiesnull = false;
    if (isEmpty(individuals)) {
      checkifsummiesnull = true;
    }
    const { username1 } = this.props;
    const currusername = username1;
    console.log(activties);
    return (
      <div>
        {redirectVar}
        {redirecttomygroup}
        <Navheader />
        <div className="grouppage-flex">
          <div>
            <Sidebarcomp />
          </div>
        </div>
        <div className="grouppage-box">
          <section className="grouppage-heading-buttons">
            <section className="grouppage-heading">
              <h1>Group Name {grpname}</h1>
              <ul className="grouppage-button">
                <li>
                  <Button className="login-default" onClick={this.showHandler}>
                    Add an Expense
                  </Button>{' '}
                  <Modal show={popup} onHide={this.closeHandler}>
                    <Modal.Header closeButton>
                      <Modal.Title>
                        Add an Expense
                        <div>With you and everyone</div>
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <Form.Group>
                        <Image
                          src={expensepic}
                          className="avatarfordesc"
                          alt="expense pic"
                        />
                        <br />
                        <Form.Label>Description: </Form.Label>
                        <Form.Control
                          type="text"
                          onChange={this.decschangehandler}
                          value={description}
                          placeholder="Decsription"
                        />
                        <Form.Label>Amount: </Form.Label>
                        <Form.Control
                          type="number"
                          onChange={this.amtchangehandler}
                          value={amount}
                          placeholder="Amount"
                        />
                      </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button
                        className="login-default"
                        type="submit"
                        onClick={(e) => this.addhandler(description, amount, e)}
                      >
                        Add
                      </Button>
                      <Button
                        className="Signup-default"
                        onClick={this.closeHandler}
                      >
                        Cancel
                      </Button>
                    </Modal.Footer>
                  </Modal>
                  <Button
                    className="Signup-default"
                    data-testid="leavegroup"
                    onClick={this.showHandler1}
                  >
                    Leave Group
                  </Button>
                  <Modal show={popup1} onHide={this.closeHandler1}>
                    <Modal.Header closeButton>
                      <Modal.Title>Leave Group</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Do you wish to Leave the group?</Modal.Body>
                    <Modal.Footer>
                      <Button
                        className="login-default"
                        onClick={(e) => this.leavegrouphandler(e)}
                      >
                        √ Yes
                      </Button>
                      <Button
                        className="Signup-default"
                        onClick={this.closeHandler1}
                      >
                        x No
                      </Button>
                    </Modal.Footer>
                  </Modal>
                </li>
              </ul>
            </section>

            <section className="grouppage-center-sec">
              <div className="grouppage-center-section-block" />

              <div className="grouppage-center-section-block">
                <br />
                <div className="grouppage-block-border">
                  {checkifactivitiesnull ? (
                    <h7>No transactions to display!</h7>
                  ) : (
                    <div>
                      {' '}
                      {activties.map((expense) => (
                        <ul className="group-expenses_1">
                          <li>
                            <p>
                              <div className="Row">
                                <div className="Column">
                                  {expense.formatedmonth} <br />{' '}
                                  {expense.formatedday}{' '}
                                </div>
                                <div className="Column">
                                  {' '}
                                  <Image
                                    src={expensepic}
                                    className="avatarfordisplay"
                                    alt="expense pic"
                                  />
                                </div>

                                <div className="Column">
                                  <h4>{expense.descp}</h4>
                                </div>
                                <div className="Column"> </div>
                                <div className="Column"> </div>
                                <div className="Column"> </div>
                                <div className="Column"> </div>

                                <div className="Column">
                                  <p>{expense.paid} </p>
                                  <h5>{expense.amnt} </h5>
                                </div>

                                <div className="Column"> </div>
                              </div>

                              <div className="Main">
                                <div className="BoxToggle">
                                  <p>Comments</p>
                                </div>
                                <div className="ExpandBoxes">
                                  <div className="BoxExpand">
                                    {' '}
                                    <p>Hello</p>
                                    <p>{expense.paid}</p>
                                    <div
                                      className="grpnameemail"
                                      style={{
                                        width: '300px',
                                        display: 'flex',
                                        flexDirection: 'row',
                                      }}
                                    >
                                      <div
                                        className="grpnameemail"
                                        style={{
                                          width: '300px',
                                        }}
                                      >
                                        <Groupcomments
                                          // eslint-disable-next-line react/jsx-props-no-spreading
                                          {...this.props}
                                          addcomment={(val) => {
                                            this.addcomment(expense.value, val);
                                          }}
                                        />
                                      </div>
                                      <button
                                        type="button"
                                        name="removegm"
                                        onClick={() => this.removecomment()}
                                        className="removegm"
                                        style={{
                                          'background-color': 'white',
                                          border: 'none',
                                          color: '#ff652f',
                                          'font-weight': 'bolder',
                                        }}
                                      >
                                        X
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <hr
                                style={{
                                  height: '2px',
                                  border: 'none',
                                  color: 'black',
                                  'background-color': 'Grey',
                                }}
                              />
                            </p>
                          </li>
                        </ul>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>
          </section>
        </div>

        <div className="grouppage-right" />
        <div className="title"> </div>
        {checkifsummiesnull ? (
          <h7>NONE HAVE ACCEPTED THE INVITES TO THE GROUP!</h7>
        ) : (
          <div>
            {' '}
            <h2>Groups Summary</h2>
            {summaries.map((expense) => (
              <ul className="group-expenses-group">
                <li>
                  {(() => {
                    if (
                      JSON.stringify(expense.payee) ===
                      JSON.stringify(currusername)
                    ) {
                      return <h6>You owe </h6>;
                    }

                    return <h6>{expense.payee} owes </h6>;
                  })()}
                  <h6>
                    <h7 style={{ color: '#ff652f', 'text-weight': 'bold' }}>
                      {expense.formattotalamt}{' '}
                    </h7>
                    in Total{' '}
                  </h6>
                </li>
              </ul>
            ))}
            <h2> Details :</h2>
            {individuals.map((expense) => (
              <ul className="group-expenses-group">
                <li>
                  {expense.payeename} owes {expense.payername}{' '}
                  <p style={{ color: '#ff652f', 'text-weight': 'bold' }}>
                    {expense.formatedbalance}
                  </p>
                </li>
              </ul>
            ))}
          </div>
        )}
        <p className="errmsg" style={{ color: 'maroon' }}>
          {' '}
          {errors}{' '}
        </p>
      </div>
    );
  }
}
function mapDispatchToProps(dispatch) {
  return {
    reset1: () => dispatch(reset()),
  };
}

function mapStateToProps(store) {
  console.log(store);
  return {
    username1: store.login.user.username,
    defaultcurrency: store.login.user.currencydef,
  };
}

const Groupdetails = connect(
  mapStateToProps,
  mapDispatchToProps
)(Groupdetailscl);

Groupdetailscl.propTypes = {
  reset1: Proptypes.func,
  username1: Proptypes.string,
  errors: Proptypes.string,
  defaultcurrency: Proptypes.string,
};

Groupdetailscl.defaultProps = {
  reset1: () => {},
  defaultcurrency: '',
  errors: '',
  username1: '',
  // gName: '',
};

export default Groupdetails;
