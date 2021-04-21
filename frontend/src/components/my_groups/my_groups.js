import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router';
import cookie from 'react-cookies';
import Button from 'react-bootstrap/Button';
import { Modal } from 'react-bootstrap';
import isEmpty from 'lodash/isEmpty';
import { connect } from 'react-redux';
import Proptypes from 'prop-types';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import Navheader from '../navbar/navbar';
import Sidebarcomp from '../navbar/sidebar';
import { reset } from '../../actions/creategroupAction';
import { getGroups, getGroupInvites } from '../../actions/mygroupsAction';
import backendServer from '../../webConfig';
import '../navbar/navbar.css';
import '../dashboard/dashboard.css';
import './my_groups.css';

class Mygroupscl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: localStorage.getItem('token'),
      groupslist: [],
      invitelist: [],
      popup: false,
      gpselectoptions: [],
      selectedvalue: {},
      groupinvite: '',
    };

    // Bind the handlers to this class
    this.acceptinvitation = this.acceptinvitation.bind(this);
    this.denyinvitation = this.denyinvitation.bind(this);
    this.gpselectoptionshandler = this.gpselectoptionshandler.bind(this);
    this.gotogrouppage = this.gotogrouppage.bind(this);
    this.showHandler = this.showHandler.bind(this);
    this.closeHandler = this.closeHandler.bind(this);
  }

  componentWillMount() {
    this.getuserpgroups();
    this.getpgroupinvites();
    const { reset1 } = this.props;
    reset1();
  }

  componentWillReceiveProps(nextProps) {
    const { groupslist } = this.state;
    console.log('props', this.props);
    if (nextProps.groups !== groupslist) {
      this.setState({ groupslist: nextProps.groups });
      const arrayforselect = nextProps.groups.map((el) => ({
        value: el,
        label: el,
      }));
      console.log(arrayforselect);
      this.setState({
        gpselectoptions: arrayforselect,
      });
    }
  }

  showHandler = (grpname) => {
    this.setState({ popup: true, groupinvite: grpname });
  };

  closeHandler = () => {
    this.setState({ popup: false, groupinvite: '' });
  };

  getuserpgroups = () => {
    const { getGroups1 } = this.props;
    getGroups1();
    console.log(' user groups  !');
  };

  getpgroupinvites = () => {
    const { getGroupInvites1 } = this.props;
    getGroupInvites1();
    console.log(' user group invites  !');
  };

  acceptinvitation = () => {
    // e.preventDefault();
    // console.log(e.target.value);
    this.setState({ popup: false });
    const { popup, groupinvite, token } = this.state;
    // const currentgrp = groupinvite;
    const data = {
      currentgrp: groupinvite,
    };
    console.log(data, popup);
    axios
      .post(`${backendServer}/acceptinvitation`, data, {
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
          this.getuserpgroups();
          this.getpgroupinvites();
        } else {
          console.log(response.data);
          alert(response.data);
        }
      })
      .catch((err) => {
        console.log(err.response.data);
        alert(err.response.data);
      });
    this.setState({ groupinvite: '' });
  };

  denyinvitation = () => {
    // e.preventDefault();
    // console.log(e.target.value);
    this.setState({ popup: false });
    const { popup, userid, useremail, groupinvite, token } = this.state;
    // const currentgrp = groupname;
    const data = {
      currentgrp: groupinvite,
      userid,
      useremail,
    };
    console.log(data, popup);
    axios
      .post(`${backendServer}/denyinvitation`, data, {
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
          this.getuserpgroups(userid);
          this.getpgroupinvites(userid);
        } else {
          console.log(response.data);
          alert(response.data);
        }
      })
      .catch((err) => {
        console.log(err.response.data);
        alert(err.response.data);
      });
    this.setState({ groupinvite: '' });
  };

  gotogrouppage = (groupname, e) => {
    e.preventDefault();
    const redirectVar1 = (
      <Redirect to={{ pathname: '/group', state: { gName: groupname } }} />
    );
    this.setState({ redirecttopage: redirectVar1 });
  };

  gpselectoptionshandler = (e) => {
    // const { selectvalue } = this.state;
    const newarr = e.value;
    console.log(e.value);
    this.setState({ selectedvalue: newarr });
  };

  render() {
    let redirectVar = null;
    if (!cookie.load('cookie')) {
      redirectVar = <Redirect to="/" />;
    }
    const { redirecttopage } = this.state;
    const { groupslist, gpselectoptions, invitelist } = this.state;
    const { popup, selectedvalue, groupinvite } = this.state;
    const { errors, groups, groupinvites } = this.props;
    console.log(groupslist, invitelist, selectedvalue);
    let checkifinvitesnull = false;
    let checkifgroupsnull = false;
    if (isEmpty(groupinvites)) {
      checkifinvitesnull = true;
    }
    if (isEmpty(groups)) {
      checkifgroupsnull = true;
    }
    console.log(checkifinvitesnull, checkifgroupsnull);
    return (
      <div>
        {redirectVar}
        <Navheader />
        <div className="mygroups-flex">
          <Sidebarcomp />
          <div className="mygroups-box">
            <section className="mygroups-heading">
              <h1>My Groups Summary</h1>
              <ul className="button-right">
                <li>
                  <Button className="Signup-default">
                    <Link to="/createnewgroup">Create Group</Link>
                  </Button>
                </li>
              </ul>
            </section>

            <section className="mygroups-left-sec">
              <div className="mygroups-left-section-block">
                <div className="title">
                  <h6>Invitation Pending </h6>
                </div>
              </div>
              <div>
                {checkifinvitesnull ? (
                  <h7> NO INVITES PENDING!</h7>
                ) : (
                  <div>
                    {' '}
                    {groupinvites.map((groupname) => (
                      <ul className="mygroups-button">
                        <li>
                          <Button
                            className="Signup-default"
                            onClick={() => this.showHandler(groupname)}
                            style={{
                              height: '33px',
                              width: '350px',
                              'font-size': '17px',
                            }}
                          >
                            {groupname}
                          </Button>
                        </li>
                      </ul>
                    ))}
                    <Modal show={popup} onHide={this.closeHandler}>
                      <Modal.Header closeButton>
                        <Modal.Title>Group Invitation</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        Do you wish to accept the invitaion to join the group{' '}
                        <span>
                          <b>{groupinvite}</b>
                        </span>{' '}
                        or reject the invitation?
                      </Modal.Body>
                      <Modal.Footer>
                        <Button
                          className="login-default"
                          onClick={() => this.acceptinvitation()}
                        >
                          √ Accept
                        </Button>
                        <Button
                          className="Signup-default"
                          onClick={() => this.denyinvitation()}
                        >
                          x Reject
                        </Button>
                      </Modal.Footer>
                    </Modal>
                  </div>
                )}
              </div>
            </section>

            <section className="mygroups-center-sec">
              <div className="mygroups-center-section-block">
                <div className="title">
                  <h6>My Groups </h6>
                </div>
              </div>
              {checkifgroupsnull ? (
                <h7>
                  {' '}
                  <br />
                  YOU ARE NOT PART OF ANY GROUPS AS YET!
                </h7>
              ) : (
                <div>
                  {' '}
                  {groups.map((groupname) => (
                    <ul className="mygroups-button">
                      <li>
                        <Button
                          className="login-default"
                          size="lg"
                          onClick={(e) => this.gotogrouppage(groupname, e)}
                          style={{
                            height: '33px',
                            width: '350px',
                            'font-size': '17px',
                          }}
                        >
                          {groupname}
                        </Button>
                      </li>
                    </ul>
                  ))}
                </div>
              )}
            </section>
          </div>

          <div
            className="mygroups-right"
            style={{ width: '100px', display: 'flex', 'flex-direction': 'row' }}
          />
          <Select
            options={gpselectoptions}
            placeholder="GroupName"
            className="div-select"
            menuPlacement="auto"
            menuPosition="fixed"
            onChange={(e) => this.gpselectoptionshandler(e)}
          />
          <Button
            className="mygroups-default"
            onClick={(e) => this.gotogrouppage(selectedvalue, e)}
            style={{
              float: 'right',
              'background-color': '#68f7ce',
              'border-color': '#5bc5a7',
              color: 'black',
            }}
          >
            GO
          </Button>
          <p className="errmsg" style={{ color: 'maroon' }}>
            {' '}
            {errors}{' '}
          </p>
        </div>
        {redirecttopage}
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getGroups1: () => dispatch(getGroups()),
    getGroupInvites1: () => dispatch(getGroupInvites()),
    reset1: () => dispatch(reset()),
  };
}

function mapStateToProps(store) {
  console.log(store);
  return {
    username1: store.login.user.username,
    email1: store.login.user.email,
    groups: store.groups.groups,
    groupinvites: store.groups.groupinvites,
    errors: store.groups.error,
    isSuccess: store.groups.success,
  };
}

const Mygroups = connect(mapStateToProps, mapDispatchToProps)(Mygroupscl);

Mygroupscl.propTypes = {
  reset1: Proptypes.func,
  getGroups1: Proptypes.func,
  getGroupInvites1: Proptypes.func,
  errors: Proptypes.string,
  // isSuccess: Proptypes.number,
  // eslint-disable-next-line react/forbid-prop-types
  groups: Proptypes.array,
  // eslint-disable-next-line react/forbid-prop-types
  groupinvites: Proptypes.array,
};

Mygroupscl.defaultProps = {
  getGroups1: () => {},
  getGroupInvites1: () => {},
  reset1: () => {},
  // isSuccess: 0,
  errors: '',
  groups: [],
  groupinvites: [],
};

export default Mygroups;
