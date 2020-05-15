// TODO: add types
import {
  PASSWORD_IS_MASKED,
  PASSWORD_IS_SHOWING,
  IS_ATTEMPTING_LOGIN,
  USER_IS_NOT_LOGGED_IN,
  SET_USER,
  CLEAR_USER
} from '../types';

// TODO: add initial state
const initialState = {
  passwordShowing: false,
  authenticating: false, // lets form know auth data was sent
  user: {}
};

export default (state = initialState, action) => {
  console.log('authReducer --> action: ', action);
  switch (action.type) {
    case PASSWORD_IS_MASKED:
      return {
        ...state,
        passwordShowing: false
      };
    case PASSWORD_IS_SHOWING:
      return {
        ...state,
        passwordShowing: true
      };
    case USER_IS_NOT_LOGGED_IN:
      return {
        ...state,
        authenticating: false,
        user: null
      };
    case IS_ATTEMPTING_LOGIN:
      return {
        ...state,
        authenticating: true
      };
    case SET_USER:
      return {
        ...state,
        authenticating: false,
        user: action.payload
      };
    case CLEAR_USER:
      return {
        ...state,
        user: null
      };
    default:
      return state;
  }
};
