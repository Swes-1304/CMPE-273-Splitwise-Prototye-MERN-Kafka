import React, { Component } from 'react';
import cookie from 'react-cookies';
import axios from 'axios';
import { Redirect } from 'react-router';
// import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import numeral from 'numeral';
import { Dropdown } from 'react-bootstrap';
import Select from 'react-select';
// import { Row, Col, Container, Jumbotron } from 'react-bootstrap';
import { isEmpty } from 'lodash';
import Sidebarcomp from '../navbar/sidebar';
import Navheader from '../navbar/navbar';
import '../navbar/navbar.css';
import '../dashboard/dashboard.css';
import './recent_activity.css';

class Recentactivity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userid: '',
      recent: [],
      recentsetlle: [],
      groupslist: [],
      gpselectoptions: [],
      selectedvalue: [],
      asc: false,
      desc: true,
    };
    this.sorthandlerasc = this.sorthandlerasc.bind(this);
    this.sorthandlerdesc = this.sorthandlerdesc.bind(this);
    // this.getrecentacitvities = this.getrecentacitvities.bind(this);
  }

  componentWillMount() {
    const userid1 = sessionStorage.getItem('userid');
    const recentacitvity1 = this.getrecentacitvities(userid1);
    const getuserpgroups = this.getuserpgroups(userid1);
    this.setState({
      userid: userid1,
      recent: recentacitvity1,
      groupslist: getuserpgroups,
    });
  }

  getuserpgroups = (userid) => {
    axios
      .get(`http://localhost:3001/getuserpgroups/${userid}`, {
        headers: {
          'content-type': 'application/json',
        },
      })
      .then((response) => {
        console.log(response.data);
        console.log(typeof response.data);
        const newaar = response.data.map((el) => el.gpname);
        console.log(newaar);
        const { data } = response;
        const arrayforselect = data.map((el) => ({
          value: el.gpname,
          label: el.gpname,
        }));
        console.log(arrayforselect);
        this.setState({
          groupslist: newaar,
          gpselectoptions: arrayforselect,
        });
        const { gpselectoptions } = this.state;
        const obj = { value: 'All Groups', label: 'All Groups' };
        this.setState({
          gpselectoptions: [...gpselectoptions, obj],
        });
        console.log(gpselectoptions);
      })
      .catch((err) => console.log(err));
  };

  sorthandlerasc = () => {
    const { recent, asc, desc } = this.state;
    console.log(recent);
    if (asc === false && desc === true) {
      const sortasc = (recent1) => (key) =>
        [...recent1].sort(
          (intitial, next) =>
            new Date(intitial[key]).getTime() - new Date(next[key]).getTime()
        );
      // .reverse();

      const ascsort = sortasc(recent)('date1');
      this.setState({
        recent: ascsort,
        asc: true,
        desc: false,
      });
    }
  };

  sorthandlerdesc = () => {
    const { recent, asc, desc } = this.state;
    console.log(recent);
    if (asc === true && desc === false) {
      const sortadesc = (recent1) => (key) =>
        [...recent1]
          .sort(
            (intitial, next) =>
              new Date(intitial[key]).getTime() - new Date(next[key]).getTime()
          )
          .reverse();

      const descsort = sortadesc(recent)('date1');
      this.setState({
        recent: descsort,
        asc: false,
        desc: true,
      });
    }
  };

  gpselectoptionshandler = (e) => {
    // const { selectvalue } = this.state;
    const newarr = e.value;
    console.log(e.value);
    this.setState({ selectedvalue: newarr });
  };

  displayresults = (groupname) => {
    const { recent } = this.state;
    console.log(recent);
    console.log(groupname);
    const filtergrp = (recent1) => (key) =>
      [...recent1].filter((grp1) => grp1[key] === groupname);

    const filtergrps = filtergrp(recent)('gpname');
    console.log(filtergrps);
    this.setState({
      recent: filtergrps,
    });
  };

  getrecentacitvities = (gpname) => {
    axios
      .get(`http://localhost:3001/getrecentacitvities/${gpname}`, {
        headers: {
          'content-type': 'application/json',
        },
      })
      .then((response) => {
        console.log(response.data);
        console.log(typeof response.data);
        // const { data } = response;
        const data1 = response.data[0];
        const data2 = response.data[1];
        let mergedata1anddata2 = [];
        // console.log(data);
        console.log(data1);
        console.log(data2);
        const defaultcurr = sessionStorage.getItem('defaultcurrency');
        console.log(defaultcurr);
        const regExp = /\(([^)]+)\)/;
        const getvalue = regExp.exec(defaultcurr);
        const symbolvalue = getvalue[1];
        /* const date = new Date('2013-03-10T02:00:00Z');
        console.log(
          `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
        );
        console.log(
          `${new Date('2013-03-10T02:00:00Z').getFullYear()}-${
            new Date('2013-03-10T02:00:00Z').getMonth() + 1
          }-${new Date('2013-03-10T02:00:00Z').getDate()}`
        );
        const defaultcurr = sessionStorage.getItem('defaultcurrency');
        console.log(defaultcurr);
        const regExp = /\(([^)]+)\)/;
        const getvalue = regExp.exec(defaultcurr);
        const symbolvalue = getvalue[1];
        const arrayofrecentactivities = data.map((el) => ({
          paid: el.usersname,
          gpname: el.gpname,
          descp: el.tdescription,
          amnt: symbolvalue + numeral(el.tamount).format('0,0.00'),
          date1: el.tdate,
          formatedmonth: new Date(el.tdate).toLocaleString('default', {
            month: 'short',
          }),
          formatedday: new Date(el.tdate).getUTCDate(),
        }));
        console.log(arrayofrecentactivities);
        this.setState({
          recent: arrayofrecentactivities,
        });
*/
        const arrayofrecentactivitiesdata1 = data1.map((el1) => ({
          paid: el1.usersname,
          gpname: el1.gpname,
          descp: el1.tdescription,
          amnt: symbolvalue + numeral(el1.tamount).format('0,0.00'),
          date1: el1.tdate,
          time1: new Date(el1.tdate).toLocaleTimeString(),
          formatedmonth: new Date(el1.tdate).toLocaleString('default', {
            month: 'short',
          }),
          formatedday: new Date(el1.tdate).getUTCDate(),
          formatedyear: new Date(el1.tdate).getUTCFullYear(),
        }));
        console.log(arrayofrecentactivitiesdata1);

        const arrayofrecentactivitiesdata2 = data2.map((el2) => ({
          paid: el2.usersname,
          gpname: el2.gpname,
          descp: el2.tdescription,
          amnt: symbolvalue + numeral(el2.tamount).format('0,0.00'),
          date1: el2.tdate,
          time1: new Date(el2.tdate).toLocaleTimeString(),
          formatedmonth: new Date(el2.tdate).toLocaleString('default', {
            month: 'short',
          }),
          formatedday: new Date(el2.tdate).getUTCDate(),
          formatedyear: new Date(el2.tdate).getUTCFullYear(),
        }));
        console.log(arrayofrecentactivitiesdata2);
        mergedata1anddata2 = [
          ...arrayofrecentactivitiesdata1,
          ...arrayofrecentactivitiesdata2,
        ];
        console.log(
          new Date(arrayofrecentactivitiesdata1[0].date1).toLocaleTimeString(),
          new Date(arrayofrecentactivitiesdata1[0].date1).toLocaleString()
        );
        // console.log(arrayofrecentactivitiesdata1);
        const sortades = (recentsettle) => (key) =>
          [...recentsettle]
            .sort(
              (intitial, next) =>
                new Date(intitial[key]).getTime() -
                new Date(next[key]).getTime()
            )
            .reverse();

        const descsortsettle = sortades(mergedata1anddata2)('date1');
        console.log(mergedata1anddata2);
        console.log(descsortsettle);

        this.setState({
          recent: descsortsettle,
        });
      })
      .catch((err) => console.log(err));
  };

  render() {
    let redirectVar = null;
    if (!cookie.load('cookie')) {
      redirectVar = <Redirect to="/" />;
    }
    const currusername = sessionStorage.getItem('username');
    const {
      recent,
      userid,
      groupslist,
      gpselectoptions,
      selectedvalue,
      recentsetlle,
    } = this.state;
    console.log(
      recent,
      userid,
      groupslist,
      gpselectoptions,
      selectedvalue,
      recentsetlle
    );
    let checkifactivitynull = false;
    if (isEmpty(recent)) {
      checkifactivitynull = true;
    }
    return (
      <div>
        {redirectVar}
        <Navheader />
        <div className="dashboard-flex">
          <div>
            <Sidebarcomp />
          </div>

          <div className="dashboard-box" style={{ overflowY: 'auto' }}>
            <section className="dashboard-heading-buttons">
              <section className="dashboard-heading">
                <h1>Recent Activity </h1>

                <ul className="button-right">
                  <li />
                </ul>
              </section>

              <section className="dashboard-center-sec">
                <div className="dashboard-center-section-block">
                  <div className="title" style={{ 'text-align': 'center' }}>
                    <h7>RECENT ACTIVITY</h7>
                  </div>
                </div>

                <div className="dashboard-center-section-block">
                  <div className="dashboard-block-border">
                    <div className="title" style={{ 'text-align': 'center' }}>
                      {' '}
                      RECENT ACTIVITY{' '}
                    </div>
                    <Dropdown>
                      <Dropdown.Toggle
                        className="login-default"
                        id="dropdown-basic"
                      >
                        Sort
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item
                          onSelect={() => {
                            this.sorthandlerasc();
                          }}
                        >
                          Ascending{' '}
                        </Dropdown.Item>
                        <Dropdown.Item
                          onSelect={() => {
                            this.sorthandlerdesc();
                          }}
                        >
                          Descending
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </div>

                <div className="dashboard-center-section-block">
                  <div className="title" style={{ 'text-align': 'center' }}>
                    {' '}
                    RECENT ACTIVITY{' '}
                  </div>
                  <div
                    className="mygroups-right"
                    style={{
                      width: '300px',
                      display: 'flex',
                      'flex-direction': 'row',
                    }}
                  />

                  <Select
                    options={gpselectoptions}
                    placeholder="GroupName"
                    className="div-select"
                    onChange={(e) => this.gpselectoptionshandler(e)}
                    styles={{
                      display: 'flex',
                      'flex-direction': 'row',
                    }}
                  />
                  <Button
                    className="Signup-default"
                    onClick={(e) => this.displayresults(selectedvalue, e)}
                    tyles={{
                      display: 'inline-block',
                      float: 'right',
                    }}
                  >
                    GO
                  </Button>
                </div>
              </section>
            </section>

            <section className="transcations-sec1" style={{ width: '80%' }}>
              <div className="tranactions-heading1">
                {checkifactivitynull ? (
                  <h7>YOU HAVE NO ACTIVTIES TO DISPLAY ! </h7>
                ) : (
                  <div>
                    {' '}
                    {recent.map((activities) => (
                      <ul
                        className="recent-expenses"
                        style={{ 'list-style-type': 'none' }}
                      >
                        <li>
                          <div
                            className="Row"
                            style={{ display: 'flex', 'flex-direction': 'row' }}
                          >
                            <p>
                              {JSON.stringify(activities.paid) ===
                                JSON.stringify(currusername) &&
                                JSON.stringify(activities.gpname) !==
                                  JSON.stringify('$$$$') && (
                                  <p>
                                    <p>
                                      <b>YOU </b>added a payment of{' '}
                                      <h6
                                        style={{
                                          color: '#3bb894',
                                          'font-weight': 'bold',
                                        }}
                                      >
                                        {activities.amnt}
                                      </h6>{' '}
                                      for <b>&quot;{activities.descp}&quot;</b>{' '}
                                      in <b>{activities.gpname} </b>
                                    </p>
                                  </p>
                                )}
                              {JSON.stringify(activities.paid) !==
                                JSON.stringify(currusername) && (
                                <p>
                                  <b>{activities.paid} </b>added a payment of{' '}
                                  <h6
                                    style={{
                                      color: '#ff652f',
                                      'font-weight': 'bold',
                                    }}
                                  >
                                    {activities.amnt}
                                  </h6>{' '}
                                  for <b>&quot;{activities.descp}&quot;</b> in{' '}
                                  <b>{activities.gpname} </b>;
                                </p>
                              )}
                              {JSON.stringify(activities.paid) ===
                                JSON.stringify(currusername) &&
                                JSON.stringify(activities.gpname) ===
                                  JSON.stringify('$$$$') && (
                                  <p>
                                    <b>You {activities.descp}</b>
                                  </p>
                                )}
                              <p>
                                <span>
                                  {activities.formatedmonth}{' '}
                                  {activities.formatedday},{' '}
                                  {activities.formatedyear} at{' '}
                                  {activities.time1}
                                </span>
                              </p>
                            </p>
                          </div>
                          <hr
                            style={{
                              height: '2px',
                              border: 'none',
                              color: 'grey',
                              'background-color': 'Grey',
                              'padding-top': '1px',
                              'padding-bottom': '1px',
                            }}
                          />
                        </li>
                      </ul>
                    ))}
                  </div>
                )}
              </div>
              <div className="transactions-owe" />
              <div className="transactions-owed" />
            </section>
          </div>

          <div className="dashboard-right" />
        </div>
      </div>
    );
  }
}
export default Recentactivity;
