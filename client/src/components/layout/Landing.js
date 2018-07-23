import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';

class Landing extends Component {

  // Disallows going to Landing page if logged-in
  componentDidMount() {
    if(this.props.auth.isAuthenticated) {
      this.props.history.push('/dashboard');
    }
  }

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

// Can now get isAuthenticated - to not show Landing page if logged in
Landing.propTypes = {
  auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps)(Landing);
