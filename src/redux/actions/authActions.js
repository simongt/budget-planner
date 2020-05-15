import { toast } from 'react-toastify';
import { sleep } from '../../util';

// TODO: add types
import {
  UI_IS_LOADING,
  UI_IS_LOADED,
  SET_MUI_CLASSES,
  USER_IS_LOGGED_IN,
  USER_IS_NOT_LOGGED_IN,
  IS_ATTEMPTING_LOGIN,
  IS_ATTEMPTING_LOGOUT,
  PASSWORD_IS_MASKED,
  PASSWORD_IS_SHOWING,
  SET_USER,
  CLEAR_USER,
  SET_CURRENCY,
  SET_ELECTION,
  SET_ANNUAL_SALARY,
  BUDGET_FORM_IS_SUBMITTED
} from '../types';

import { auth } from '../../services/firebase';

// authenticatation method
export const handleEmailLogin = (
  email = '',
  password = '',
  callback = () => null // expecting function to reenable form
) => async (dispatch, getState) => {
  console.log('Redux actions --> handleEmailLogin');
  dispatch({ type: IS_ATTEMPTING_LOGIN });
  auth()
    .signInWithEmailAndPassword(email, password)
    .then(
      async result => {
        console.log(
          'Redux action --> handleEmailLogin: firebase signInWithEmailAndPassword',
          result
        );
        const user = await auth().currentUser;
        // login method allows for callback function once authentication has been initiated
        await toast.success('👍 Email sign-in successful.');
        dispatch({ type: SET_USER, payload: { user } });
        dispatch({ type: USER_IS_LOGGED_IN });
      },
      error => {
        const errorCode = error.code;
        const errorMessage = error.message;
        toast.error('🧐' + error.message);
        dispatch({ type: USER_IS_NOT_LOGGED_IN });
        // short timeout, then re-enable form edit / submit
        sleep(750).then(() => callback());
      }
    );
};
