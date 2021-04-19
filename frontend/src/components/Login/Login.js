import React, { Component } from 'react';
import Proptypes from 'prop-types';
import '../../App.css';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import { userLogin, reset } from '../../actions/loginAction';
import Navheader from '../navbar/navbar';
import '../navbar/navbar.css';

// Define a Login Component
class Logincl extends Component {
  // call the constructor method
  constructor(props) {
    // Call the constrictor of Super class i.e The Component
    super(props);
    // maintain the state required for this component
    this.state = {
      email: '',
      password: '',
    };
    // Bind the handlers to this class
    this.emailChangeHandler = this.emailChangeHandler.bind(this);
    this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
    this.submitLogin = this.submitLogin.bind(this);
    this.handleRedirect = this.handleRedirect.bind(this);
  }

  componentWillMount() {
    this.setState({
      // verifyauth: false,
      redirecttohome: null,
    });
    const { reset1 } = this.props;
    reset1();

    // sessionStorage.clear();
  }

  handleRedirect = () => {
    console.log('handle redirect ');
    return <Redirect to="/dashboard" />;
  };

  // username change handler to update state variable with the text entered by the user
  emailChangeHandler = (e) => {
    /* console.log(this.props);
    const { emailChange1 } = this.props;
    emailChange1(e.target.value); */
    this.setState({
      email: e.target.value,
    });
  };

  // password change handler to update state variable with the text entered by the user
  passwordChangeHandler = (e) => {
    this.setState({
      password: e.target.value,
    });
  };

  // submit Login handler to send a request to the node backend
  submitLogin = async (e) => {
    // prevent page from refresh
    e.preventDefault();
    const { email, password } = this.state;
    if (email === '') {
      alert('Please enter email address');
      this.setState({
        errorMessage1: 'Please enter email address!',
      });
      return;
    }
    if (password === '') {
      alert('Please enter a password');
      this.setState({
        errorMessage2: 'Please enter a password!',
      });
      return;
    }
    // const { history } = this.props;
    const data = {
      email,
      password,
    };
    const { userLogin1 } = this.props;
    userLogin1({ data });
    console.log(' userlogin submit !');
    const { isloggedin } = this.props;
    console.log(isloggedin);
    if (isloggedin === 'true') {
      this.handleRedirect();
    }
  };

  render() {
    let redirectVar = null;
    if (cookie.load('cookie')) {
      redirectVar = <Redirect to="/dashboard" />;
    }
    const { errorMessage, errorMessage1, errorMessage2 } = this.state;
    const { redirecttohome } = this.state;
    const { errors } = this.props;
    return (
      <div>
        {redirectVar}
        {redirecttohome}
        <Navheader />
        <div className="container">
          <div className="login-form">
            <div className="main-div">
              <div className="panel">
                <h2>WELCOME TO SPLITWISE!</h2>
              </div>
              <div className="form-group">
                <label htmlFor="email">
                  EMAIL ADDRESS
                  <br />
                  <input
                    type="text"
                    className="form-control"
                    name="email"
                    id="email"
                    placeholder="Email"
                    onChange={this.emailChangeHandler}
                    required
                    formNoValidate
                  />
                </label>
                <p className="errmsg" style={{ color: 'maroon' }}>
                  {' '}
                  {errorMessage1}{' '}
                </p>
              </div>
              <br />
              <div className="form-group">
                <label htmlFor="email">
                  PASSSWORD
                  <br />
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    id="password"
                    placeholder="Password"
                    onChange={this.passwordChangeHandler}
                    required
                    formNoValidate
                  />
                </label>
                <p className="errmsg" style={{ color: 'maroon' }}>
                  {' '}
                  {errorMessage2}{' '}
                </p>
              </div>
              <br />
              <button
                data-testid="login"
                type="submit"
                className="login-default "
                onClick={this.submitLogin}
                formNoValidate
              >
                Login
              </button>
              <p className="errmsg" style={{ color: 'maroon' }}>
                {' '}
                {errorMessage}{' '}
              </p>
              <p className="errmsg" style={{ color: 'maroon' }}>
                {' '}
                {errors}{' '}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    userLogin1: (data) => dispatch(userLogin(data)),
    reset1: () => dispatch(reset()),
  };
}

function mapStateToProps(store) {
  return {
    isloggedin: store.login.islogged,
    errors: store.login.error,
  };
}

const Login = connect(mapStateToProps, mapDispatchToProps)(Logincl);

Logincl.propTypes = {
  userLogin1: Proptypes.func,
  isloggedin: Proptypes.string,
  errors: Proptypes.string,
  reset1: Proptypes.func,
};

Logincl.defaultProps = {
  userLogin1: () => {},
  isloggedin: 'false',
  errors: '',
  reset1: () => {},
};
export default Login;
