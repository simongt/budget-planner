import withRoot from '../lib/withRoot';
import React, { Component, Fragment } from 'react';
import { toast } from 'react-toastify';
import Img from 'react-cool-img';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import TopNavBar from './TopNavBar';
import { email, required } from './form/validation';
// import { connect } from 'react-redux';
import { auth, signinWithGoogle } from '../services/firebase';
import { sleep } from '../util';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import { Field, Form, FormSpy } from 'react-final-form';
import {
  Link as MuiLink,
  CircularProgress,
  LinearProgress,
  Slider,
  Grid,
  Tooltip,
  MenuItem,
  InputAdornment,
  IconButton,
  useMediaQuery,
  Backdrop
} from '@material-ui/core';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Typography from './Typography';
import Container from './Container';
import TextField from './TextField';
import Button from './Button';
import RFTextField from './form/RFTextField';
import FormButton from './form/FormButton';
import FormFeedback from './form/FormFeedback';
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.css';

import { MIN_ELECTION, MAX_ELECTION, MIN_ANNUAL_SALARY, MAX_ANNUAL_SALARY } from '../constants';

const PiggyBankLogo = ({ width, height }) => (
  <Img
    style={{ backgroundColor: 'transparent', width, height }}
    src={require('../static/assets/images/piggy-bank--transparent--250px.png')}
    alt='Piggy Bank'
  />
);

