import withRoot from '../lib/withRoot';
import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Img from 'react-cool-img';
import { Field, Form, FormSpy } from 'react-final-form';
import { withStyles, makeStyles } from '@material-ui/core/styles';
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
import PieChart, {
  CommonSeriesSettings,
  Legend,
  Series,
  Export,
  Label,
  Title,
  Tooltip as PCTooltip,
  Subtitle
} from 'devextreme-react/pie-chart';
import Typography from './Typography';
import TopNavBar from './TopNavBar';
import Container from './Container';
import TextField from './TextField';
import Button from './Button';
import RFTextField from './form/RFTextField';
import FormButton from './form/FormButton';
import FormFeedback from './form/FormFeedback';
import { email, required } from './form/validation';
import { connect } from 'react-redux';
import { auth } from '../services/firebase';
import { sleep } from '../util';
import { handleEmailLogin } from '../redux/actions';
// notifications styling config
import 'react-toastify/dist/ReactToastify.css';
// pie chart styling config
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.css';
// constants
import {
  MIN_ELECTION,
  MAX_ELECTION,
  MIN_ANNUAL_SALARY,
  MAX_ANNUAL_SALARY,
  currencies
} from '../data/constants';

const SliderTooltip = withStyles(theme => ({
  tooltip: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    color: 'rgba(255, 255, 255, 0.95)',
    boxShadow: theme.shadows[1],
    fontSize: 12,
    marginTop: 25
  },
  arrow: {
    color: 'rgba(0, 0, 0, 0.75)'
  }
}))(Tooltip);

