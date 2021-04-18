import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import Navheader from '../navbar/navbar';
import '../navbar/navbar.css';

// Define a Login Component
class Login extends Component {
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
  }

  componentWillMount() {
    this.setState({
      redirecttohome: null,
    });
  }

  // username change handler to update state variable with the text entered by the user
  emailChangeHandler = (e) => {
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
    const data = {
      email,
      password,
    };
    this.setState({
      errorMessage1: '',
    });
    // set the with credentials to true
    axios.defaults.withCredentials = true;
    // make a post request with the user data
    axios
      .post('http://localhost:3001/login', data)
      .then((response) => {
        console.log('Status Code : ', response.status);
        console.log('response ', response.data);
        if (response.status === 200) {
          console.log(response.data);
          console.log(response.data.username);
          const resuserid = response.data.user_id;
          const resusername = response.data.username;
          const resemail = response.data.email;
          const resprofpic = response.data.profilepic;
          const rescurrency = response.data.currencydef;
          sessionStorage.setItem('userid', resuserid);
          sessionStorage.setItem('username', resusername);
          sessionStorage.setItem('useremail', resemail);
          sessionStorage.setItem('profilepic', resprofpic);
          sessionStorage.setItem('defaultcurrency', rescurrency);
          const redirectVar1 = <Redirect to="/dashboard" />;
          this.setState({
            redirecttohome: redirectVar1,
          });
        } else {
          console.log(response.data);
          alert(response.data);
          this.setState({
            redirecttohome: null,
          });
        }
      })
      .catch((err) => {
        console.log(err.response.data);
        alert(err.response.data);
        this.setState({
          errorMessage: err.response.data,
        });
      });
  };

  render() {
    let redirectVar = null;
    if (cookie.load('cookie')) {
      redirectVar = <Redirect to="/dashboard" />;
    }
    const { errorMessage, errorMessage1 } = this.state;
    const { redirecttohome } = this.state;
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
              <div className="form-group">
                <label htmlFor="email">
                  PASSSWORD
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
              </div>
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
            </div>
          </div>
        </div>
      </div>
    );
  }
}
// export Login Component
export default Login;
