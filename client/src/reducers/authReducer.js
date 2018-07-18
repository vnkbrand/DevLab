import { TEST_DISPATCH } from "../actions/types";

const intitialState = {
  isAuthenticated: false,
  user: {}
}

export default function(state = intitialState, action) {
  switch(action.type) {
    default:
      return state;
  }
}