// TODO: add types
import { SET_ELECTION, SET_ANNUAL_SALARY, SUBMITTED_BUDGET_FORM, SET_CURRENCY } from '../types';

// TODO: add initial state
const initialState = {
  errors: '',
  authenticated: false,
  user: {},
  election: 15,
  annualSalary: 85000
};

export default (state = initialState, action) => {
  switch (action.type) {
    // case SET_SOME_TYPE:
    //   return { ...state, profile: action.payload };
    default:
      return state;
  }
};
