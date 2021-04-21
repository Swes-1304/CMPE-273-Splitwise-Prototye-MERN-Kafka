import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import Proptypes from 'prop-types';
import cookie from 'react-cookies';
import Button from 'react-bootstrap/Button';
import { Form, Image } from 'react-bootstrap';
import { uploadFile } from 'react-s3';
import { reset } from '../../actions/loginAction';
import { updateProfile } from '../../actions/updateProfileAction';
// import FormData from 'form-data';
import Navheader from '../navbar/navbar';
import backendServer from '../../webConfig';

import '../navbar/navbar.css';
import './profilepage.css';

class Profilepagecl extends Component {
  constructor(props) {
    super(props);

    // this.profileform = React.createRef();
    this.state = {
      token: localStorage.getItem('token'),
      profilephoto: null,
      username: '',
      email: '',
      phonenumber: '',
      defaultcurrency: '',
      timezone: '',
      language: '',
      redirecttohome: null,
      updatedpic: false,
      setSelectedfile: null,
      usernameerrors: '',
      emailerrors: '',
      phoneerrors: '',
    };

    // Bind the handlers to this class
    this.usrchangeHandler = this.usrchangeHandler.bind(this);
    this.emailChangeHandler = this.emailChangeHandler.bind(this);
    this.phonenumberChangeHandler = this.phonenumberChangeHandler.bind(this);
    this.profilephtochangeHandler = this.profilephtochangeHandler.bind(this);
    this.defaultcurrencychangeHandler = this.defaultcurrencychangeHandler.bind(
      this
    );
    this.timezonechangeHandler = this.timezonechangeHandler.bind(this);
    this.languagechangeHandler = this.languagechangeHandler.bind(this);
    this.submitsave = this.submitsave.bind(this);
  }

  componentDidMount() {
    this.getusercurrentdetails();
    const { reset1 } = this.props;
    reset1();
  }

