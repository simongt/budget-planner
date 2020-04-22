import React, { Component } from 'react';
import { Link } from 'react-router-dom';
// import { connect } from 'react-redux';
import { signup, signin } from '../services/firebase';

class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = { error: null, email: '', password: '' };
  }

  handleSubmit = async () => {
    event.preventDefault();
    this.setState({ error: '' });
    try {
      // pass the email and password entered by the user
      await signup(this.state.email, this.state.password);
    } catch (error) {
      this.setState({ error: error.message });
    }
  };

  handleChange = event => {
    // dynamically determine the key and set the corresponding state variable
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  render() {
    return (
      <div>
        <form autoComplete='off' onSubmit={this.handleSubmit}>
          <h1>
            Sign up to
            <Link to='/'>Budget Planner</Link>
          </h1>
          <p>Fill in the form below to sign up for an account.</p>
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
            <button type='submit'>Sign up</button>
          </div>
          <hr />
          <p>
            Already have an account? <Link to='/login'>Log in</Link>
          </p>
        </form>
      </div>
    );
  }
}

// const mapStateToProps = (state) => ({});

// const mapDispatchToProps = {};

// export default connect(mapStateToProps, mapDispatchToProps)(Signup);

export default Signup;
