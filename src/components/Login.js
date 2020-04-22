import React, { Component } from 'react';
import { Link } from 'react-router-dom';
// import { connect } from 'react-redux';
import { auth, signinWithGoogle } from '../services/firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      submitPressed: false,
      user: null,
      authenticated: false,
      error: null,
      email: '',
      password: ''
    };
  }

  componentDidMount = () => {
    console.log('Login --> componentDidMount', this.props);
    this.setState(
      {
        authenticated: this.props.authenticated,
        user: this.props.authenticated ? auth().currentUser : null
      },
      () => {
        this.setState({ loading: false });
      }
    );
  };

  handleLogin = () => {
    console.log('Login --> handleLogin');
    event.preventDefault();
    this.setState({ error: '', submitPressed: true }, () => {
      auth()
        .signInWithEmailAndPassword(this.state.email, this.state.password)
        .then((result) => {
          console.log(result);
          toast('Email sign-in successful.');
          this.setState({ user: auth().currentUser, submitPressed: false });
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          toast(error.message);
          this.setState({ error: error.message, submitPressed: false });
        });
    });
  };

  handleLogout = () => {
    console.log('Login --> handleLogout');
    event.preventDefault();
    this.setState({ error: '', submitPressed: true }, () => {
      auth()
        .signOut()
        .then(() => {
          toast('Sign-out successful.');
          this.setState({ user: null, submitPressed: false });
          // auth().onAuthStateChanged((user) => {
          //   if (user !== null) {
          //     // Sign-out successful.
          //   }
          // });
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          toast(error.message);
          this.setState({ error: error.message, submitPressed: false });
        });
    });
  };

  handleChange = (event) => {
    event.persist();
    // dynamically determine the key and set the corresponding state variable
    this.setState((prevState) => ({
      // ...prevState,
      // if user changes any single attribute, it will mutate that corresponding attribute in state
      [event.target.name]: event.target.value
    }));
  };

  handleGoogleSignin = async () => {
    console.log('Login --> handleGoogleSignin');
    event.preventDefault();
    this.setState({ error: '', submitPressed: true }, () => {
      // Creates the provider object
      const provider = new auth.GoogleAuthProvider();
      // Add additional scopes to the provider
      provider.addScope('profile');
      provider.addScope('email');
      // Sign in with popup
      auth()
        .signInWithPopup(provider)
        .then(
          (result) => {
            const epoch = new Date().toISOString();
            console.log('Login --> handleGoogleSignin --> epoch:', epoch);
            const user = result.user; // The firebase.User instance
            console.log('Login --> handleGoogleSignin --> firebase.User:', user);

            // The Facebook firebase.auth.AuthCredential containing the Facebook access token
            const credential = result.credential;
            const token = result.credential.accessToken;
            console.log(
              'Login --> handleGoogleSignin --> firebase.auth.AuthCredential:',
              credential
            );
            this.setState({ buttonPressed: false, user: auth().currentUser }, () => {
              toast('Google sign-in successful.');
            });
          },
          (error) => {
            // If account-exists-with-different-credential, fetch the providers linked to that email
            const email = error.email; // provider's account email
            const credential = error.credential; // provider's credential
            if (error.code === 'auth/account-exists-with-different-credential') {
              auth.fetchSignInMethodsForEmail(email).then((providers) => {
                console.log('Login --> handleGoogleSignin --> providers: ', providers);
              });
            }
            this.setState({ error: error.message, buttonPressed: false }, () => {
              toast(this.state.error);
            });
          }
        );
    });
  };

  render() {
    const { loading, authenticated, user, error, email, password } = this.state;
    return this.state.loading ? (
      'Loading...'
    ) : this.state.authenticated ? (
      <div>
        <button onClick={this.handleLogout} type='button'>
          Log out
        </button>
      </div>
    ) : (
      <div>
        <form autoComplete='off' onSubmit={this.handleLogin}>
          <h1>
            {'Login to '}
            <Link to='/'>Budget Planner</Link>
          </h1>
          <p>Fill in the form below to login to your account.</p>
          <div>
            <input
              placeholder='Email'
              name='email'
              type='email'
              onChange={this.handleChange}
              value={this.state.email}
            />
          </div>
          <div>
            <input
              placeholder='Password'
              name='password'
              onChange={this.handleChange}
              value={this.state.password}
              type='password'
            />
          </div>
          <div>
            {this.state.error ? <p>{this.state.error}</p> : null}
            <button type='submit'>Login</button>
          </div>
          <hr />
          <p>
            Don't have an account? <Link to='/signup'>Sign up</Link>
          </p>
          <p>Or</p>
          <button onClick={this.handleGoogleSignin} type='button'>
            Sign in with Google
          </button>
        </form>
      </div>
    );
  }
}

// const mapStateToProps = (state) => ({});

// const mapDispatchToProps = {};

// export default connect(mapStateToProps, mapDispatchToProps)(Login);

export default Login;
