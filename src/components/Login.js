import React, { Component } from 'react';
import { Link } from 'react-router-dom';
// import { connect } from 'react-redux';
import { signup, signin, signInWithGoogle } from '../services/firebase';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = { error: null, email: '', password: '' };
  }

  handleSubmit = async () => {
    event.preventDefault();
    this.setState({ error: '' });
    try {
      // pass the email and password entered by the user
      await signin(this.state.email, this.state.password);
    } catch (error) {
      this.setState({ error: error.message });
    }
  };

  handleChange = (event) => {
    // dynamically determine the key and set the corresponding state variable
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      this.setState({ error: error.message });
    }
  };

  render() {
    return (
      <div>
        <form autoComplete='off' onSubmit={this.handleSubmit}>
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
          <button onClick={this.handleGoogleSignIn} type='button'>
            Sign up with Google
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