const InputTooltip = withStyles(theme => ({
  tooltip: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    color: 'rgba(255, 255, 255, 0.95)',
    boxShadow: theme.shadows[1],
    fontSize: 12
  },
  arrow: {
    color: 'rgba(0, 0, 0, 0.75)'
  }
}))(Tooltip);

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
      // each component has its own loading value to avoid rendering until data has loaded
      loading: true,
      // triggers transition from private to public route,
      authenticated: false,
      // object from firebase with user data
      user: null,
      // error message seen in notifications (e.g. returned from firebase auth)
      error: null,
      // provided as form input from user
      email: '',
      // provided as form input from user
      password: '',
      // if true, reveal password as clear text within form field
      showPassword: false,
      // triggers toggling of clickability on button while OAuth signin is being processed
      oauthLoginClicked: false,
      // triggers transition from private to public route, firebase signout
      logoutClicked: false,
      // triggers loading of signup form for new users
      signupClicked: false,
      // triggers loading of password recovery form
      resetPasswordClicked: false,
      // injects material ui theme into specific components (e.g. form, button, feedback, slider)
      muiClasses: null,
      // triggers appropriate action upon submitting form (signin, signup, password reset)
      formSent: false,
      // value indicates percentage of salary to elect as expenses per month (Number)
      election: 15, // TODO: animate from min value
      // array of values to label marks along the bottom of slider (like units of measurement)
      electedExpenseSliderMarks: [],
      // triggers toggling between displaying election as static element and as an input field
      electedExpenseInputMode: false,
      // triggers visibility of tooltip (is currently set to only show for the first few seconds)
      electedExpenseTooltipVisible: true,
      // value indicates user's annual salary (Number)
      annualSalary: 75000, // TODO: animate from min value
      // triggers toggling between displaying election as static element and as an input field
      annualSalaryInputMode: false,
      // triggers visibility of tooltip (is currently set to only show for the first few seconds)
      annualSalaryTooltipVisible: true,
      // value calculated using election and salary (String), TODO: refactor to keep as Number
      monthlyExpenses: null,
      // value calculated using election and salary (String), TODO: refactor to keep as Number
      monthlySavings: null,
      // array of objects with data for pie chart
      // each object consists of { label, amount }
      // represents data pertaining to election, salary
      budgetData: [],
      // triggers compilation of budget data, loads component displaying pie chart
      budgetFormSubmitted: false,
      // triggers visibility of tooltip (is currently set to only show for the first few seconds)
      sliderTooltipVisible: true,
      // TODO: implement dropdown that allows user choice between different currencies
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
                muiClasses: makeStyles(theme => ({
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

  // getSnapshotBeforeUpdate = (prevProps, prevState) => {};

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.root.authenticated !== this.props.root.authenticated) {
      console.log('Home --> componentDidUpdate: User is successfully authenticated.');
      this.setState({ authenticated: this.props.root.authenticated });
    }
    if (prevProps.auth.user !== this.props.auth.user) {
      console.log("Home --> componentDidUpdate: User's account is successfully loaded.");
      this.setState({ user: this.props.auth.user });
    }
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

  updateStorage = (key, value) => {
    this.setState({ [key]: value });
    localStorage.setItem(key, value);
  };

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

  validateEmailForm = values => {
    const errors = required(['email'], values);
    if (!errors.email) {
      const emailError = email(values.email, values);
      if (emailError) {
        errors.email = email(values.email, values);
      }
    }
    return errors;
  };

  // TODO: add input field for user's display name
  handleSignup = values => {
    console.log('Home --> handleSignup', values);
    event.preventDefault();
    this.setState(
      {
        error: '',
        email: values.email,
        password: values.password,
        formSent: true
      },
      () => {
        auth()
          .createUserWithEmailAndPassword(this.state.email, this.state.password)
          .then(result => {
            console.log(result);
            toast.success('👍 Email sign-up successful.');
            this.setState({ authenticated: true, user: auth().currentUser, formSent: false });
          })
          .catch(error => {
            const errorCode = error.code;
            const errorMessage = error.message;
            toast.error('🧐' + error.message);
            this.setState({ error: error.message, formSent: false });
          });
      }
    );
  };

  // wrapper method around redux action of same name
  handleEmailLogin = values => {
    console.log('Home --> handleEmailLogin', values);
    event.preventDefault();
    const reenableForm = () => this.setState({ formSent: false });
    this.setState({ formSent: true }, () => {
      this.props.handleEmailLogin(values.email, values.password, reenableForm);
    });
    // TODO: dispatch form sent and wire it up to this component
    // this.setState(
    //   {
    //     error: '',
    //     email: values.email,
    //     password: values.password,
    //     formSent: true
    //   },
    //   () => {
    //     auth()
    //       .signInWithEmailAndPassword(this.state.email, this.state.password)
    //       .then(
    //         result => {
    //           console.log(result);
    //           toast.success('👍 Email sign-in successful.');
    //           this.setState({
    //             authenticated: true,
    //             user: auth().currentUser,
    //             formSent: false
    //           });
    //         },
    //         error => {
    //           const errorCode = error.code;
    //           const errorMessage = error.message;
    //           toast.error('🧐' + error.message);
    //           this.setState({ error: error.message, formSent: false });
    //         }
    //       );
    //   }
    // );
  };

  handleResetPassword = values => {
    console.log('Home --> handleResetPassword', values);
    event.preventDefault();
    this.setState(
      {
        error: '',
        email: values.email,
        formSent: true
      },
      () => {
        auth()
          .sendPasswordResetEmail(this.state.email)
          .then(result => {
            console.log(result);
            toast.success('👍 Sent password reset email successfully.');
            this.setState({
              resetPasswordClicked: false,
              formSent: false
            });
          })
          .catch(error => {
            const errorCode = error.code;
            const errorMessage = error.message;
            toast.error('🧐' + error.message);
            this.setState({ error: error.message, formSent: false });
          });
      }
    );
  };

  handleLogout = () => {
    console.log('Home --> handleLogout');
    event.preventDefault();
    this.setState({ error: '', logoutClicked: true }, () => {
      auth()
        .signOut()
        .then(() => {
          toast.success('👍 Sign-out successful.');
          this.setState({
            user: null,
            authenticated: false,
            email: '',
            password: '',
            showPassword: false,
            formSent: false,
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
          this.setState({ error: error.message, logoutClicked: false });
        });
    });
  };

  handleOauthLogin = async () => {
    console.log('Home --> handleOauthLogin');
    event.preventDefault();
    this.setState({ error: '', oauthLoginClicked: true }, () => {
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
            console.log('Home --> handleOauthLogin --> epoch:', epoch);
            const user = result.user; // The firebase.User instance
            console.log('Home --> handleOauthLogin --> firebase.User:', user);

            // The Oauth firebase.auth.AuthCredential containing the Oauth access token
            const credential = result.credential;
            const token = result.credential.accessToken;
            console.log('Home --> handleOauthLogin --> firebase.auth.AuthCredential:', credential);
            this.setState(
              {
                authenticated: true,
                buttonPressed: false,
                oauthLoginClicked: false,
                user: auth().currentUser
              },
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
                console.log('Home --> handleOauthLogin --> providers: ', providers);
              });
            }
            this.setState({ error: error.message, oauthLoginClicked: false }, () => {
              toast.error('🧐' + this.state.error);
            });
          }
        );
    });
  };

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

  getUserName = () => {
    let userName = '';
    try {
      userName = this.state.user.displayName
        ? this.state.user.displayName.split(' ')[0].charAt(0).toUpperCase() +
          this.state.user.displayName.split(' ')[0].slice(1).toLowerCase()
        : this.state.user.email.split('@')[0].charAt(0).toUpperCase() +
          this.state.user.email.split('@')[0].slice(1).toLowerCase();
    } catch (error) {
      console.warn("Could not load user's name.", error);
    }
    return userName;
  };

  usdFormat = (value = 0) => {
    const dollarsAndCents = parseFloat(value).toFixed(2).split('.'); // [0]: dollars, [1]: cents
    dollarsAndCents[0] = dollarsAndCents[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return dollarsAndCents[1] === '00' ? '$' + dollarsAndCents[0] : '$' + dollarsAndCents.join('.');
  };

  getMonthlyExpenses = () =>
    this.usdFormat((this.state.annualSalary / 12) * (this.state.election / 100));

  getMonthlySavings = () =>
    this.usdFormat((this.state.annualSalary / 12) * ((100 - this.state.election) / 100));

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

  validateAnnualSalary = (value = MIN_ANNUAL_SALARY) => {
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

  customizePieChartTooltip = arg => {
    return { text: `${arg.argumentText}<br>${arg.seriesName}: ${arg.valueText}` };
  };

  render() {
    const {
      loading,
      authenticated,
      user,
      error,
      email,
      password,
      showPassword,
      oauthLoginClicked,
      logoutClicked,
      signupClicked,
      resetPasswordClicked,
      muiClasses,
      formSent,
      election,
      electedExpenseSliderMarks,
      electedExpenseInputMode,
      electedExpenseTooltipVisible,
      annualSalary,
      annualSalaryInputMode,
      annualSalaryTooltipVisible,
      monthlyExpenses,
      monthlySavings,
      budgetData,
      budgetFormSubmitted,
      sliderTooltipVisible,
      currency
    } = this.state;
    return loading ? (
      <LinearProgress color='secondary' />
    ) : (
      <Fragment>
        {/* TODO: add left section when logged in for choosing currency */}
        <TopNavBar
          authenticated={this.state.authenticated}
          signup={() => this.setState({ signupClicked: true, resetPasswordClicked: false })}
          login={() => this.setState({ signupClicked: false, resetPasswordClicked: false })}
          handleLogout={this.handleLogout}
        />
        {this.state.authenticated ? (
          <Fragment>
            {budgetFormSubmitted ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  // maxWidth: 840,
                  marginTop: 36,
                  marginBottom: 36
                }}
              >
                <div style={{ marginBottom: 36 }}>
                  <Typography variant='h5' gutterBottom align='center'>
                    <span style={{ fontWeight: 'bold' }}>{`Here's your budget analyis${
                      ', ' + this.getUserName()
                    }.`}</span>
                    <br />
                    Happy savings!
                  </Typography>
                </div>

                {/* Expense Report + Back Button */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'stretch',
                    alignContent: 'stretch',
                    justifyContent: 'center'
                  }}
                >
                  <PieChart
                    id={'pie'}
                    type={'doughnut'}
                    innerRadius={0.2}
                    palette={'Material'}
                    // palette='Bright'
                    dataSource={this.state.budgetData}
                  >
                    <Title text={'Analysis'}></Title>

                    <CommonSeriesSettings>
                      <Label visible={false} />
                    </CommonSeriesSettings>
                    <Series name={'Expense Report'} argumentField={'label'} valueField={'amount'} />
                    {/* <Series name={'Expense-Savings'} argumentField={'label'} valueField={'amount'} /> */}

                    <Export enabled={true} />
                    <Legend visible={true} />

                    <PCTooltip
                      enabled={true}
                      format={'currency'}
                      customizeTooltip={this.customizePieChartTooltip}
                    />
                  </PieChart>
                  {/* Expense Report */}
                  <div
                    style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
                  >
                    {/* Elected Expense */}
                    <Typography variant='h5' gutterBottom>
                      <div
                        style={{
                          width: 320,
                          marginBottom: 0,
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'stretch',
                          justifyContent: 'space-between'
                        }}
                      >
                        <span style={{}}>{`Election`}</span>
                        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                          <span style={{ fontWeight: 'bold' }}>{election}%</span>
                        </div>
                      </div>
                    </Typography>

                    {/* Annual Salary */}
                    <Typography variant='h5' gutterBottom>
                      <div
                        style={{
                          width: 320,
                          marginBottom: 0,
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'stretch',
                          justifyContent: 'space-between'
                        }}
                      >
                        <span style={{}}>{`Annual Salary`}</span>
                        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                          <span style={{ fontWeight: 'bold' }}>{this.usdFormat(annualSalary)}</span>
                        </div>
                      </div>
                    </Typography>

                    {/* Monthly Expenses */}
                    <Typography variant='h5' gutterBottom>
                      <div
                        style={{
                          width: 320,
                          marginBottom: 0,
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'stretch',
                          justifyContent: 'space-between'
                        }}
                      >
                        <span style={{}}>{`Monthly Expenses`}</span>
                        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                          <span style={{ fontWeight: 'bold' }}>{monthlyExpenses}</span>
                        </div>
                      </div>
                    </Typography>

                    {/* Monthly Savings */}
                    <Typography variant='h5' gutterBottom>
                      <div
                        style={{
                          width: 320,
                          marginBottom: 0,
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'stretch',
                          justifyContent: 'space-between'
                        }}
                      >
                        <span style={{}}>{`Monthly Savings`}</span>
                        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                          <span style={{ fontWeight: 'bold' }}>{monthlySavings}</span>
                        </div>
                      </div>
                    </Typography>
                  </div>

                  {/* Unsubmit */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-around',
                      // minWidth: 640,
                      // maxWidth: 960,
                      marginTop: 32,
                      paddingLeft: 48,
                      paddingRight: 48,
                      marginBottom: 64
                    }}
                  >
                    <Button
                      aria-label='Go Back'
                      onClick={this.handleBudgetFormSubmit}
                      disabled={!budgetFormSubmitted}
                      type='button'
                      variant='contained'
                      className={muiClasses.button}
                      size='large'
                      // color='secondary'
                      color='primary'
                      fullWidth
                    >
                      {!budgetFormSubmitted ? 'In progress…' : 'Back'}
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  // maxWidth: 840,
                  marginTop: 36,
                  marginBottom: 36
                }}
              >
                <div style={{ marginBottom: 36 }}>
                  <Typography variant='h5' gutterBottom align='center'>
                    <span style={{ fontWeight: 'bold' }}>{`Welcome${
                      ', ' + this.getUserName()
                    }!`}</span>
                    <br />
                    Let's analyze your monthly budget.
                  </Typography>
                </div>
                {/* Budget Form */}
                <div>
                  <div>
                    {/* Elected Expense */}
                    <div
                      style={{
                        paddingLeft: 48,
                        paddingRight: 48,
                        marginBottom: 64
                      }}
                    >
                      <div
                        style={{
                          marginBottom: 36,
                          display: 'flex',
                          justifyContent: 'space-between',
                          flexDirection: 'row',
                          alignItems: 'flex-end'
                        }}
                      >
                        <Typography variant='h5' gutterBottom>
                          {`How much of your salary will you contribute to elected expenses?`}
                        </Typography>
                        <InputSpacer />
                        {electedExpenseInputMode ? (
                          <div>
                            {/* TODO: replace with outlined material ui text fields */}
                            {/* TODO: implement tab to switch focus between text input fields */}
                            <div style={{ width: 180, display: 'flex', alignItems: 'center' }}>
                              <TextField
                                autoFocus
                                name='election'
                                className='election'
                                required
                                value={election || MIN_ELECTION}
                                onKeyDown={event => {
                                  event.persist();
                                  this.setState({
                                    electedExpenseInputMode: event.keyCode !== 13
                                  });
                                }}
                                onChange={event => {
                                  event.persist();
                                  this.setState(prevState => ({
                                    ...prevState,
                                    [event.target.name]: this.validateSliderExpense(
                                      event.target.value || MIN_ELECTION
                                    )
                                  }));
                                }}
                                onFocus={event => event.target.select()}
                                onBlur={() =>
                                  this.setState(prevState => ({
                                    electedExpenseInputMode: false
                                  }))
                                }
                                color='secondary'
                                margin='dense'
                                size='small'
                                type='number'
                                placeholder={`${MIN_ELECTION}`}
                              />
                            </div>
                          </div>
                        ) : (
                          <div
                            style={{
                              width: 180,
                              display: 'flex',
                              justifyContent: 'flex-end',
                              alignItems: 'center'
                            }}
                            onClick={() =>
                              this.setState(prevState => ({
                                electedExpenseInputMode: !prevState.electedExpenseInputMode,
                                electedExpenseTooltipVisible: false
                              }))
                            }
                          >
                            <Typography variant='h5' gutterBottom>
                              <InputTooltip
                                open={electedExpenseTooltipVisible}
                                // onOpen={handleTooltipOpen}
                                // onClose={handleTooltipClose}
                                title='Press to enter new value.'
                                aria-label='Budget Slider'
                                placement='right'
                                disableFocusListener
                                // disableHoverListener
                                disableTouchListener
                                arrow
                              >
                                <span style={{ color: '#e62958', fontWeight: 'bold' }}>
                                  {election}%
                                </span>
                              </InputTooltip>
                            </Typography>
                          </div>
                        )}
                      </div>
                      <SliderTooltip
                        open={sliderTooltipVisible}
                        // onOpen={handleTooltipOpen}
                        // onClose={handleTooltipClose}
                        title='Drag slider to adjust value.'
                        aria-label='Budget Slider'
                        placement='bottom'
                        disableFocusListener
                        // disableHoverListener
                        disableTouchListener
                        arrow
                      >
                        <Slider
                          color='secondary'
                          track={false}
                          name='budget'
                          min={MIN_ELECTION}
                          max={Math.max(election, MAX_ELECTION)}
                          value={election || MIN_ELECTION} // TODO: load on auth
                          valueLabelFormat={value => value + '%'}
                          // defaultValue={election}
                          step={1}
                          onChange={(event, value) =>
                            this.setState({
                              election: value,
                              electedExpenseInputMode: false
                            })
                          }
                          // onChangeCommitted={(event, value) => this.setState({ election: value })}
                          marks={electedExpenseSliderMarks}
                          valueLabelDisplay='on'
                          aria-label='Budget Slider'
                          aria-labelledby='budget-slider'
                          aria-valuetext={election + '%'}
                          getAriaLabel={value => `${value}%`}
                          getAriaValueText={value => `${value}%`}
                        />
                      </SliderTooltip>
                    </div>

                    {/* Annual Salary */}
                    <div
                      style={{
                        paddingLeft: 48,
                        paddingRight: 48,
                        marginBottom: 64
                      }}
                    >
                      <div
                        style={{
                          marginBottom: 36,
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'flex-end'
                        }}
                      >
                        <Typography variant='h5' gutterBottom>
                          {`What's your annual salary?`}
                        </Typography>
                        <InputSpacer />
                        {annualSalaryInputMode ? (
                          <Fragment>
                            <Typography variant='h5' gutterBottom>
                              <span style={{ fontWeight: 'bold' }}>{currency.label}</span>
                            </Typography>
                            {/* TODO: implement tab to switch focus between text input fields */}
                            <TextField
                              autoFocus
                              name='annualSalary'
                              className='annualSalary'
                              required
                              value={annualSalary || MIN_ANNUAL_SALARY}
                              onKeyDown={event => {
                                event.persist();
                                this.setState({
                                  annualSalaryInputMode: event.keyCode !== 13
                                });
                              }}
                              onChange={event => {
                                event.persist();
                                this.setState(prevState => ({
                                  ...prevState,
                                  [event.target.name]: this.validateAnnualSalary(
                                    event.target.value || MIN_ANNUAL_SALARY
                                  )
                                }));
                              }}
                              onFocus={event => event.target.select()}
                              onBlur={() =>
                                this.setState(prevState => ({
                                  annualSalaryInputMode: false
                                }))
                              }
                              color='secondary'
                              margin='dense'
                              size='small'
                              type='number'
                              placeholder={`${MIN_ANNUAL_SALARY}`}
                            />
                          </Fragment>
                        ) : (
                          <div
                            onClick={() =>
                              this.setState(prevState => ({
                                annualSalaryInputMode: !prevState.annualSalaryInputMode,
                                annualSalaryTooltipVisible: false
                              }))
                            }
                          >
                            <Typography variant='h5' gutterBottom>
                              <InputTooltip
                                open={annualSalaryTooltipVisible}
                                // onOpen={handleTooltipOpen}
                                // onClose={handleTooltipClose}
                                title='Press to enter new value.'
                                aria-label='Budget Slider'
                                placement='right'
                                disableFocusListener
                                // disableHoverListener
                                disableTouchListener
                                arrow
                              >
                                {/* TODO: resolve decimal bug */}
                                <span style={{ color: '#e62958', fontWeight: 'bold' }}>
                                  {this.usdFormat(annualSalary)}
                                </span>
                              </InputTooltip>
                            </Typography>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Monthly Expenses */}
                    <div
                      style={{
                        paddingLeft: 48,
                        paddingRight: 48,
                        marginBottom: 64
                      }}
                    >
                      <div
                        style={{
                          marginBottom: 36,
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'flex-end'
                        }}
                      >
                        <Typography variant='h5' gutterBottom>
                          {`Your total monthly expenses amount to `}
                          <span style={{ fontWeight: 'bold' }}>{monthlyExpenses}.</span>
                        </Typography>
                      </div>
                    </div>

                    {/* Monthly Savings */}
                    <div
                      style={{
                        paddingLeft: 48,
                        paddingRight: 48,
                        marginBottom: 64
                      }}
                    >
                      <div
                        style={{
                          marginBottom: 36,
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'flex-end'
                        }}
                      >
                        <Typography variant='h5' gutterBottom>
                          {`Your monthly savings amount to `}
                          <span style={{ fontWeight: 'bold' }}>{monthlySavings}.</span>
                        </Typography>
                      </div>
                    </div>
                  </div>

                  {/* Submit Budget */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-around',
                      // minWidth: 640,
                      // maxWidth: 960,
                      paddingLeft: 48,
                      paddingRight: 48,
                      marginBottom: 64
                    }}
                  >
                    <Button
                      aria-label='Submit Budget Form'
                      onClick={this.handleBudgetFormSubmit}
                      disabled={budgetFormSubmitted}
                      type='button'
                      variant='contained'
                      className={muiClasses.button}
                      size='large'
                      // color='secondary'
                      color='secondary'
                      fullWidth
                    >
                      {budgetFormSubmitted ? 'In progress…' : 'Submit'}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </Fragment>
        ) : (
          <>
            {/* Signup Form */}
            {signupClicked && (
              <Container>
                <div
                  style={{
                    display: 'flex',
                    flexFlow: 'column nowrap',
                    justifyContent: 'space-evenly',
                    alignItems: 'center',
                    alignContent: 'center'
                  }}
                >
                  <PiggyBankLogo width={250} height={250} />
                  <Typography variant='h3' gutterBottom marked='center' align='center'>
                    Welcome!
                  </Typography>
                  <Typography variant='body2' align='center'>
                    Please sign up to continue.
                  </Typography>
                </div>

                <Form
                  onSubmit={this.handleSignup}
                  subscription={{ submitting: true }}
                  validate={this.validateForm}
                  onChange={this.handleFormChange}
                >
                  {({ handleSubmit, submitting }) => (
                    <form onSubmit={handleSubmit} className={muiClasses.form} noValidate>
                      <Field
                        autoComplete='email'
                        autoFocus
                        component={RFTextField}
                        disabled={submitting || formSent}
                        fullWidth
                        label='Email'
                        margin='normal'
                        name='email'
                        required
                        size='large'
                      />
                      <Field
                        fullWidth
                        size='large'
                        component={RFTextField}
                        disabled={submitting || formSent}
                        required
                        name='password'
                        autoComplete='current-password'
                        label='Password'
                        type={showPassword ? 'text' : 'password'}
                        margin='normal'
                        InputProps={{
                          endAdornment: (
                            <div style={{ position: 'absolute', right: 24 }}>
                              <InputAdornment position='end'>
                                <IconButton
                                  aria-label='toggle password visibility'
                                  onClick={event =>
                                    this.setState(prevState => ({
                                      showPassword: !prevState.showPassword
                                    }))
                                  }
                                  onMouseDown={event => event.preventDefault()}
                                  edge='end'
                                >
                                  {showPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                              </InputAdornment>
                            </div>
                          )
                        }}
                      />
                      {/* High Performance with Subscriptions */}
                      {/* https://final-form.org/docs/react-final-form/examples/subscriptions */}
                      <FormSpy subscription={{ submitError: true }}>
                        {({ submitError }) =>
                          submitError ? (
                            <FormFeedback className={muiClasses.feedback} error>
                              {submitError}
                            </FormFeedback>
                          ) : null
                        }
                      </FormSpy>
                      <div style={{ marginTop: 36 }}>
                        <FormButton
                          aria-label='Submit form to sign up with email and password'
                          className={muiClasses.button}
                          disabled={submitting || formSent}
                          size='large'
                          color='secondary'
                          fullWidth
                        >
                          {submitting || formSent ? 'In progress…' : 'Sign up'}
                        </FormButton>
                      </div>
                    </form>
                  )}
                </Form>
                <div style={{ marginTop: 16, marginBottom: 24 }}>
                  <Typography variant='body2' align='center'>
                    <span
                      style={{ cursor: 'pointer' }}
                      onClick={() =>
                        this.setState({ signupClicked: false, resetPasswordClicked: false })
                      }
                    >
                      {'Sign in'}
                    </span>
                    <span
                      style={{
                        backgroundColor: '#69696a',
                        padding: 0.5,
                        paddingTop: 4,
                        paddingBottom: 4,
                        marginLeft: 24,
                        marginRight: 24
                      }}
                    />

                    <span
                      style={{ cursor: 'pointer' }}
                      onClick={() =>
                        this.setState({ resetPasswordClicked: true, signupClicked: false })
                      }
                    >
                      Reset password
                    </span>
                  </Typography>
                </div>
              </Container>
            )}
            {/* Reset Password Form */}
            {resetPasswordClicked && (
              <Container>
                <div
                  style={{
                    display: 'flex',
                    flexFlow: 'column nowrap',
                    justifyContent: 'space-evenly',
                    alignItems: 'center',
                    alignContent: 'center'
                  }}
                >
                  <PiggyBankLogo width={250} height={250} />
                  <Typography variant='h3' gutterBottom marked='center' align='center'>
                    Welcome!
                  </Typography>
                  <Typography variant='body2' align='center'>
                    Enter your email to send password reset instructions.
                  </Typography>
                </div>

                <Form
                  onSubmit={this.handleResetPassword}
                  subscription={{ submitting: true }}
                  validate={this.validateEmailForm}
                  onChange={this.handleFormChange}
                >
                  {({ handleSubmit, submitting }) => (
                    <form onSubmit={handleSubmit} className={muiClasses.form} noValidate>
                      <Field
                        autoComplete='email'
                        autoFocus
                        component={RFTextField}
                        disabled={submitting || formSent}
                        fullWidth
                        label='Email'
                        margin='normal'
                        name='email'
                        required
                        size='large'
                      />
                      {/* High Performance with Subscriptions */}
                      {/* https://final-form.org/docs/react-final-form/examples/subscriptions */}
                      <FormSpy subscription={{ submitError: true }}>
                        {({ submitError }) =>
                          submitError ? (
                            <FormFeedback className={muiClasses.feedback} error>
                              {submitError}
                            </FormFeedback>
                          ) : null
                        }
                      </FormSpy>
                      <div style={{ marginTop: 36 }}>
                        <FormButton
                          aria-label='Submit form to request password reset'
                          className={muiClasses.button}
                          disabled={submitting || formSent}
                          size='large'
                          color='secondary'
                          fullWidth
                        >
                          {submitting || formSent ? 'In progress…' : 'Request Password Reset'}
                        </FormButton>
                      </div>
                    </form>
                  )}
                </Form>
                <div style={{ marginTop: 16, marginBottom: 24 }}>
                  <Typography variant='body2' align='center'>
                    <span
                      style={{ cursor: 'pointer' }}
                      onClick={() =>
                        this.setState({ signupClicked: true, resetPasswordClicked: false })
                      }
                    >
                      {'Sign up'}
                    </span>
                    <span
                      style={{
                        backgroundColor: '#69696a',
                        padding: 0.5,
                        paddingTop: 4,
                        paddingBottom: 4,
                        marginLeft: 24,
                        marginRight: 24
                      }}
                    />

                    <span
                      style={{ cursor: 'pointer' }}
                      onClick={() =>
                        this.setState({ resetPasswordClicked: false, signupClicked: false })
                      }
                    >
                      Sign in
                    </span>
                  </Typography>
                </div>
              </Container>
            )}
            {/* Email Login Form */}
            {!signupClicked && !resetPasswordClicked && (
              <Container>
                <div
                  style={{
                    display: 'flex',
                    flexFlow: 'column nowrap',
                    justifyContent: 'space-evenly',
                    alignItems: 'center',
                    alignContent: 'center'
                  }}
                >
                  <PiggyBankLogo width={250} height={250} />
                  <Typography variant='h3' gutterBottom marked='center' align='center'>
                    Welcome!
                  </Typography>
                  <Typography variant='body2' align='center'>
                    Please sign in to continue.
                  </Typography>
                </div>

                <Form
                  onSubmit={this.handleEmailLogin}
                  subscription={{ submitting: true }}
                  validate={this.validateForm}
                  onChange={this.handleFormChange}
                >
                  {({ handleSubmit, submitting }) => (
                    <form onSubmit={handleSubmit} className={muiClasses.form} noValidate>
                      <Field
                        autoComplete='email'
                        autoFocus
                        component={RFTextField}
                        disabled={submitting || formSent}
                        fullWidth
                        label='Email'
                        margin='normal'
                        name='email'
                        required
                        size='large'
                      />
                      <Field
                        fullWidth
                        size='large'
                        component={RFTextField}
                        disabled={submitting || formSent}
                        required
                        name='password'
                        autoComplete='current-password'
                        label='Password'
                        type={showPassword ? 'text' : 'password'}
                        margin='normal'
                        InputProps={{
                          endAdornment: (
                            <div style={{ position: 'absolute', right: 24 }}>
                              <InputAdornment position='end'>
                                <IconButton
                                  aria-label='toggle password visibility'
                                  onClick={event =>
                                    this.setState(prevState => ({
                                      showPassword: !prevState.showPassword
                                    }))
                                  }
                                  onMouseDown={event => event.preventDefault()}
                                  edge='end'
                                >
                                  {showPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                              </InputAdornment>
                            </div>
                          )
                        }}
                      />
                      {/* High Performance with Subscriptions */}
                      {/* https://final-form.org/docs/react-final-form/examples/subscriptions */}
                      <FormSpy subscription={{ submitError: true }}>
                        {({ submitError }) =>
                          submitError ? (
                            <FormFeedback className={muiClasses.feedback} error>
                              {submitError}
                            </FormFeedback>
                          ) : null
                        }
                      </FormSpy>
                      <div style={{ marginTop: 36 }}>
                        <FormButton
                          aria-label='Submit form to login with email and password'
                          className={muiClasses.button}
                          disabled={submitting || formSent}
                          size='large'
                          color='secondary'
                          fullWidth
                        >
                          {submitting || formSent ? 'In progress…' : 'Sign In'}
                        </FormButton>
                      </div>
                    </form>
                  )}
                </Form>
                <div style={{ marginTop: 16, marginBottom: 24 }}>
                  <Typography variant='body2' align='center'>
                    <span
                      style={{ cursor: 'pointer' }}
                      onClick={() =>
                        this.setState({ signupClicked: true, resetPasswordClicked: false })
                      }
                    >
                      {'Sign up'}
                    </span>
                    <span
                      style={{
                        backgroundColor: '#69696a',
                        padding: 0.5,
                        paddingTop: 4,
                        paddingBottom: 4,
                        marginLeft: 24,
                        marginRight: 24
                      }}
                    />

                    <span
                      style={{ cursor: 'pointer' }}
                      onClick={() =>
                        this.setState({ resetPasswordClicked: true, signupClicked: false })
                      }
                    >
                      Reset password
                    </span>
                  </Typography>
                </div>
                <Fragment>
                  <Button
                    aria-label='Sign in with Google'
                    onClick={this.handleOauthLogin}
                    disabled={oauthLoginClicked}
                    type='button'
                    variant='contained'
                    className={muiClasses.button}
                    size='large'
                    // color='secondary'
                    color='primary'
                    fullWidth
                  >
                    {oauthLoginClicked ? 'In progress…' : 'Sign in with Google'}
                  </Button>
                </Fragment>
              </Container>
            )}
          </>
        )}
      </Fragment>
    );
  }
}

const mapStateToProps = ({ root, auth, data, ...rest }) => ({
  root,
  auth,
  data
});

const mapDispatchToProps = { handleEmailLogin };

export default connect(mapStateToProps, mapDispatchToProps)(withRoot(Home));
