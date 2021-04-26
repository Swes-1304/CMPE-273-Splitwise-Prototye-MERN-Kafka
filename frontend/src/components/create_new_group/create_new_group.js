import React, { Component } from 'react';
import Select from 'react-select';
import '../../App.css';
import axios from 'axios';
import { Form, Image } from 'react-bootstrap';
import cookie from 'react-cookies';
import { connect } from 'react-redux';
import Proptypes from 'prop-types';
import { Redirect } from 'react-router';
import { uploadFile } from 'react-s3';
import Navheader from '../navbar/navbar';
import { createGroup, reset } from '../../actions/creategroupAction';
import '../navbar/navbar.css';
import backendServer from '../../webConfig';

class Createnewgroupcl extends Component {
  constructor(props) {
    super(props);
    // this.groupform = React.createRef();
    this.state = {
      selectUsername: [],
      groupname: '',
      groupmembers: [{ gmusername: '', gmemail: '' }],
      userid: '',
      grouphoto: null,
      updatedpic: false,
      token: localStorage.getItem('token'),
      redirecttogroup: null,
      setSelectedfile: null,
    };
    // Bind the handlers to this class
    this.groupnameChangeHandler = this.groupnameChangeHandler.bind(this);
    this.groupmembersChangeHandler = this.groupmembersChangeHandler.bind(this);
    this.groupphtochangeHandler = this.groupphtochangeHandler.bind(this);
    this.addgroupmember = this.addgroupmember.bind(this);
    this.removegroupmember = this.removegroupmember.bind(this);
    this.submitgroupcreate = this.submitgroupcreate.bind(this);
  }

  componentWillMount() {
    const { reset1 } = this.props;
    reset1();
    this.getuseroptions();
  }

  componentWillReceiveProps(nextProps) {
    const { iscreateSuccess } = this.props;
    const { groupname } = this.state;
    if (nextProps.iscreateSuccess !== iscreateSuccess) {
      // console.log(iscreateSuccess);
      if (nextProps.iscreateSuccess === 1) {
        const redirectVar1 = (
          <Redirect to={{ pathname: '/group', state: { gName: groupname } }} />
        );
        this.setState({
          redirecttogroup: redirectVar1,
        });
      }
    }
  }

