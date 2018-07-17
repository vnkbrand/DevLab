import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Landing extends Component {
  render() {
    return (
      <div className="landing">
      <div className="dark-overlay landing-inner text-light">
        <div className="container">
          <div className="row">
            <div className="col-md-12 text-center">
              <h1 className="display-3 mb-4">DevLab
              </h1>
              <p className="lead"> For Developers to connect, share and thrive!</p>
              <hr />
              <Link to="/register" className="btn btn-outline-primary btn-rounded waves-effect mr-2">Sign Up</Link>
              <Link to="/login" className="btn btn-outline-success btn-rounded waves-effect">Login</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
    )
  }
}

export default Landing;
