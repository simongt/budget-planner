import withRoot from './lib/withRoot';
import React, { Component } from 'react';
import { hot } from 'react-hot-loader/root';
import { LinearProgress } from '@material-ui/core';
import { auth } from './services/firebase';
import { Router } from './components';

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
    document.cookie = 'SameSite=None; Secure'; // XSRF protection
    return this.state.loading ? (
      <LinearProgress color='secondary' />
    ) : (
      <Router authenticated={this.state.authenticated} />
    );
  }
}

export default hot(withRoot(App));
