import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router';
import cookie from 'react-cookies';
import Button from 'react-bootstrap/Button';
import { Form, Image } from 'react-bootstrap';
import FormData from 'form-data';
import Navheader from '../navbar/navbar';

// import DefaultAvatar from '../../../public/Profile_photos/default_avatar.png'; // import DefaultAvatar from '../  Profile_photos/default_avatar.png';

import '../navbar/navbar.css';
import './profilepage.css';

class Profilepage extends Component {
  constructor(props) {
    super(props);
    this.profileform = React.createRef();
    this.state = {
      profilephoto: null,
      username: '',
      email: '',
      phonenumber: '',
      defaultcurrency: '',
      timezone: '',
      language: '',
      redirecttohome: null,
      userid: '',
      updatedpic: false,
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
    const userid1 = sessionStorage.getItem('userid');
    this.setState({
      userid: userid1,
    });
    this.getusercurrentdetails(userid1);
  }

  getusercurrentdetails = (userid) => {
    axios
      .get(`http://localhost:3001/getuserdetails/${userid}`, {
        headers: {
          'content-type': 'application/json',
        },
      })
      .then((response) => {
        console.log(response.data[0]);
        this.setState({
          email: response.data[0].email,
          profilephoto: response.data[0].profphoto,
          username: response.data[0].usersname,
          phonenumber: response.data[0].usersphone,
          defaultcurrency: response.data[0].currencydef,
          timezone: response.data[0].timezone,
          language: response.data[0].language,
        });
      })
      .catch((err) => console.log(err));
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
    this.setState({
      profilephoto: e.target.files[0],
      updatedpic: true,
    });
    console.log(e.target.files[0]);
    console.log(e.target.files[0].name);
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

  submitsave = (e) => {
    e.preventDefault();
    const {
      profilephoto,
      userid,
      defaultcurrency,
      timezone,
      language,
      updatedpic,
    } = this.state;
    const formdata = new FormData(this.profileform.current);
    if (updatedpic) {
      // const stream = fs.createReadStream(profilephoto.name);
      formdata.append('profile_avatar', profilephoto, profilephoto.name);
    } else {
      const imagename = sessionStorage.getItem('profilepic');
      formdata.append('profile_avatar', imagename);
    }
    formdata.append('idusers', userid);
    formdata.append('currencydef', defaultcurrency);
    formdata.append('timezone', timezone);
    formdata.append('language', language);
    // const formheaders = formdata.getHeaders();
    console.log(formdata);
    axios({
      method: 'post',
      url: 'http://localhost:3001/updateprofile',
      data: formdata,
      headers: {
        // eslint-disable-next-line no-underscore-dangle
        'content-type': `multipart/form-data; boundary=${formdata._boundary}`,
      },
    })
      .then((response) => {
        console.log('Status Code : ', response.status);
        if (response.status === 200) {
          console.log(response.data);
          sessionStorage.setItem('username', response.data.username);
          sessionStorage.setItem('useremail', response.data.email);
          sessionStorage.setItem('profilepic', response.data.profilephoto);
          sessionStorage.setItem(
            'defaultcurrency',
            response.data.defaultcurrency
          );
          this.getusercurrentdetails(userid);
          this.setState({
            updatedpic: false,
          });
          //const redirectVar1 = <Redirect to="/dashboard" />;
          //this.setState({ redirecttohome: redirectVar1 });
        } else {
          this.setState({
            redirecttohome: null,
          });
        }
      })
      .catch((err) => {
        console.log(err.response);
        alert(err.response.data);
        this.setState({
          errorMessage: err.response.data,
        });
        const { errorMessage } = this.state;
        console.log(errorMessage);
      });
  };

  render() {
    let redirectVar = null;
    if (!cookie.load('cookie')) {
      redirectVar = <Redirect to="/" />;
    }
    //const { redirecttohome } = this.state;
    let profilepic = '/Profile_photos/default_avatar.png';
    const {
      username,
      email,
      phonenumber,
      defaultcurrency,
      timezone,
      language,
    } = this.state;

    const imagename = sessionStorage.getItem('profilepic');
    console.log(imagename);
    if (imagename !== 'null') {
      profilepic = `/Profile_photos/${imagename}`;
      console.log(profilepic);
    }
    // if (profilephoto) profilepic = DefaultAvatar;
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

export default Profilepage;
