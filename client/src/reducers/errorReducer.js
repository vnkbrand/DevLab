import { GET_ERRORS } from "../actions/types";

const intitialState = {};

export default function(state = intitialState, action) {
  switch(action.type) {
    case GET_ERRORS:
      return action.payload;
    default:
      return state;
  }
}