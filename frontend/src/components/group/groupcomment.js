import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
// import Button from 'react-bootstrap/Button';
// import { Modal, Form, Image } from 'react-bootstrap';
import '../navbar/navbar.css';
import '../dashboard/dashboard.css';
import './group.css';

class Groupcomments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comment: '',
    };
    // this.addcomment = this.addcomment.bind(this);
    this.addcommentChangeHandler = this.addcommentChangeHandler.bind(this);
  }

  addcommentChangeHandler = (e) => {
    this.setState({
      comment: e.target.value,
    });
  };

  render() {
    const { comment } = this.state;
    // eslint-disable-next-line react/prop-types
    const { addcomment } = this.props;
    return (
      <div>
        ​<form name="comment" id="comment" />
        <textarea
          name="comment"
          form="comment"
          value={comment}
          placeholder="Add a comment"
          id="comment"
          style={{
            float: 'right',
            width: '250px',
            height: '75px',
          }}
          onChange={(e) => this.addcommentChangeHandler(e)}
          required
        />
        <br />
        <div className="savebtn">
          <button
            data-testid="Create"
            type="button"
            style={{ float: 'right' }}
            className="Signup-default"
            onClick={() => {
              addcomment(comment);
              this.setState({
                comment: '',
              });
            }}
            formNoValidate
          >
            Post
          </button>
        </div>
      </div>
    );
  }
}

export default Groupcomments;
