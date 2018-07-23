import React, { Component } from 'react'; 
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurrentProfile } from '../../actions/profileActions';
import Spinner from '../common/spinner';

class Dashboard extends Component {
  componentDidMount() {
    // Add Profile to state
    this.props.getCurrentProfile();
  }
  render() {
    //  Profile state is != null before rendering anything
    const { user } = this.props.auth;
    // Come from profile property which is from profile props in redux (profileReducer)
    const { profile, loading } = this.props.profile;

    let dashboardContent;
                        // Loading is true
    if(profile === null || loading) {
      dashboardContent = <Spinner />
    } else {
      //  If there is a profile, display dashboard
      //  Check if logged-in user has profile data
      if(Object.keys(profile).length > 0) {
        dashboardContent = <h4>DISPLAY PROFILE</h4>
      } else {
        //  User is logged-in but has no profile
        dashboardContent = (
          <div>
            <p className="lead text-muted">Welcome { user.name }</p>
            <p>You have not setup a profile yet. Please add some info.</p>
            <Link to="/create-profile" className="btn btn-db btn-info">
              Create Profile
            </Link>
          </div>
        );
      }

    }

    return (
      <div className="dashboard">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h1 className="display-4">Dashboard</h1>
              {dashboardContent}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  profile: state.profile,
  auth: state.auth
});

export default connect(mapStateToProps, { getCurrentProfile })(Dashboard);