import React, { Component } from 'react';
import '../../App.css';
// import bcrypt from 'bcryptjs';
import Proptypes from 'prop-types';
import cookie from 'react-cookies';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { userSignup } from '../../actions/signupAction';
import { reset } from '../../actions/loginAction';
import Navheader from '../navbar/navbar';
import '../navbar/navbar.css';

// const saltRounds = 10;

class Signupcl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      password: '',
      usernameerrors: '',
      emailerrors: '',
      passworderrors: '',
      redirecttohome: null,
    };

    // Bind the handlers to this class
    this.usrchangeHandler = this.usrchangeHandler.bind(this);
    this.emailChangeHandler = this.emailChangeHandler.bind(this);
    this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
    this.submitsignup = this.submitsignup.bind(this);
    // this.handleRedirect = this.handleRedirect.bind(this);
  }

  componentWillMount() {
    this.setState({
      // verifyauth: false,
      redirecttohome: null,
    });
    const { reset1 } = this.props;
    reset1();
  }

  componentWillReceiveProps(nextProps) {
    const { isloggedin } = this.props;
    if (nextProps.isloggedin !== isloggedin) {
      console.log(isloggedin);
      if (nextProps.isloggedin === 'true') {
        const redirectVar1 = <Redirect to="/dashboard" />;
        this.setState({
          redirecttohome: redirectVar1,
        });
      }
    }
  }

  usrchangeHandler = (e) => {
    this.setState({
      username: e.target.value,
    });
  };

  emailChangeHandler = (e) => {
    this.setState({
      email: e.target.value,
    });
  };

  passwordChangeHandler = (e) => {
    this.setState({
      password: e.target.value,
    });
  };

  isformvalid = () => {
    let formisvalid = true;
    const signuperrors = {
      usernameerrors: '',
      emailerrors: '',
      passworderrors: '',
    };

    const emailpattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z]{2,4})$/;
    const pwdpattern = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,50}$/;

    const { username, email, password } = this.state;

    if (username.length === 0) {
      formisvalid = false;
      signuperrors.usernameerrors = 'Username cannot be blank!';
      console.log(signuperrors.usernameerrors);
    }

    if (!emailpattern.test(email)) {
      formisvalid = false;
      if (email.length === 0) {
        signuperrors.emailerrors = 'Email address cannot be blank!';
      } else {
        signuperrors.emailerrors = 'Email ID is not Valid!';
      }
      console.log(signuperrors.emailerrors);
    }
    if (!pwdpattern.test(password)) {
      formisvalid = false;
      signuperrors.passworderrors =
        'Password is not valid and must contain minimum 8 characters with a numeric, special character , lower and upper case letters!';
      console.log(signuperrors.passworderrors);
    }
    this.setState((prevstate) => ({
      ...prevstate,
      ...signuperrors,
    }));

    console.log(
      formisvalid,
      signuperrors.usernameerrors,
      signuperrors.emailerrors,
      signuperrors.passworderrors
    );
    return formisvalid;
  };

  // submit Login handler to send a request to the node backend
  submitsignup = async (e) => {
    // prevent page from refresh
    e.preventDefault();
    const formisvalidated = this.isformvalid();
    console.log(formisvalidated);
    if (formisvalidated) {
      const { username, email, password } = this.state;
      const data = {
        username,
        email,
        password,
      };
      const { userSignup1 } = this.props;
      userSignup1({ data });
      console.log(' usersignup submit !');
    }
  };

  render() {
    let redirectVar = null;
    if (cookie.load('cookie')) {
      redirectVar = <Redirect to="/dashboard" />;
    }
    const { usernameerrors, emailerrors, passworderrors } = this.state;
    const { redirecttohome } = this.state;
    const { errors } = this.props;
    return (
      <form>
        <div>
          <Navheader />
          <div className="container">
            {redirectVar}
            {redirecttohome}
            <div className="signup-form">
              <div className="main-div">
                <div className="panel">
                  <h2>Welcome to Splitwise!</h2>
                  <br />
                  <br />
                  <h3>INTRODUCE YOURSELF</h3>
                  <br />
                  <br />
                </div>
                <div className="form-group">
                  <label htmlFor="username">
                    Hi there! My name is
                    <br />
                    <input
                      type="text"
                      onChange={this.usrchangeHandler}
                      className="form-control"
                      name="username"
                      placeholder="Username"
                      required
                      formNoValidate
                    />
                  </label>
                  <br />
                  {usernameerrors && (
                    <span className="errmsg" style={{ color: 'maroon' }}>
                      {' '}
                      {usernameerrors}{' '}
                    </span>
                  )}
                </div>
                <br />
                <div className="form-group">
                  <label htmlFor="username">
                    Here’s my email address:
                    <br />
                    <input
                      type="text"
                      onChange={this.emailChangeHandler}
                      className="form-control"
                      name="email"
                      placeholder="Email Address"
                      required
                      formNoValidate
                    />
                  </label>
                  <br />
                  {emailerrors && (
                    <span className="errmsg" style={{ color: 'maroon' }}>
                      {' '}
                      {emailerrors}{' '}
                    </span>
                  )}
                </div>
                <br />
                <div className="form-group">
                  <label htmlFor="username">
                    And here’s my password:
                    <br />
                    <input
                      type="password"
                      onChange={this.passwordChangeHandler}
                      className="form-control"
                      name="password"
                      placeholder="Password"
                      required
                      formNoValidate
                    />
                  </label>
                  <br />
                  {passworderrors && (
                    <span className="errmsg" style={{ color: 'maroon' }}>
                      {' '}
                      {passworderrors}{' '}
                    </span>
                  )}
                </div>
                <br />
                <button
                  type="submit"
                  onClick={this.submitsignup}
                  className="Signup-default"
                  formNoValidate
                >
                  Sign Up
                </button>
                <p className="errmsg" style={{ color: 'maroon' }}>
                  {' '}
                  {errors}{' '}
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    userSignup1: (data) => dispatch(userSignup(data)),
    reset1: () => dispatch(reset()),
  };
}

function mapStateToProps(store) {
  return {
    isloggedin: store.login.islogged,
    errors: store.login.error,
  };
}

Signupcl.propTypes = {
  userSignup1: Proptypes.func,
  isloggedin: Proptypes.string,
  errors: Proptypes.string,
  reset1: Proptypes.func,
};

Signupcl.defaultProps = {
  userSignup1: () => {},
  isloggedin: 'false',
  errors: '',
  reset1: () => {},
};

const Signup = connect(mapStateToProps, mapDispatchToProps)(Signupcl);

// export Signup Component
export default Signup;
