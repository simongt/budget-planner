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
  LOGIN,
  SIGNUP,
  LOADING_USER
} from '../types';

import { auth } from '../../services/firebase';