  // get the list of all users part of application to be used for the dropdown selection except the current users
  getuseroptions = () => {
    const { token } = this.state;
    axios
      .get(`${backendServer}/getuseroptions/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'content-type': 'application/json',
        },
      })
      .then((response) => {
        const { data } = response;
        const usernametext = data.map((txt) => ({
          value: txt.email,
          label: `${txt.username}(${txt.email})`,
        }));
        // console.log(usernametext);
        // console.log(response.data);
        this.setState({ selectUsername: usernametext });
      })
      .catch((err) => console.log(err));
  };

  groupnameChangeHandler = (e) => {
    this.setState({
      groupname: e.target.value,
    });
  };

  groupmembersChangeHandler = (id, e) => {
    const { groupmembers } = this.state;
    const updatedList = [...groupmembers];
    updatedList[id].gmemail = e.value;
    updatedList[id].gmusername = e.label;
    console.log(updatedList);
    this.setState(updatedList);
  };

  groupphtochangeHandler = (e) => {
    const S3_BUCKET = 'splitwise-profilepictures';
    const REGION = 'us-east-1';
    const ACCESS_KEY = 'AKIAJSP2ZFMVUPCPOXLA';
    const SECRET_ACCESS_KEY = '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';

    const config = {
      bucketName: S3_BUCKET,
      region: REGION,
      accessKeyId: ACCESS_KEY,
      secretAccessKey: SECRET_ACCESS_KEY,
    };

    console.log(e.target.files[0]);
    console.log(e.target.files[0].name);
    this.setState({
      // profilephoto: e.target.files[0],
      setSelectedfile: e.target.files[0],
      updatedpic: true,
    });
    const { setSelectedfile } = this.state;
    console.log(setSelectedfile);
    uploadFile(e.target.files[0], config)
      .then((data) => {
        const loc = data.location;
        console.log(loc);
        this.setState({
          grouphoto: loc,
        });
      })
      .catch((err) => console.error(err));
  };

  addgroupmember = () => {
    this.setState((prevstate) => ({
      groupmembers: [
        ...prevstate.groupmembers,
        { gmusername: '', gmemail: '' },
      ],
    }));
  };

  removegroupmember = (id) => {
    const { groupmembers } = this.state;
    this.setState({
      groupmembers: groupmembers.filter((s) => s.gmemail !== id.gmemail),
    });
  };

  // create group with the memebers added
  submitgroupcreate = async (e) => {
    e.preventDefault();
    const {
      groupname,
      userid,
      grouphoto,
      updatedpic,
      groupmembers,
    } = this.state;
    const gplist = [];
    if (groupname === '') {
      alert('Please enter a group name');
      this.setState({
        errorMessage1: 'Please enter a group name!',
      });
      return;
    }
    for (let i = 0; i < groupmembers.length; i += 1) {
      if (groupmembers[i].gmemail === '') {
        alert('Please fill the username or email id');
        return;
      }
      gplist.push(groupmembers[i].gmemail);
    }
    console.log(gplist);

    let duplicateExist = false;
    duplicateExist = gplist.some(
      (element, index) => gplist.indexOf(element) !== index
    );

    if (duplicateExist) {
      alert('Please select unique group memebers!');
      this.setState({
        errorMessage: 'Please select unique group members!',
      });
      return;
    }
    const data = {
      groupname,
      userid,
      grouphoto,
      updatedpic,
      groupmembers,
      gplist,
    };

    const { createGroup1 } = this.props;
    createGroup1({ data });
    console.log(' create group  !');

    this.setState({
      updatedpic: false,
    });
  };

  render() {
    let redirectVar = null;
    if (!cookie.load('cookie')) {
      redirectVar = <Redirect to="/" />;
    }
    const { groupmembers } = this.state;
    const { errorMessage, errorMessage1 } = this.state;
    const { redirecttogroup } = this.state;
    const { selectUsername } = this.state;
    const { errors, username1, email1 } = this.props;
    const grouppic = '/Group_photos/default_avatar.png';
    return (
      <div>
        {redirectVar}
        <Navheader />

        <div className="profilepage-block">
          <section
            className=" createpage-blocksec"
            style={{
              float: 'left',
              width: '300px',
              height: '300px',
              'padding-left': '20px',
              'padding-top': '1px',
            }}
          >
            <div id="creategroup_avatar">
              <Image src={grouppic} className="grpavatar" alt="group pic" />
              <br />
              <label htmlFor="group_avatar">
                Change your group avatar <br />
                <input
                  type="file"
                  name="group_avatar"
                  id="group_avatar"
                  onChange={this.groupphtochangeHandler}
                />
              </label>
              <br />
            </div>
          </section>

          <section className="create-group-box">
            <section
              className="right-box"
              style={{
                float: 'right',
                width: '350px',
                'padding-left': '20px',
                'padding-top': '1px',
              }}
            >
              <Form ref={this.groupform} id="groupform" className="groupform">
                <div className="createnewgroup">
                  <h2>START A NEW GROUP</h2>
                  <div>
                    <h3>My group shall be called....</h3>
                    <input
                      type="text"
                      name="group_name"
                      id="group_name"
                      onChange={this.groupnameChangeHandler}
                      required
                    />
                  </div>
                  <p className="errmsg" style={{ color: 'maroon' }}>
                    {' '}
                    {errorMessage1}{' '}
                  </p>
                  <br />
                  <div className="group_members">
                    <div className="users">
                      <h2>Group members</h2>
                      <div className="group-member">
                        <div className="grpnameemail">
                          {username1}(<em>{email1}</em>)
                        </div>
                        {groupmembers.map((groupmember, id) => (
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
                              <Select
                                options={selectUsername}
                                className="div-select"
                                type="text"
                                value={{
                                  label: groupmember.gmusername,
                                  value: groupmember.gmemail,
                                }}
                                name={`group_members_${id + 1}_username`}
                                id={`group_members_${id + 1}_username`}
                                onChange={(e) =>
                                  this.groupmembersChangeHandler(id, e)
                                }
                                // autoComplete="off"
                                required
                              />
                            </div>
                            <button
                              type="button"
                              name="removegm"
                              onClick={() =>
                                this.removegroupmember(groupmember)
                              }
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
                        ))}
                        <button
                          type="button"
                          onClick={this.addgroupmember}
                          className="addgm"
                          style={{
                            'background-color': 'white',
                            color: '#3ac3ab',
                            border: 'none',
                            'font-weight': 'bolder',
                          }}
                        >
                          + Add Person
                        </button>
                      </div>
                    </div>
                    <div id="invite_link_container">
                      <div className="invitelink">
                        <p className="errmsg" style={{ color: 'maroon' }}>
                          {' '}
                          {errorMessage}{' '}
                        </p>
                        <div />
                        <p className="errmsg" style={{ color: 'maroon' }}>
                          {' '}
                          {errors}{' '}
                        </p>
                      </div>
                      <div className="savebtn">
                        <button
                          data-testid="Create"
                          type="button"
                          className="Signup-default"
                          onClick={this.submitgroupcreate}
                          formNoValidate
                        >
                          Save
                        </button>
                        {redirecttogroup}
                      </div>
                    </div>
                  </div>
                </div>
              </Form>
            </section>
          </section>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    createGroup1: (data) => dispatch(createGroup(data)),
    reset1: () => dispatch(reset()),
  };
}

function mapStateToProps(store) {
  console.log(store);
  return {
    profilepicstore: store.login.user.profilepic,
    username1: store.login.user.username,
    email1: store.login.user.email,
    errors: store.groups.error,
    iscreateSuccess: store.groups.createSuccess,
  };
}

const Createnewgroup = connect(
  mapStateToProps,
  mapDispatchToProps
)(Createnewgroupcl);

Createnewgroupcl.propTypes = {
  // profilepicstore: Proptypes.string,
  reset1: Proptypes.func,
  createGroup1: Proptypes.func,
  email1: Proptypes.string,
  errors: Proptypes.string,
  username1: Proptypes.string,
  iscreateSuccess: Proptypes.number,
};

Createnewgroupcl.defaultProps = {
  // profilepicstore: '',
  reset1: () => {},
  createGroup1: () => {},
  username1: '',
  email1: '',
  iscreateSuccess: 0,
  errors: '',
};

export default Createnewgroup;
