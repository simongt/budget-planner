import withRoot from '../lib/withRoot';
import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { Field, Form, FormSpy } from 'react-final-form';
import { makeStyles } from '@material-ui/core/styles';
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
const MAX_BUDGET = 250000;
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

class Login extends Component {
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
      sliderMarks: [],
      sliderValue: 100000,
      replaceWithInput: false,
      sliderTooltipIsOpen: false,
      currency: {
        value: 'USD',
        label: '$'
      }
    };
  }

  componentDidMount = () => {
    console.log('Login --> componentDidMount', this.props);
    const sliderMarks = [];
    let value = MAX_BUDGET;
    while (value >= 0) {
      sliderMarks.push({
        value,
        label: this.abbreviateValue(value)
      });
      value -= 25000; // TODO: make responsive, wider screen should see more slider marks
    }
    this.setState(
      {
        authenticated: this.props.authenticated,
        user: this.props.authenticated ? auth().currentUser : null,
        sliderMarks,
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
        this.setState({ loading: false });
      }
    );
  };

  validate = values => {
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
            sliderTooltipIsOpen: false
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

  abbreviateValue = value => {
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
      sliderMarks,
      sliderValue,
      replaceWithInput
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
          <Fragment>
            <div style={{ marginTop: 36, marginBottom: 36 }}>
              <div style={{ marginBottom: 36 }}>
                <Typography variant='h5' gutterBottom align='center'>
                  <span
                    style={{ fontSize: 24, fontWeight: '500' }}
                  >{`Welcome to your monthly budget${', ' + this.getUserName()}!`}</span>
                </Typography>
              </div>
              <Fragment>
                {/* Annual Salary */}
                <div
                  style={{
                    minWidth: 640,
                    // maxWidth: 1280,
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
                    <span style={{ width: 8, height: 48 }}></span>
                    {replaceWithInput ? (
                      <TextField
                        autoFocus
                        name='sliderValue'
                        className='currency-value'
                        required
                        value={sliderValue || 0}
                        onChange={event => {
                          event.persist();
                          this.setState(prevState => ({
                            ...prevState,
                            [event.target.name]: event.target.value
                          }));
                        }}
                        onFocus={event => event.target.select()}
                        onBlur={() =>
                          this.setState(prevState => ({
                            replaceWithInput: !prevState.replaceWithInput
                          }))
                        }
                        color='secondary'
                        margin='dense'
                        size='small'
                        type='number'
                        placeholder='0'
                      />
                    ) : (
                      <div
                        onClick={() =>
                          this.setState(prevState => ({
                            replaceWithInput: !prevState.replaceWithInput
                          }))
                        }
                      >
                        <Typography variant='h5' gutterBottom>
                          <Tooltip
                            // open={sliderTooltipIsOpen}
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
                              {this.usdFormat(sliderValue)}
                            </span>
                          </Tooltip>
                        </Typography>
                      </div>
                    )}
                  </div>
                  <Tooltip
                    // open={sliderTooltipIsOpen}
                    // onOpen={handleTooltipOpen}
                    // onClose={handleTooltipClose}
                    title='Drag slider to adjust value.'
                    aria-label='Budget Slider'
                    placement='top'
                    disableFocusListener
                    // disableHoverListener
                    disableTouchListener
                    arrow
                  >
                    <Slider
                      color='secondary'
                      track={false}
                      name='budget'
                      min={sliderValue > 250000 ? sliderValue - 250000 : 0}
                      max={Math.max(sliderValue, MAX_BUDGET)}
                      // defaultValue={sliderValue}
                      value={this.state.sliderValue || 0} // TODO: load on auth
                      valueLabelFormat={value => this.abbreviateValue(value)}
                      step={500}
                      onChange={(event, value) =>
                        this.setState({ sliderValue: value, replaceWithInput: false })
                      }
                      // onChangeCommitted={(event, value) => this.setState({ sliderValue: value })}
                      marks={sliderMarks}
                      valueLabelDisplay='on'
                      aria-label='Budget Slider'
                      aria-labelledby='budget-slider'
                      aria-valuetext={this.abbreviateValue(sliderValue)}
                      getAriaLabel={value => `${value}`}
                      getAriaValueText={value => `${value}`}
                    />
                  </Tooltip>
                </div>
                {/* Monthly Expenses */}
                <div
                  style={{
                    minWidth: 640,
                    // maxWidth: 1280,
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
                      {`What is the total amount of your monthly expenses?`}
                    </Typography>
                    <span style={{ width: 8, height: 48 }}></span>
                    {replaceWithInput ? (
                      <TextField
                        autoFocus
                        name='sliderValue'
                        className='currency-value'
                        required
                        value={sliderValue || 0}
                        onChange={event => {
                          event.persist();
                          this.setState(prevState => ({
                            ...prevState,
                            [event.target.name]: event.target.value
                          }));
                        }}
                        onFocus={event => event.target.select()}
                        onBlur={() =>
                          this.setState(prevState => ({
                            replaceWithInput: !prevState.replaceWithInput
                          }))
                        }
                        color='secondary'
                        margin='dense'
                        size='small'
                        type='number'
                        placeholder='0'
                      />
                    ) : (
                      <div
                        onClick={() =>
                          this.setState(prevState => ({
                            replaceWithInput: !prevState.replaceWithInput
                          }))
                        }
                      >
                        <Typography variant='h5' gutterBottom>
                          <Tooltip
                            // open={sliderTooltipIsOpen}
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
                              {this.usdFormat(sliderValue)}
                            </span>
                          </Tooltip>
                        </Typography>
                      </div>
                    )}
                  </div>
                  <Tooltip
                    // open={sliderTooltipIsOpen}
                    // onOpen={handleTooltipOpen}
                    // onClose={handleTooltipClose}
                    title='Drag slider to adjust value.'
                    aria-label='Budget Slider'
                    placement='top'
                    disableFocusListener
                    // disableHoverListener
                    disableTouchListener
                    arrow
                  >
                    <Slider
                      color='secondary'
                      track={false}
                      name='budget'
                      min={sliderValue > 250000 ? sliderValue - 250000 : 0}
                      max={Math.max(sliderValue, MAX_BUDGET)}
                      // defaultValue={sliderValue}
                      value={this.state.sliderValue || 0} // TODO: load on auth
                      valueLabelFormat={value => this.abbreviateValue(value)}
                      step={500}
                      onChange={(event, value) =>
                        this.setState({ sliderValue: value, replaceWithInput: false })
                      }
                      // onChangeCommitted={(event, value) => this.setState({ sliderValue: value })}
                      marks={sliderMarks}
                      valueLabelDisplay='on'
                      aria-label='Budget Slider'
                      aria-labelledby='budget-slider'
                      aria-valuetext={this.abbreviateValue(sliderValue)}
                      getAriaLabel={value => `${value}`}
                      getAriaValueText={value => `${value}`}
                    />
                  </Tooltip>
                </div>
                {/* Savings */}
                <div
                  style={{
                    minWidth: 640,
                    // maxWidth: 1280,
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
                      {`What is the total amount of your savings?`}
                    </Typography>
                    <span style={{ width: 8, height: 48 }}></span>
                    {replaceWithInput ? (
                      <TextField
                        autoFocus
                        name='sliderValue'
                        className='currency-value'
                        required
                        value={sliderValue || 0}
                        onChange={event => {
                          event.persist();
                          this.setState(prevState => ({
                            ...prevState,
                            [event.target.name]: event.target.value
                          }));
                        }}
                        onFocus={event => event.target.select()}
                        onBlur={() =>
                          this.setState(prevState => ({
                            replaceWithInput: !prevState.replaceWithInput
                          }))
                        }
                        color='secondary'
                        margin='dense'
                        size='small'
                        type='number'
                        placeholder='0'
                      />
                    ) : (
                      <div
                        onClick={() =>
                          this.setState(prevState => ({
                            replaceWithInput: !prevState.replaceWithInput
                          }))
                        }
                      >
                        <Typography variant='h5' gutterBottom>
                          <Tooltip
                            // open={sliderTooltipIsOpen}
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
                              {this.usdFormat(sliderValue)}
                            </span>
                          </Tooltip>
                        </Typography>
                      </div>
                    )}
                  </div>
                  <Tooltip
                    // open={sliderTooltipIsOpen}
                    // onOpen={handleTooltipOpen}
                    // onClose={handleTooltipClose}
                    title='Drag slider to adjust value.'
                    aria-label='Budget Slider'
                    placement='top'
                    disableFocusListener
                    // disableHoverListener
                    disableTouchListener
                    arrow
                  >
                    <Slider
                      color='secondary'
                      track={false}
                      name='budget'
                      min={sliderValue > 250000 ? sliderValue - 250000 : 0}
                      max={Math.max(sliderValue, MAX_BUDGET)}
                      // defaultValue={sliderValue}
                      value={this.state.sliderValue || 0} // TODO: load on auth
                      valueLabelFormat={value => this.abbreviateValue(value)}
                      step={500}
                      onChange={(event, value) =>
                        this.setState({ sliderValue: value, replaceWithInput: false })
                      }
                      // onChangeCommitted={(event, value) => this.setState({ sliderValue: value })}
                      marks={sliderMarks}
                      valueLabelDisplay='on'
                      aria-label='Budget Slider'
                      aria-labelledby='budget-slider'
                      aria-valuetext={this.abbreviateValue(sliderValue)}
                      getAriaLabel={value => `${value}`}
                      getAriaValueText={value => `${value}`}
                    />
                  </Tooltip>
                </div>
              </Fragment>
            </div>
          </Fragment>
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
                validate={this.validate}
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