  getusercurrentdetails = () => {
    const { token } = this.state;
    console.log(token);
    axios
      .get(`${backendServer}/getuserdetails/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'content-type': 'application/json',
        },
      })
      .then((response) => {
        console.log(response);
        this.setState({
          email: response.data.email,
          profilephoto: response.data.profphoto,
          username: response.data.usersname,
          phonenumber: response.data.usersphone,
          defaultcurrency: response.data.currencydef,
          timezone: response.data.timezone,
          language: response.data.language,
        });
      })
      .catch((err) => {
        if (err.response.status === 401) {
          alert(' Unauthorized request ');
          console.log(err);
        } else {
          console.log(err);
          alert(err);
        }
      });
  };

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

  phonenumberChangeHandler = (e) => {
    this.setState({
      phonenumber: e.target.value,
    });
  };

  profilephtochangeHandler = (e) => {
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
          profilephoto: loc,
        });
      })
      .catch((err) => console.error(err));
  };

  defaultcurrencychangeHandler = (e) => {
    this.setState({
      defaultcurrency: e.target.value,
    });
  };

  timezonechangeHandler = (e) => {
    this.setState({
      timezone: e.target.value,
    });
  };

  languagechangeHandler = (e) => {
    this.setState({
      language: e.target.value,
    });
  };

  isformvalid = () => {
    let formisvalid = true;
    const formerrors = {
      usernameerrors: '',
      emailerrors: '',
      phoneerrors: '',
    };

    const emailpattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z]{2,4})$/;
    const phnpattern = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;

    const { username, email, phonenumber } = this.state;

    if (username.length === 0) {
      formisvalid = false;
      formerrors.usernameerrors = 'Username cannot be blank!';
      console.log(formerrors.usernameerrors);
    }

    if (!emailpattern.test(email)) {
      formisvalid = false;
      if (email.length === 0) {
        formerrors.emailerrors = 'Email address cannot be blank!';
      } else {
        formerrors.emailerrors = 'Email ID is not Valid!';
      }
      console.log(formerrors.emailerrors);
    }
    if (!phnpattern.test(phonenumber) && phonenumber.length > 0) {
      formisvalid = false;
      formerrors.phoneerrors = 'Phone Number is not valid!';
      console.log(formerrors.phoneerrors);
    }
    this.setState((prevstate) => ({
      ...prevstate,
      ...formerrors,
    }));
    return formisvalid;
  };

  submitsave = (e) => {
    e.preventDefault();
    // const { token } = this.state;
    const {
      profilephoto,
      defaultcurrency,
      timezone,
      language,
      updatedpic,
      phonenumber,
      email,
      username,
    } = this.state;
    const data = {
      profilephoto,
      defaultcurrency,
      timezone,
      language,
      updatedpic,
      phonenumber,
      email,
      username,
    };

    const formisvalidated = this.isformvalid();
    console.log(formisvalidated);
    if (formisvalidated) {
      const { updateProfile1 } = this.props;
      updateProfile1({ data });
      console.log(' userupdate  !');
      // this.getusercurrentdetails();
      this.setState({
        updatedpic: false,
      });
    }
  };

  render() {
    let redirectVar = null;
    if (!cookie.load('cookie')) {
      redirectVar = <Redirect to="/" />;
    }
    const {
      username,
      email,
      phonenumber,
      defaultcurrency,
      timezone,
      language,
    } = this.state;
    const { redirecttohome } = this.state;
    const { usernameerrors, emailerrors, phoneerrors } = this.state;
    const { errors } = this.props;
    console.log(redirecttohome);
    let profilepic;
    const { profilepicstore } = this.props;
    console.log(profilepicstore);
    const imagename = profilepicstore;
    console.log(imagename);
    if (imagename === 'null' || imagename === '' || imagename === ' ') {
      profilepic = '/Profile_photos/default_avatar.png';
      console.log(profilepic);
    } else {
      profilepic = imagename;
      console.log(profilepic);
    }

    return (
      <div>
        {redirectVar}
        <Navheader />
        <div className="profilepage-block">
          <h2> Your account </h2>
          <section>
            <div className="avatar-div">
              <Image src={profilepic} className="avatar1" alt="profile pic" />
              <br />
              <label htmlFor="profile_avatar">
                Change your avatar <br />
                <input
                  type="file"
                  name="profile_avatar"
                  id="profile_avatar"
                  onChange={this.profilephtochangeHandler}
                />
              </label>
            </div>
          </section>

          <section>
            <Form
              ref={this.profileform}
              id="profileform"
              className="profileform"
            >
              <section className="center-block">
                <div className="basic_div">
                  <label htmlFor="username">
                    Your name <br />
                    <input
                      type="text"
                      name="username"
                      id="username"
                      defaultValue={username}
                      onChange={this.usrchangeHandler}
                    />
                  </label>
                  {usernameerrors && (
                    <span className="errmsg" style={{ color: 'maroon' }}>
                      {' '}
                      {usernameerrors}{' '}
                    </span>
                  )}
                  <br />
                  <br />
                  <label htmlFor="email">
                    Your email address <br />
                    <input
                      type="email"
                      name="email"
                      id="email"
                      defaultValue={email}
                      onChange={this.emailChangeHandler}
                    />
                  </label>

                  <br />
                  <br />
                  <label htmlFor="phonenumber">
                    Your phone number <br />
                    <input
                      type="text"
                      name="phonenumber"
                      id="phonenumber"
                      defaultValue={phonenumber}
                      onChange={this.phonenumberChangeHandler}
                    />
                  </label>
                </div>
                {usernameerrors && (
                  <span className="errmsg" style={{ color: 'maroon' }}>
                    {' '}
                    {usernameerrors}{' '}
                  </span>
                )}
                {emailerrors && (
                  <span className="errmsg" style={{ color: 'maroon' }}>
                    {' '}
                    {emailerrors}{' '}
                  </span>
                )}
                {phoneerrors && (
                  <span className="errmsg" style={{ color: 'maroon' }}>
                    {' '}
                    {phoneerrors}{' '}
                  </span>
                )}
              </section>

              <section className="right-block">
                <div className="default_div">
                  <Form.Group controlId="defaultcurrency">
                    <Form.Label>Your default currency</Form.Label>
                    <Form.Control
                      as="select"
                      value={defaultcurrency}
                      placeholder={defaultcurrency}
                      onChange={this.defaultcurrencychangeHandler}
                    >
                      <option value="BHD (BD)">BHD (BD)</option>
                      <option value="CAD (C$)">CAD (C$)</option>
                      <option value="EUR (€)">EUR (€)</option>
                      <option value="GBP (£)">GBP (£)</option>
                      <option value="KWD (KWD)">KWD (KWD)</option>
                      <option value="USD ($)">USD ($)</option>
                    </Form.Control>
                  </Form.Group>
                  <br />
                  <Form.Group controlId="timezone">
                    <Form.Label>TimeZone</Form.Label>
                    <Form.Control
                      as="select"
                      value={timezone}
                      onChange={this.timezonechangeHandler}
                    >
                      <option>(GMT -12:00) Eniwetok, Kwajalein</option>
                      <option>(GMT -11:00) Midway Island, Samoa</option>
                      <option>(GMT -10:00) Hawaii</option>
                      <option>(GMT -9:00) Alaska</option>
                      <option>(GMT -8:00) Pacific Time (US & Canada)</option>
                      <option>(GMT -7:00) Mountain Time (US & Canada)</option>
                      <option>
                        (GMT -6:00) Central Time (US & Canada), Mexico City
                      </option>
                      <option>
                        (GMT -5:00) Eastern Time (US & Canada), Bogota, Lima
                      </option>
                      <option>
                        (GMT -4:00) Atlantic Time (Canada), Caracas, La Paz
                      </option>
                      <option>
                        (GMT -3:00) Brazil, Buenos Aires, Georgetown
                      </option>
                      <option>(GMT -2:00) Mid-Atlantic</option>
                      <option>(GMT -1:00) Azores, Cape Verde Islands</option>
                      <option>
                        (GMT) Western Europe Time, London, Lisbon, Casablanca
                      </option>
                      <option>
                        (GMT +1:00) Brussels, Copenhagen, Madrid, Paris
                      </option>
                      <option>(GMT +2:00) Kaliningrad, South Africa</option>
                      <option>
                        (GMT +3:00) Baghdad, Riyadh, Moscow, St. Petersburg
                      </option>
                      <option>
                        (GMT +4:00) Abu Dhabi, Muscat, Baku, Tbilisi
                      </option>
                      <option>
                        (GMT +5:30) Bombay, Calcutta, Madras, New Delhi
                      </option>
                      <option>(GMT +6:00) Almaty, Dhaka, Colombo</option>
                      <option>(GMT +7:00) Bangkok, Hanoi, Jakarta</option>
                      <option>
                        (GMT +8:00) Beijing, Perth, Singapore, Hong Kong
                      </option>
                      <option>
                        (GMT +9:00) Tokyo, Seoul, Osaka, Sapporo, Yakutsk
                      </option>
                      <option>
                        (GMT +10:00) Eastern Australia, Guam, Vladivostok
                      </option>
                      <option>
                        (GMT +11:00) Magadan, Solomon Islands, New Caledonia
                      </option>
                      <option>
                        (GMT +12:00) Auckland, Wellington, Fiji, Kamchatka
                      </option>
                    </Form.Control>
                  </Form.Group>
                  <br />
                  <Form.Group controlId="language">
                    <Form.Label>Language</Form.Label>
                    <Form.Control
                      as="select"
                      value={language}
                      onChange={this.languagechangeHandler}
                    >
                      <option>English</option>
                      <option>Deutsch</option>
                      <option>Italiano</option>
                      <option>Nederlands</option>
                      <option>Svenska</option>
                    </Form.Control>
                  </Form.Group>
                </div>
                <p className="errmsg" style={{ color: 'maroon' }}>
                  {' '}
                  {errors}{' '}
                </p>
                <div className="savebtn" data-testid="Saveupdates">
                  <Button className="Signup-default" onClick={this.submitsave}>
                    Save
                  </Button>
                </div>
              </section>
            </Form>
          </section>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    updateProfile1: (data) => dispatch(updateProfile(data)),
    reset1: () => dispatch(reset()),
    // userLogin1: (data) => dispatch(userLogin(data)),
  };
}

function mapStateToProps(store) {
  console.log(store);
  return {
    profilepicstore: store.login.user.profilepic,
    username1: store.login.user.username,
    errors: store.login.error,
  };
}

const Profilepage = connect(mapStateToProps, mapDispatchToProps)(Profilepagecl);

Profilepagecl.propTypes = {
  profilepicstore: Proptypes.string,
  reset1: Proptypes.func,
  updateProfile1: Proptypes.func,
  errors: Proptypes.string,
};

Profilepagecl.defaultProps = {
  profilepicstore: '',
  reset1: () => {},
  updateProfile1: () => {},
  // username1: '',
  // isloggedin: 'false',
  errors: '',
};

export default Profilepage;
