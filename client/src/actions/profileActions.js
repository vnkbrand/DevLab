import axios from 'axios';

import { GET_PROFILE,
         PROFILE_LOADING, 
         CLEAR_CURRENT_PROFILE, 
         GET_ERRORS,
         SET_CURRENT_USER
        } from './types';

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
  };

//  Create Profile - handle submission
export const createProfile= (profileData, history) => dispatch => {
  axios
    .post("api/profile", profileData)
    .then(res => history.push("/dashboard"))
    .catch(err =>
      dispatch({
        // Go through error
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//  Delete Account & Profile
export const deleteAccount = () => dispatch => {
  if(window.confirm('Are you sure you want to delete your account?')) {
    axios
      .delete('/api/profile')
      .then(res =>
        dispatch({
          type: SET_CURRENT_USER,
          // Empty obkect - sets auth user to nothing
          payload: {}
        })
      )
      .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
  }
 };


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