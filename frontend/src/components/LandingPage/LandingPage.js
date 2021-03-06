import React, { Component } from 'react';
import { Image } from 'react-bootstrap';
import Navheader from '../navbar/navbar';

class LandingPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <Navheader />
        <div className="landing">
          <Image
            className="landingpic"
            src="/Group_photos/blog-cover-image.png"
            alt="landing page"
            fluid
          />
        </div>
      </div>
    );
  }
}

export default LandingPage;
