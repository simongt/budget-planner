// TODO: add types
import {
  LOADING_UI,
  SET_ERRORS,
  CLEAR_ERRORS,
  SET_AUTHENTICATED,
  SET_UNAUTHENTICATED,
  SET_USER,
  UPDATE_EMAIL,
  UPDATE_PASSWORD,
  LOGIN,
  SIGNUP,
  LOADING_USER
} from '../types';

// TODO: add initial state
const initialState = {
  uiLoading: false,
  userLoading: false,
  authenticated: false,
  password: '',
  email: '',
  errors: ''
};

export default (state = initialState, action) => {
  switch (action.type) {
    // case SET_SOME_TYPE:
    //   return { ...state, profile: action.payload };
    default:
      return state;
  }
};
