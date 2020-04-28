import withRoot from './lib/withRoot';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Login, Signup, Home, Landing, Report, Slider } from './components';
import { hot } from 'react-hot-loader/root';
import { connect } from 'react-redux';
import { auth } from './services/firebase';
import { Router } from './components/Router';
import { CircularProgress, LinearProgress } from '@material-ui/core';

// Redux & Redux-persist
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/store';

class Root extends Component {
  constructor(props) {
    console.log('src/Root.js --> constructor');
    super(props);

    this.state = { authenticated: false, loading: true };
  }

  componentDidMount() {
    console.log('src/Root.js --> componentDidMount');
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
    console.log('src/Root.js --> render');
    // designed to protect from so-called XSRF (cross-site request forgery) attacks
    // see: https://javascript.info/cookie#samesite
    document.cookie = 'SameSite=None; Secure';
    return this.state.loading ? (
      <LinearProgress color='secondary' />
    ) : (
      <Provider store={store}>
        <PersistGate loading={this.state.loading} persistor={persistor}>
          <Router authenticated={this.state.authenticated} />
        </PersistGate>
      </Provider>
    );
  }
}

Root.propTypes = {
  store: PropTypes.object.isRequired
};

// const mapStateToProps = state => ({});
// const mapDispatchToProps = {};
// export default hot(connect(mapStateToProps, mapDispatchToProps)(withRoot(Root)));

export default hot(withRoot(Root));
