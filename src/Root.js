import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { CircularProgress, LinearProgress } from '@material-ui/core';
import { hot } from 'react-hot-loader/root';
import { Login, Signup, Home, Landing, Report, Slider, Router } from './components';
import { auth } from './services/firebase';
import withRoot from './lib/withRoot';

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
    console.log('src/Root.js --> componentDidMount: Redux store', store);
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

export default hot(withRoot(Root));
