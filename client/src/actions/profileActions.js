import axios from 'axios';

import { GET_PROFILE, PROFILE_LOADING, CLEAR_CURRENT_PROFILE } from './types';

// Get current profile (as per token)
export const getCurrentProfile = () => dispatch => {
  dispatch(setProfileLoading());
  axios
    .get('/api/profile')
    .then(res => 
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      })
    )
    // Don't want to show an error if the profile is new/empty. 
    .catch(err =>
      dispatch({
        type: GET_PROFILE,
        payload: {}
      })
    );
  }

//  Profile Loading
export const setProfileLoading = () => {
  return {
    type: PROFILE_LOADING
  };
};

//  Clear Profile
export const clearCurrentProfile = () => {
  return {
    type: CLEAR_CURRENT_PROFILE
  };
};