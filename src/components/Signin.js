import React, { Component } from 'react';
// import { connect } from 'react-redux';

class Signin extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
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
          onSubmit={this.handleLoginPress}
          subscription={{ submitting: true }}
          validate={this.validateForm}
          onChange={this.handleFormChange}
        >
          {({ handleSubmit, submitting, onChange }) => (
            <form onSubmit={handleSubmit} className={classes.form} noValidate>
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
              {/* High Performance with Subscriptions */}
              {/* https://final-form.org/docs/react-final-form/examples/subscriptions */}
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
        <div style={{ marginTop: 16, marginBottom: 24 }}>
          <Typography variant='body2' align='center'>
            <MuiLink align='center' underline='always'>
              {'Sign up'}
            </MuiLink>
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
            <MuiLink underline='always'>Forgot password?</MuiLink>
          </Typography>
        </div>
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
      </Container>
    );
  }
}

// const mapStateToProps = (state) => ({});

// const mapDispatchToProps = {};

// export default connect(mapStateToProps, mapDispatchToProps)(Signin);

export default Signin;