const InputSpacer = () => <span style={{ width: 8, height: 48 }}></span>;

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      emailLoginPressed: false,
      oauthLoginPressed: false,
      logoutPressed: false,
      user: null,
      authenticated: false,
      error: null,
      email: '',
      password: '',
      showPassword: false,
      classes: null,
      sent: false,
      election: 15, // TODO: animate from min value
      electedExpenseSliderMarks: [],
      electedExpenseInputMode: false,
      electedExpenseTooltipVisible: true,
      annualSalary: 100000, // TODO: animate from min value
      annualSalaryInputMode: false,
      annualSalaryTooltipVisible: true,
      monthlyExpenses: null,
      monthlySavings: null,
      budgetData: [],
      budgetFormSubmitted: false,
      sliderTooltipVisible: true,
      currency: {
        value: 'USD',
        label: '$'
      }
    };
  }

  componentDidMount = () => {
    console.log('Home --> componentDidMount', this.props);
    const electedExpenseSliderMarks = [];
    let electionMark = MAX_ELECTION;
    while (electionMark >= MIN_ELECTION) {
      // TODO: better responsivity: show less/more marks on narrow/wide screens by adjusting % N
      if (
        electionMark % 5 === 0 ||
        electionMark === MIN_ELECTION ||
        electionMark === MAX_ELECTION
      ) {
        electedExpenseSliderMarks.push({
          value: electionMark,
          label: electionMark + '%'
        });
      }
      electionMark--;
    }
    // if neither election nor salary are found in local storage, proceed with defaults
    this.setState(
      {
        authenticated: this.props.authenticated,
        user: this.props.authenticated ? auth().currentUser : null
      },
      () => {
        const storage = {
          election: this.state.user
            ? parseFloat(localStorage.getItem(`${this.state.user.uid}-election`) || '')
            : null,
          annualSalary: this.state.user
            ? parseFloat(localStorage.getItem(`${this.state.user.uid}-salary`) || '')
            : null,
          monthlyExpenses: this.state.user
            ? localStorage.getItem(`${this.state.user.uid}-expenses`) || ''
            : null,
          monthlySavings: this.state.user
            ? localStorage.getItem(`${this.state.user.uid}-savings`) || ''
            : null
        };
        this.setState(
          prevState => ({
            election: storage.election ? storage.election : prevState.election,
            annualSalary: storage.annualSalary ? storage.annualSalary : prevState.annualSalary,
            monthlyExpenses: storage.monthlyExpenses
              ? storage.monthlyExpenses
              : prevState.monthlyExpenses,
            monthlySavings: storage.monthlySavings
              ? storage.monthlySavings
              : prevState.monthlySavings
          }),
          () => {
            this.setState(
              {
                electedExpenseSliderMarks,
                budgetData: [
                  {
                    label: 'Annual Salary',
                    amount: this.state.annualSalary
                  },
                  {
                    label: 'Monthly Expenses',
                    amount: (this.state.annualSalary / 12) * (this.state.election / 100)
                  },
                  {
                    label: 'Monthly Savings',
                    amount: (this.state.annualSalary / 12) * ((100 - this.state.election) / 100)
                  }
                ],
                monthlyExpenses: this.getMonthlyExpenses(),
                monthlySavings: this.getMonthlySavings(),
                classes: makeStyles(theme => ({
                  form: {
                    marginTop: theme.spacing(6)
                  },
                  button: {
                    marginTop: theme.spacing(3),
                    marginBottom: theme.spacing(2)
                  },
                  feedback: {
                    marginTop: theme.spacing(2)
                  },
                  slider: {
                    // width: 300
                  },
                  sliderMargin: {
                    height: theme.spacing(3)
                  }
                }))
              },
              () => {
                this.setState(
                  {
                    loading: false
                  },
                  () => {
                    if (!this.state.electedExpenseInputMode && !this.state.annualSalaryInputMode) {
                      sleep(5000).then(() => {
                        this.setState({
                          electedExpenseTooltipVisible: false,
                          annualSalaryTooltipVisible: false,
                          sliderTooltipVisible: false
                        });
                      });
                    }
                  }
                );
              }
            );
          }
        );
      }
    );
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.election !== this.state.election ||
      prevState.annualSalary !== this.state.annualSalary
    ) {
      this.setState(
        {
          budgetData: [
            {
              label: 'Annual Salary',
              amount: this.state.annualSalary
            },
            {
              label: 'Monthly Expenses',
              amount: (this.state.annualSalary / 12) * (this.state.election / 100)
            },
            {
              label: 'Monthly Savings',
              amount: (this.state.annualSalary / 12) * ((100 - this.state.election) / 100)
            }
          ],
          monthlyExpenses: this.getMonthlyExpenses(),
          monthlySavings: this.getMonthlySavings()
        },
        () => {
          try {
            localStorage.setItem(`${this.state.user.uid}-election`, `${this.state.election}`);
            localStorage.setItem(`${this.state.user.uid}-salary`, `${this.state.annualSalary}`);
            localStorage.setItem(
              `${this.state.user.uid}-expenses`,
              `${this.state.monthlyExpenses}`
            );
            localStorage.setItem(`${this.state.user.uid}-savings`, `${this.state.monthlySavings}`);
          } catch (error) {
            console.warn('Failed to save data in local storage.', error);
          }
        }
      );
    }
  }

  componentWillUnmount = () => {};

  // TODO: refactor as Redux action
  updateStorage = (key, value) => {
    this.setState({ [key]: value });
    localStorage.setItem(key, value);
  };

  // TODO: refactor as Redux action
  validateForm = values => {
    const errors = required(['email', 'password'], values);
    if (!errors.email) {
      const emailError = email(values.email, values);
      if (emailError) {
        errors.email = email(values.email, values);
      }
    }
    return errors;
  };

  // TODO: refactor as Redux action
  handleLoginPress = values => {
    console.log('Home --> handleLoginPress', values);
    event.preventDefault();
    this.setState(
      {
        error: '',
        email: values.email,
        password: values.password,
        emailLoginPressed: true,
        sent: true
      },
      () => {
        auth()
          .signInWithEmailAndPassword(this.state.email, this.state.password)
          .then(result => {
            console.log(result);
            toast.success('👍 Email sign-in successful.');
            this.setState({ user: auth().currentUser, emailLoginPressed: false, sent: false });
          })
          .catch(error => {
            const errorCode = error.code;
            const errorMessage = error.message;
            toast.error('🧐' + error.message);
            this.setState({ error: error.message, emailLoginPressed: false, sent: false });
          });
      }
    );
  };

  // TODO: refactor as Redux action
  handleLogoutPress = () => {
    console.log('Home --> handleLogoutPress');
    event.preventDefault();
    this.setState({ error: '', logoutPressed: true }, () => {
      auth()
        .signOut()
        .then(() => {
          toast.success('👍 Sign-out successful.');
          this.setState({
            user: null,
            logoutPressed: false,
            user: null,
            authenticated: false,
            email: '',
            password: '',
            showPassword: false,
            // classes: null,
            sent: false,
            sliderTooltipVisible: false,
            electedExpenseInputMode: false,
            electedExpenseTooltipVisible: false,
            annualSalaryInputMode: false,
            annualSalaryTooltipVisible: false,
            budgetFormSubmitted: false
          });
        })
        .catch(error => {
          const errorCode = error.code;
          const errorMessage = error.message;
          toast.error('🧐' + error.message);
          this.setState({ error: error.message, logoutPressed: false });
        });
    });
  };

  // TODO: refactor as Redux action
  handleFormChange = event => {
    // event.preventDefault();
    event.persist();
    // dynamically determine the key and set the corresponding state variable
    this.setState(prevState => ({
      ...prevState,
      // if user changes any single attribute, it will mutate that corresponding attribute in state
      [event.target.name]: event.target.value
    }));
  };

  // TODO: refactor as Redux action
  handleOauthLoginPress = async () => {
    console.log('Home --> handleOauthLoginPress');
    event.preventDefault();
    this.setState({ error: '', oauthLoginPressed: true }, () => {
      // Creates the provider object
      const provider = new auth.GoogleAuthProvider();
      // Add additional scopes to the provider
      provider.addScope('profile');
      provider.addScope('email');
      // Sign in with popup
      auth()
        .signInWithPopup(provider)
        .then(
          result => {
            const epoch = new Date().toISOString();
            console.log('Home --> handleOauthLoginPress --> epoch:', epoch);
            const user = result.user; // The firebase.User instance
            console.log('Home --> handleOauthLoginPress --> firebase.User:', user);

            // The Facebook firebase.auth.AuthCredential containing the Facebook access token
            const credential = result.credential;
            const token = result.credential.accessToken;
            console.log(
              'Home --> handleOauthLoginPress --> firebase.auth.AuthCredential:',
              credential
            );
            this.setState(
              { buttonPressed: false, oauthLoginPressed: false, user: auth().currentUser },
              () => {
                toast.success('👍 Google sign-in successful.');
              }
            );
          },
          error => {
            // If account-exists-with-different-credential, fetch the providers linked to that email
            const email = error.email; // provider's account email
            const credential = error.credential; // provider's credential
            if (error.code === 'auth/account-exists-with-different-credential') {
              auth.fetchSignInMethodsForEmail(email).then(providers => {
                console.log('Home --> handleOauthLoginPress --> providers: ', providers);
              });
            }
            this.setState({ error: error.message, oauthLoginPressed: false }, () => {
              toast.error('🧐' + this.state.error);
            });
          }
        );
    });
  };

  // TODO: move to Dashboard screen
  handleBudgetFormSubmit = event => {
    console.log('Home --> handleBudgetFormSubmit');
    event.preventDefault();
    this.setState(
      prevState => ({
        budgetFormSubmitted: !prevState.budgetFormSubmitted
      }),
      () => {
        // toast.info(
        //   `Calculating expense report for ${this.abbreviateUsdFormat(
        //     this.state.annualSalary
        //   )} salary with ${this.state.election}% election.`
        // );
        // setTimeout(() => {
        //   this.setState({ budgetFormSubmitted: false });
        // }, 1500);
      }
    );
  };

  // TODO: refactor as Redux action (not util due to the currency label)
  abbreviateUsdFormat = value => {
    // TODO: refactor to use decimals s.t. $101,500 becomes $101.5k, not $101k
    if (value === 0) {
      return `${this.state.currency.label}0`;
    } else if (value < 1000) {
      return `${this.state.currency.label}${Math.floor(value)}`;
    } else if (value < 1000000) {
      return `${this.state.currency.label}${Math.floor(value / 1000)}k`;
    } else if (value < 1000000000) {
      return `${this.state.currency.label}${Math.floor(value / 1000000)}M`;
    } else if (value < 1000000000000) {
      return `${this.state.currency.label}${Math.floor(value / 1000000000)}B`;
    }
  };

  // TODO: refactor as Redux action
  getUserName = () =>
    this.state.user.displayName
      ? this.state.user.displayName.split(' ')[0].charAt(0).toUpperCase() +
        this.state.user.displayName.split(' ')[0].slice(1).toLowerCase()
      : this.state.user.email.split('@')[0].charAt(0).toUpperCase() +
        this.state.user.email.split('@')[0].slice(1).toLowerCase();

  // TODO: move to util
  usdFormat = (value = 0) => {
    const dollarsAndCents = parseFloat(value).toFixed(2).split('.'); // [0]: dollars, [1]: cents
    dollarsAndCents[0] = dollarsAndCents[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return dollarsAndCents[1] === '00' ? '$' + dollarsAndCents[0] : '$' + dollarsAndCents.join('.');
  };

  // TODO: refactor as Redux action
  // TODO: refactor to return the calculated value and format outside of this method
  getMonthlyExpenses = () =>
    this.usdFormat((this.state.annualSalary / 12) * (this.state.election / 100));

  // TODO: refactor as Redux action
  // TODO: refactor to return the calculated value and format outside of this method
  getMonthlySavings = () =>
    this.usdFormat((this.state.annualSalary / 12) * ((100 - this.state.election) / 100));

  // TODO: refactor as Redux action
  validateSliderExpense = (value = MIN_ELECTION) => {
    if (value > MAX_ELECTION) {
      toast.error(`💸 The maximum election allowed is ${MAX_ELECTION}%.`);
      return MAX_ELECTION;
    } else if (value >= MIN_ELECTION) {
      return value;
    } else {
      toast.error(`💸 The minimum election allowed is ${MIN_ELECTION}%.`);
      return MIN_ELECTION;
    }
  };

  // TODO: move to util
  validateSalary = (value = MIN_ANNUAL_SALARY) => {
    if (value > MAX_ANNUAL_SALARY) {
      toast.error(
        `💸 The maximum salary allowed is ${this.abbreviateUsdFormat(MAX_ANNUAL_SALARY)}.`
      );
      return MAX_ANNUAL_SALARY;
    } else if (value >= MIN_ANNUAL_SALARY) {
      return value;
    } else {
      toast.error(
        `💸 The minimum salary allowed is ${this.abbreviateUsdFormat(MIN_ANNUAL_SALARY)}.`
      );
      return MIN_ANNUAL_SALARY;
    }
  };

  // TODO: move to PieChart component
  customizePieChartTooltip = arg => {
    return { text: `${arg.argumentText}:<br>${arg.valueText}` };
  };

  render() {
    const {
      loading,
      authenticated,
      budgetFormSubmitted,
      passwordResetRequested,
      signupRequested,
      user,
      error,
      email,
      password,
      showPassword,
      classes,
      sent,
      oauthLoginPressed,
      currency,
      electedExpenseSliderMarks,
      election,
      electedExpenseInputMode,
      electedExpenseTooltipVisible,
      annualSalary,
      annualSalaryInputMode,
      annualSalaryTooltipVisible,
      monthlyExpenses,
      monthlySavings,
      budgetData,
      sliderTooltipVisible
    } = this.state;
    return loading ? (
      <LinearProgress color='secondary' />
    ) : (
      <Fragment>
        {/* TODO: add left section when logged in for choosing currency */}
        <TopNavBar
          authenticated={authenticated}
          oauthLogin={this.handleOauthLoginPress}
          logout={this.handleLogoutPress}
        />
      </Fragment>
    );
  }
}

export default withRoot(Home);
