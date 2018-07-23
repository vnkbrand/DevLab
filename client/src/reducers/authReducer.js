import { SET_CURRENT_USER } from '../actions/types';
import isEmpty from '../validation/is-empty';

const intitialState = {
  isAuthenticated: false,
  user: {}
}

export default function(state = intitialState, action) {
  // Take data from authActions and manipulate state to show new user
  switch(action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        // Check if payload is not empty
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload
      };
    default:
      return state;
  }
}