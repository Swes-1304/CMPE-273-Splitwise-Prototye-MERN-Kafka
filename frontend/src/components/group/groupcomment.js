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
        <input
          type="textarea"
          placeholder="Add a comment"
          value={comment}
          name="comment box"
          id="comment box"
          onChange={(e) => this.addcommentChangeHandler(e)}
          required
        />

        <div className="savebtn">
          <button
            data-testid="Create"
            type="button"
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
