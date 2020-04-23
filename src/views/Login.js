import withRoot from '../lib/withRoot';
import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
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
import Typography from '../components/Typography';
import AppAppBar from './AppAppBar';
import AppForm from './AppForm';
import TextField from '../components/TextField';
import Button from '../components/Button';
import RFTextField from '../components/form/RFTextField';
import FormButton from '../components/form/FormButton';
import FormFeedback from '../components/form/FormFeedback';
import { email, required } from '../components/form/validation';

// import { connect } from 'react-redux';
import { auth, signinWithGoogle } from '../services/firebase';
import 'react-toastify/dist/ReactToastify.css';

// constants
const MIN_ELECTION = 1;
const MAX_ELECTION = 30; // <= 30%
const MIN_ANNUAL_SALARY = 1;
const MAX_ANNUAL_SALARY = 1000000000; // <= $1B

const currencies = [
  {
    value: 'USD',
    label: '$'
  },
  {
    value: 'EUR',
    label: '€'
  },
  {
    value: 'BTC',
    label: '฿'
  },
  {
    value: 'JPY',
    label: '¥'
  }
];

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

const InputSpacer = () => <span style={{ width: 8, height: 48 }}></span>;

class Login extends Component {
  constructor(props) {
    super(props);

    this.autoClearTooltips = null;

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
      electedExpense: 15,
      electedExpenseSliderMarks: [],
      electedExpenseInputMode: false,
      electedExpenseTooltipVisible: true,
      annualSalary: 100000,
      annualSalaryInputMode: false,
      annualSalaryTooltipVisible: true,
      budgetFormSubmitted: false,
      sliderTooltipVisible: false,
      currency: {
        value: 'USD',
        label: '$'
      }
    };
  }

  componentDidMount = () => {
    console.log('Login --> componentDidMount', this.props);
    const electedExpenseSliderMarks = [];
    let election = MAX_ELECTION;
    while (election >= MIN_ELECTION) {
      // TODO: better responsivity: show less/more marks on narrow/wide screens by adjusting % N
      if (election % 5 === 0 || election === MIN_ELECTION || election === MAX_ELECTION) {
        electedExpenseSliderMarks.push({
          value: election,
          label: election + '%'
        });
      }
      election--;
    }
    this.setState(
      {
        authenticated: this.props.authenticated,
        user: this.props.authenticated ? auth().currentUser : null,
        electedExpenseSliderMarks,
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
        this.setState({ loading: false }, () => {
          if (!this.state.electedExpenseInputMode && !this.state.annualSalaryInputMode) {
            this.autoClearTooltips = setTimeout(() => {
              this.setState({
                electedExpenseTooltipVisible: false,
                annualSalaryTooltipVisible: false
              });
            }, 5000);
          }
        });
      }
    );
  };

  componentWillUnmount = () => {
    if (this.autoClearTooltips) {
      clearTimeout(this.autoClearTooltips);
      this.autoClearTooltips = null;
    }
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

  handleLoginPress = () => {
    console.log('Login --> handleLoginPress');
    event.preventDefault();
    this.setState({ error: '', emailLoginPressed: true, sent: true }, () => {
      auth()
        .signInWithEmailAndPassword(this.state.email, this.state.password)
        .then(result => {
          console.log(result);
          toast.success('👍 Email sign-in successful.');
          this.setState({ user: auth().currentUser, emailLoginPressed: false });
        })
        .catch(error => {
          const errorCode = error.code;
          const errorMessage = error.message;
          toast.error('🧐' + error.message);
          this.setState({ error: error.message, emailLoginPressed: false });
        });
    });
  };

  handleLogoutPress = () => {
    console.log('Login --> handleLogoutPress');
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

  handleOauthLoginPress = async () => {
    console.log('Login --> handleOauthLoginPress');
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
            console.log('Login --> handleOauthLoginPress --> epoch:', epoch);
            const user = result.user; // The firebase.User instance
            console.log('Login --> handleOauthLoginPress --> firebase.User:', user);

            // The Facebook firebase.auth.AuthCredential containing the Facebook access token
            const credential = result.credential;
            const token = result.credential.accessToken;
            console.log(
              'Login --> handleOauthLoginPress --> firebase.auth.AuthCredential:',
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
                console.log('Login --> handleOauthLoginPress --> providers: ', providers);
              });
            }
            this.setState({ error: error.message, oauthLoginPressed: false }, () => {
              toast.error('🧐' + this.state.error);
            });
          }
        );
    });
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

  getUserName = () => this.state.user.displayName.split(' ')[0];

  usdFormat = value => {
    const dollarsAndCents = value.toString().split('.'); // [0]: dollars, [1]: cents
    dollarsAndCents[0] = dollarsAndCents[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return '$' + dollarsAndCents.join('.');
  };

  validateSliderExpense = (value = MIN_ELECTION) => {
    // TODO: round percent value to two decimal places
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

  validateSalary = (value = MIN_ANNUAL_SALARY) => {
    // TODO: round dollar value to two decimal places
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

  handleBudgetFormSubmit = event => {
    console.log('Login --> handleLoginPress');
    event.preventDefault();
    this.setState({ error: '', budgetFormSubmitted: true }, () => {
      toast.info(
        `Calculating expense report for ${this.abbreviateUsdFormat(
          this.state.annualSalary
        )} salary with ${this.state.electedExpense}% election.`
      );
      setTimeout(() => {
        this.setState({ budgetFormSubmitted: false });
      }, 1500);
    });
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
      classes,
      sent,
      oauthLoginPressed,
      currency,
      electedExpenseSliderMarks,
      electedExpense,
      electedExpenseInputMode,
      electedExpenseTooltipVisible,
      annualSalary,
      annualSalaryInputMode,
      annualSalaryTooltipVisible,
      budgetFormSubmitted
    } = this.state;
    return loading ? (
      <LinearProgress color='secondary' />
    ) : (
      <Fragment>
        {/* TODO: add left section when logged in for choosing currency */}
        <AppAppBar
          authenticated={authenticated}
          oauthLogin={this.handleOauthLoginPress}
          logout={this.handleLogoutPress}
        />
        {authenticated ? (
          <div
          // style={{
          //   display: 'grid',
          //   placeItems: 'center'
          // }}
          >
            <div
              style={{
                // display: 'grid',
                // placeItems: 'center',
                // maxWidth: 840,
                marginTop: 36,
                marginBottom: 36
              }}
            >
              <div style={{ marginBottom: 36 }}>
                <Typography variant='h5' gutterBottom align='center'>
                  <span
                    style={{ fontSize: 24, fontWeight: '500' }}
                  >{`Welcome to your monthly budget${', ' + this.getUserName()}!`}</span>
                </Typography>
              </div>
              {/* Budget Form */}
              <Fragment>
                {/* Elected Expense */}
                <div
                  style={{
                    // display: 'grid',
                    // placeItems: 'center',
                    // minWidth: 640,
                    // maxWidth: 960,
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
                      {`How much of your salary will you contribute to elected expenses?`}
                    </Typography>
                    <InputSpacer />
                    {electedExpenseInputMode ? (
                      <Fragment>
                        {/* TODO: implement tab to switch focus between text input fields */}
                        <TextField
                          autoFocus
                          name='electedExpense'
                          className='electedExpense'
                          required
                          value={electedExpense || MIN_ELECTION}
                          onKeyDown={event => {
                            event.persist();
                            this.setState(prevState => ({
                              electedExpenseInputMode: event.keyCode !== 13
                            }));
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
                        <Typography variant='h5' gutterBottom>
                          <span style={{ fontWeight: 'bold' }}>%</span>
                        </Typography>
                      </Fragment>
                    ) : (
                      <div
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
                            <span style={{ fontWeight: 'bold' }}>{electedExpense}%</span>
                          </InputTooltip>
                        </Typography>
                      </div>
                    )}
                  </div>
                  <SliderTooltip
                    // open={sliderTooltipVisible}
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
                      max={Math.max(electedExpense, MAX_ELECTION)}
                      // defaultValue={electedExpense}
                      value={this.state.electedExpense || MIN_ELECTION} // TODO: load on auth
                      valueLabelFormat={value => value + '%'}
                      step={1}
                      onChange={(event, value) =>
                        this.setState({
                          electedExpense: value,
                          electedExpenseInputMode: false
                        })
                      }
                      // onChangeCommitted={(event, value) => this.setState({ electedExpense: value })}
                      marks={electedExpenseSliderMarks}
                      valueLabelDisplay='on'
                      aria-label='Budget Slider'
                      aria-labelledby='budget-slider'
                      aria-valuetext={electedExpense + '%'}
                      getAriaLabel={value => `${value}%`}
                      getAriaValueText={value => `${value}%`}
                    />
                  </SliderTooltip>
                </div>

                {/* Annual Salary */}
                <div
                  style={{
                    // display: 'grid',
                    // placeItems: 'center',
                    // minWidth: 640,
                    // maxWidth: 960,
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
                            this.setState(prevState => ({
                              annualSalaryInputMode: event.keyCode !== 13
                            }));
                          }}
                          onChange={event => {
                            event.persist();
                            this.setState(prevState => ({
                              ...prevState,
                              [event.target.name]: this.validateSalary(
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
                            <span style={{ fontWeight: 'bold' }}>
                              {this.usdFormat(annualSalary)}
                            </span>
                          </InputTooltip>
                        </Typography>
                      </div>
                    )}
                  </div>
                </div>
                {/* Submit Budget */}
                <div>
                  <Button
                    aria-label='Submit Budget Form'
                    onClick={this.handleBudgetFormSubmit}
                    disabled={budgetFormSubmitted}
                    type='button'
                    variant='contained'
                    className={classes.button}
                    size='large'
                    // color='secondary'
                    color='secondary'
                    fullWidth
                  >
                    {budgetFormSubmitted ? 'In progress…' : 'Submit'}
                  </Button>
                </div>
              </Fragment>
            </div>
          </div>
        ) : (
          <Fragment>
            <AppForm>
              <Fragment>
                <Typography variant='h3' gutterBottom marked='center' align='center'>
                  Sign In
                </Typography>
                <Typography variant='body2' gutterBottom align='center'>
                  {'Not a member yet? '}
                  <MuiLink href='/sign-up' align='center' underline='always'>
                    {'Sign up here'}
                  </MuiLink>
                </Typography>
                <Typography variant='body2' align='center'>
                  <MuiLink underline='always' href='/premium-themes/onepirate/forgot-password/'>
                    Forgot password?
                  </MuiLink>
                </Typography>
              </Fragment>
              <Form
                onSubmit={this.handleLoginPress}
                subscription={{ submitting: true }}
                validateForm={this.validateForm}
              >
                {({ handleSubmit, submitting }) => (
                  <form onSubmit={handleSubmit} className={classes.form} /* noValidate */>
                    <Field
                      autoComplete='email'
                      autoFocus
                      component={RFTextField}
                      disabled={submitting || sent}
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
                      disabled={submitting || sent}
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
                    <FormSpy subscription={{ submitError: true }}>
                      {({ submitError }) =>
                        submitError ? (
                          <FormFeedback className={classes.feedback} error>
                            {submitError}
                          </FormFeedback>
                        ) : null
                      }
                    </FormSpy>
                    <Typography variant='h3' gutterBottom align='center'></Typography>
                    <FormButton
                      aria-label='Submit form to login with email and password'
                      className={classes.button}
                      disabled={submitting || sent}
                      size='large'
                      color='secondary'
                      fullWidth
                    >
                      {submitting || sent ? 'In progress…' : 'Sign In'}
                    </FormButton>
                  </form>
                )}
              </Form>
              <Fragment>
                <Typography variant='h3' gutterBottom align='center'></Typography>
                <Button
                  aria-label='Sign in with Google'
                  onClick={this.handleOauthLoginPress}
                  disabled={oauthLoginPressed}
                  type='button'
                  variant='contained'
                  className={classes.button}
                  size='large'
                  // color='secondary'
                  color='primary'
                  fullWidth
                >
                  {oauthLoginPressed ? 'In progress…' : 'Sign in with Google'}
                </Button>
              </Fragment>
            </AppForm>
          </Fragment>
        )}
      </Fragment>
    );
  }
}

// const mapStateToProps = (state) => ({});

// const mapDispatchToProps = {};

// export default connect(mapStateToProps, mapDispatchToProps)(Login);

// export default Login;

export default withRoot(Login);
