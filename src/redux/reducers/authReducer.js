// TODO: add types
import {
  LOADING_USER,
  SET_ERRORS,
  UNSET_ERRORS,
  AUTHENTICATED,
  UPDATE_EMAIL,
  UPDATE_PASSWORD,
  SUBMITTED_AUTH_FORM,
  SHOWING_PASSWORD,
  SET_USER
} from '../types';

// TODO: add initial state
const initialState = {
  userLoading: false,
  errors: '',
  email: '',
  password: '',
  passwordShowing: false,
  authFormSubmitted: false,
  authenticated: false,
  user: {}
};

export default (state = initialState, action) => {
  switch (action.type) {
    // case SET_SOME_TYPE:
    //   return { ...state, profile: action.payload };
    default:
      return state;
  }
};
