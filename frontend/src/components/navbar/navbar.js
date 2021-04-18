import React, { Component } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import { Link } from 'react-router-dom';
import cookie from 'react-cookies';
import { Image } from 'react-bootstrap';
import './navbar.css';
// #fb7a00

class Navheader extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogout = () => {
    cookie.remove('cookie', { path: '/' });
    sessionStorage.clear();
  };

  render() {
    let isloggedin = null;
    if (cookie.load('cookie')) {
      console.log('Able to read cookie');
      let profilepic = '/Profile_photos/default_avatar.png';
      const imagename = sessionStorage.getItem('profilepic');
      console.log(imagename);
      if (imagename !== 'null') {
        profilepic = `/Profile_photos/${imagename}`;
        console.log(profilepic);
      }
      isloggedin = (
        <ul className="nav navbar-nav navbar-right">
          <li>
            <Button className="Home-default" variant="default">
              <Link to="/dashboard"> Home </Link>
            </Button>
          </li>
          <li>
            <Image
              src={profilepic}
              className="avatar"
              alt="profile pic"
              roundedCircle
            />
          </li>
          <li>
            <Dropdown id="nav-dropdown" default>
              {sessionStorage.getItem('username')}
              <Dropdown.Toggle variant="default" />
              <Dropdown.Menu>
                <Dropdown.Item>
                  <Link
                    className="logout-class"
                    to="/"
                    onClick={this.handleLogout}
                  >
                    Logout
                  </Link>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </li>
        </ul>
      );
    } else {
      console.log('Not Able to read cookie');
      isloggedin = (
        <ul className="nav navbar-nav navbar-right">
          <li>
            <Button className="login-default">
              <Link to="/login">Login </Link>
            </Button>
            or{' '}
            <Button className="Signup-default">
              <Link to="/signup">Sign Up</Link>
            </Button>
          </li>
        </ul>
      );
    }
    return (
      <div>
        <Navbar className="navbar-default">
          <Navbar.Brand classname="Navbar-Brand" variant="light" href="/">
            <img
              src="/Group_Photos/Splitwiseicon.png"
              className="icon"
              alt="icon"
            />
            <span className="NavItem">Splitwise</span>
          </Navbar.Brand>
          <Navbar.Collapse className="justify-content-end">
            <Nav>{isloggedin}</Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
    );
  }
}
export default Navheader;
