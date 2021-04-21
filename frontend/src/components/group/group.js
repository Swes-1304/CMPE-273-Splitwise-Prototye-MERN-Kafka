/* eslint-disable no-underscore-dangle */
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
import { IsEmpty } from 'react-lodash';
// import numeral from 'numeral';
// import Expand from 'react-expand-animated';
import backendServer from '../../webConfig';
import Sidebarcomp from '../navbar/sidebar';
import Navheader from '../navbar/navbar';
import Groupcomments from './groupcomment';
import { reset } from '../../actions/creategroupAction';
import {
  getgrpExpenses,
  getgrpsummaryExpenses,
} from '../../actions/groupAction';
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
      popup2: false,
      description: '',
      amount: 0.0,
      toogleopen: false,
      comment: '',
      commentid: null,
      expenseid: null,
      // objofpayees: { payee: '', totalblnc: 0 },
      // arrayofsummaries: [],
      redirecttomygroup: null,
    };

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
    this.getgrpexpenses(grpname1);
    this.getsummaryexpenses(grpname1);

    this.setState({
      grpname: grpname1,
      // comments: comments1,
    });
    const { reset1 } = this.props;
    reset1();
  }

  // function to get grp expenses
  getgrpexpenses = (gpname) => {
    const { getgrpExpenses1 } = this.props;
    getgrpExpenses1(gpname);
  };

  // function to get summary expenses
  getsummaryexpenses = (gpname) => {
    const { getgrpsummaryExpenses1 } = this.props;
    getgrpsummaryExpenses1(gpname);
  };

  showHandler = () => {
    this.setState({ popup: true });
  };

  closeHandler = () => {
    this.setState({ popup: false, description: '', amount: 0.0 });
  };

  showHandler2 = (cmtid, expnid) => {
    this.setState({ popup2: true, commentid: cmtid, expenseid: expnid });
  };

  closeHandler2 = () => {
    this.setState({ popup2: false, commentid: null, expenseid: null });
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
    const { token, grpname, comment } = this.state;
    console.log(trncid, comment);
    if (com === '' || com.length < 1) {
      alert(' Please enter a comment !');
      return;
    }
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
          this.getgrpexpenses(grpname);
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

  removecomment = (cmtid, trnid) => {
    const trncid = trnid;
    const cmntid = cmtid;
    // this.setState({ popup2: false });
    this.closeHandler2();
    const { token, grpname } = this.state;
    console.log(trncid);
    const data = {
      trsncid: trncid,
      cmtid: cmntid,
    };
    axios
      .post(`${backendServer}/removecomment`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'content-type': 'application/json',
        },
      })
      .then((response) => {
        if (response.status === 200) {
          console.log(response.data);
          this.getgrpexpenses(grpname);
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

  render() {
    let redirectVar = null;
    if (!cookie.load('cookie')) {
      redirectVar = <Redirect to="/" />;
    }
    const { grpname, redirecttomygroup, commentid, expenseid } = this.state;
    const { activties, individuals, summaries } = this.props;
    const { popup, popup1, popup2 } = this.state;
    const { description, amount } = this.state;
    const { errors } = this.props;
    // console.log(comment);
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
                                  <IsEmpty
                                    value={expense.comments}
                                    yes={() => (
                                      <div>
                                        <h7>
                                          There are no comments on this expense
                                          yet!
                                        </h7>
                                        <div
                                          style={{
                                            float: 'bottom',
                                          }}
                                        >
                                          <Groupcomments
                                            // eslint-disable-next-line react/jsx-props-no-spreading
                                            {...this.props}
                                            addcomment={(val) => {
                                              this.addcomment(
                                                expense.value,
                                                val
                                              );
                                            }}
                                          />
                                        </div>
                                      </div>
                                    )}
                                    no={() => (
                                      <div>
                                        {' '}
                                        <h7>NOTES AND COMMENTS</h7>
                                        {expense.comments.map((cmt) => (
                                          <ul className="group-expenses-group">
                                            <li>
                                              {(() => {
                                                if (
                                                  JSON.stringify(
                                                    cmt.commentedby
                                                  ) ===
                                                  JSON.stringify(currusername)
                                                ) {
                                                  return <h6>You </h6>;
                                                }

                                                return (
                                                  <h6>{cmt.commentedby} </h6>
                                                );
                                              })()}
                                              <h6>
                                                <p
                                                  style={{
                                                    textWeight: 'bold',
                                                  }}
                                                >
                                                  {cmt.formatedcmtday}{' '}
                                                  {cmt.formatedcmtmonth}
                                                </p>
                                                {cmt.comment}{' '}
                                              </h6>
                                              {(() => {
                                                if (
                                                  JSON.stringify(
                                                    cmt.commentedby
                                                  ) ===
                                                  JSON.stringify(currusername)
                                                ) {
                                                  return (
                                                    <div>
                                                      <Button
                                                        className="Signup-default"
                                                        onClick={() => {
                                                          this.showHandler2(
                                                            cmt.cmtid,
                                                            expense.value
                                                          );
                                                        }}
                                                        style={{
                                                          backgroundColor:
                                                            'rgb(228, 228, 228)',
                                                          border: 'none',
                                                          color: '#ff652f',
                                                          fontWeight: 'bolder',
                                                        }}
                                                      >
                                                        X
                                                      </Button>
                                                    </div>
                                                  );
                                                }

                                                return <p> </p>;
                                              })()}
                                            </li>
                                          </ul>
                                        ))}
                                        <div>
                                          <Modal
                                            show={popup2}
                                            onHide={this.closeHandler2}
                                          >
                                            <Modal.Header closeButton>
                                              <Modal.Title>
                                                Remove comment
                                              </Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body>
                                              Do you want to remove your
                                              comment?
                                            </Modal.Body>
                                            <Modal.Footer>
                                              <Button
                                                className="login-default"
                                                onClick={() =>
                                                  this.removecomment(
                                                    commentid,
                                                    expenseid
                                                  )
                                                }
                                              >
                                                √ Yes
                                              </Button>
                                              <Button
                                                className="Signup-default"
                                                onClick={this.closeHandler2}
                                              >
                                                x No
                                              </Button>
                                            </Modal.Footer>
                                          </Modal>
                                        </div>
                                        <div
                                          style={{
                                            float: 'bottom',
                                          }}
                                        >
                                          <Groupcomments
                                            // eslint-disable-next-line react/jsx-props-no-spreading
                                            {...this.props}
                                            addcomment={(val) => {
                                              this.addcomment(
                                                expense.value,
                                                val
                                              );
                                            }}
                                          />
                                        </div>
                                      </div>
                                    )}
                                  />{' '}
                                  <br />
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
    getgrpExpenses1: (gpname) => dispatch(getgrpExpenses(gpname)),
    getgrpsummaryExpenses1: (gpname) => dispatch(getgrpsummaryExpenses(gpname)),
    reset1: () => dispatch(reset()),
  };
}

function mapStateToProps(store) {
  console.log(store);
  return {
    username1: store.login.user.username,
    defaultcurrency: store.login.user.currencydef,
    activties: store.groups.activities,
    individuals: store.groups.individuals,
    summaries: store.groups.summaries,
  };
}

const Groupdetails = connect(
  mapStateToProps,
  mapDispatchToProps
)(Groupdetailscl);

Groupdetailscl.propTypes = {
  reset1: Proptypes.func,
  getgrpExpenses1: Proptypes.func,
  getgrpsummaryExpenses1: Proptypes.func,
  username1: Proptypes.string,
  errors: Proptypes.string,
  defaultcurrency: Proptypes.string,
  activties: Proptypes.instanceOf(Array),
  individuals: Proptypes.instanceOf(Array),
  summaries: Proptypes.instanceOf(Array),
};

Groupdetailscl.defaultProps = {
  reset1: () => {},
  getgrpExpenses1: () => {},
  getgrpsummaryExpenses1: () => {},
  defaultcurrency: '',
  errors: '',
  username1: '',
  activties: [],
  individuals: [],
  summaries: [],
  // gName: '',
};

export default Groupdetails;
