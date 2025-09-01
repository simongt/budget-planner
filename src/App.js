import withRoot from './lib/withRoot';
import React, { Component } from 'react';
import { Login, Signup, Home, Landing, Report, Slider } from './components';
import { hot } from 'react-hot-loader/root';
// import { connect } from 'react-redux';
import { auth } from './services/firebase';
import { Router } from './components/Router';
import { CircularProgress, LinearProgress } from '@material-ui/core';

class App extends Component {
  constructor(props) {
    console.log('src/App.js --> constructor');
    super(props);

    this.state = { authenticated: false, loading: true };
  }

  componentDidMount() {
    console.log('src/App.js --> componentDidMount');
    auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({
          authenticated: true,
          loading: false
        });
      } else {
        this.setState({
          authenticated: false,
          loading: false
        });
      }
    });
  }

  render() {
    console.log('src/App.js --> render');
    // designed to protect from so-called XSRF (cross-site request forgery) attacks
    // see: https://javascript.info/cookie#samesite
    document.cookie = 'SameSite=None; Secure';
    return this.state.loading ? (
      <LinearProgress color='secondary' />
    ) : (
      <Router authenticated={this.state.authenticated} />
    );
  }
}

// const mapStateToProps = (state) => ({});

// const mapDispatchToProps = {};

// export default hot(connect(mapStateToProps, mapDispatchToProps)(App));

// export default App;

// export default hot(App);

export default hot(withRoot(App));
