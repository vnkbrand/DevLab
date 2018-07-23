import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';
import jwt_decode from 'jwt-decode';

import { GET_ERRORS, SET_CURRENT_USER } from "./types";


//  Register User
export const registerUser = (userData, history) => dispatch => {
    axios
      .post("/api/users/register", userData)
      .then(res => history.push( './login'))
      .catch(err => 
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        })
      );
};

//  Login - Get User Token
//  Need token to access any protected routes
//  Store token in LocalStorage and sent with EVERY request we make
// Logout destroys the token
//  Refer to utils/setAuthToken.js
export const loginUser = userData => dispatch => {
  axios
    .post('/api/users/login', userData)
    .then(res => {
      //  Save to localStorage
      const { token } = res.data;
      //  Set token to localStorage
      localStorage.setItem('jwtToken', token);
      // Set token to Auth header
      setAuthToken(token);
      //  Decode token to get user data - user data in token
      const decoded = jwt_decode(token);
      //  Set Current user
      dispatch(setCurrentUser(decoded));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      }));
};

//  Set logged in user
export const setCurrentUser = (decoded) => {
  return{
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

//  Log user out
export const logoutUser = () => dispatch => {
  // Remove token from localStorage
  localStorage.removeItem('jwtToken');
  // Remove the Auth Header for future requests (utils/setAuthToken attaches token to ALL requests)
  setAuthToken(false);
  //  Set current user to {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
}