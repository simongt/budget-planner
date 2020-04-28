import { toast } from 'react-toastify';
import { sleep } from '../../util';

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
  UPDATE_FORM_SENT,
  LOGIN,
  SIGNUP,
  LOADING_USER
} from '../types';

import { auth } from '../../services/firebase';

export const updateEmail = email => ({
  type: UPDATE_EMAIL,
  payload: email
});

export const updatePassword = password => ({
  type: UPDATE_PASSWORD,
  payload: password
});

// authenticatation method
export const handleLogin = (
  callback = () => console.log('Redux actions --> login: Login callback')
) => async (dispatch, getState) => {
  console.log('Redux actions --> login');

  const { email, password } = await getState().user;
  dispatch({ type: LOADING_UI });

  // set persistance to use local storage, then authenticate user with email / password, grab user's id token and use it to set authorization header
  auth.signInWithEmailAndPassword(email, password).then(
    async result => {
      console.log('Redux action --> login: firebase signInWithEmailAndPassword', result);
      // login method allows for callback function once authentication has been initiated
      await callback();
      await toast.success('👍 Email sign-in successful.');
      dispatch({ type: CLEAR_ERRORS });
    },
    error => {
      const errorCode = error.code;
      const errorMessage = error.message;
      toast.error('🧐' + error.message);
      dispatch({
        type: SET_ERRORS,
        payload: { error: error.message }
      });
      dispatch({
        type: UPDATE_FORM_SENT,
        payload: { formSent: false }
      });
    }
  );
};
