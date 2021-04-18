import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import './navbar.css';

class Sidebarcomp extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="sidebar">
        <Nav className="flex-column">
          <div className="sidebar-wrapper">
            <ul className="navlist">
              <li className="nav-item">
                <li className="nav-item1">
                  <NavLink
                    className="nav-link1"
                    to="/dashboard"
                    style={{ color: 'inherit', textDecoration: 'none' }}
                  />
                </li>{' '}
                <hr />
                <NavLink className="nav-link1" to="/dashboard">
                  Dashboard
                </NavLink>
              </li>
              <hr />
              <li className="nav-item1">
                <NavLink className="nav-link1" to="/recentactivity">
                  Recent Acitivity
                </NavLink>
              </li>
              <hr />
              <li className="nav-item1">
                <NavLink className="nav-link1" to="/profile">
                  My Profile
                </NavLink>
              </li>
              <hr />
              <li className="nav-item1">
                <NavLink className="nav-link1" to="/mygroups">
                  My Groups
                </NavLink>
              </li>
              <li>
                <NavLink to="/createnewgroup" className="nav-link2">
                  + Add
                </NavLink>
              </li>{' '}
              <hr />
            </ul>
          </div>
        </Nav>
      </div>
    );
  }
}

export default Sidebarcomp;
