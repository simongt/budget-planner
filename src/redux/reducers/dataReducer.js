// TODO: add types
import {
  SET_CURRENCY,
  SET_ELECTION,
  SET_ANNUAL_SALARY,
  BUDGET_FORM_IS_SUBMITTED //
} from '../types';

// TODO: add initial state
const initialState = {
  election: 15,
  annualSalary: 85000
};

export default (state = initialState, action) => {
  console.log('dataReducer --> action: ', action);
  switch (action.type) {
    // case SET_CURRENCY:
    //   return { ...state, profile: action.payload };
    // case SET_ELECTION:
    //   return { ...state, profile: action.payload };
    // case SET_ANNUAL_SALARY:
    //   return { ...state, profile: action.payload };
    // case BUDGET_FORM_IS_SUBMITTED:
    //   return { ...state, profile: action.payload };
    default:
      return state;
  }
};
