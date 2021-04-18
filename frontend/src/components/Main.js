import React, { Component } from 'react';
// import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Route, Switch } from 'react-router-dom';
import Login from './Login/Login';
import Signup from './Signup/Signup';
import LandingPage from './LandingPage/LandingPage';
import Dashboard from './dashboard/dashboard';
import Createnewgroup from './create_new_group/create_new_group';
import Profilepage from './profilepage/profile_page';
import Mygroups from './my_groups/my_groups';
import Groupdetails from './group/group';
import Recentactivity from './recent_activity/Reactactivity';

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/" component={LandingPage} />
          <Route path="/signup" component={Signup} />
          <Route path="/login" component={Login} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/createnewgroup" component={Createnewgroup} />
          <Route path="/profile" component={Profilepage} />
          <Route path="/mygroups" component={Mygroups} />
          <Route path="/group" component={Groupdetails} />
          <Route path="/recentactivity" component={Recentactivity} />
        </Switch>
      </div>
    );
  }
}
// Export The Main Component
export default Main;
