// TODO: add types
import {
  UI_IS_LOADING,
  UI_IS_LOADED,
  SET_MUI_CLASSES,
  USER_IS_LOGGED_IN,
  USER_IS_NOT_LOGGED_IN
  //
} from '../types';

// TODO: add initial state
const initialState = {
  loading: false,
  muiClasses: {}, // material ui theme
  authenticated: false
};

export default (state = initialState, action) => {
  console.log('rootReducer --> action: ', action);
  switch (action.type) {
    case UI_IS_LOADING:
      return { ...state, loading: true };
    case UI_IS_LOADED:
      return { ...state, loading: false };
    case USER_IS_LOGGED_IN:
      return { ...state, authenticated: true };
    case USER_IS_NOT_LOGGED_IN:
      return { ...state, authenticated: false };
    case SET_MUI_CLASSES:
      return { ...state, muiClasses: action.payload };
    default:
      return state;
  }
};
