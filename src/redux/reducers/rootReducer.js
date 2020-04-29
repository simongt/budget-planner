// TODO: add types
import { LOADING_UI, LOADING_USER, SET_ERRORS, UNSET_ERRORS } from '../types';

// TODO: add initial state
const initialState = {
  uiLoading: false,
  userLoading: false,
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
