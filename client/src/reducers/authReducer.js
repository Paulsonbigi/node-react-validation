import {
    SET_CURRENT_USER, 
    USER_LOADING,
} from "../actions/type"

const isEmpty = require("is-empty")

// initialzing the state
const initialState = {
    isAuthenticated: false,
    user: {},
    loading: false,
    // token: localStorage.getItem("token1"),
}

// creating and exporting the reducer functions
export default function(state = initialState, action) {
    switch (action.type) {
      case SET_CURRENT_USER:
        return {
          ...state,
          isAuthenticated: !isEmpty(action.payload),
          user: action.payload
        };
      case USER_LOADING:
        return {
          ...state,
          loading: true
        };
      default:
        return state;
    }
  }