import withRoot from './lib/withRoot';
import React, { Component } from 'react';
import { Login, Signup, Home, Landing, Report, Slider } from './views';
import { Route, BrowserRouter as Router, Switch, Redirect } from 'react-router-dom';
// import { hot } from 'react-hot-loader/root';
// import { connect } from 'react-redux';
import { auth } from './services/firebase';
import { PrivateRoute, PublicRoute, Routes } from './views/Routes';

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
    return this.state.loading ? 'Loading...' : <Routes authenticated={this.state.authenticated} />;
  }
}

// const mapStateToProps = (state) => ({});

// const mapDispatchToProps = {};

// export default hot(connect(mapStateToProps, mapDispatchToProps)(App));

// export default App;

// export default hot(App);

export default withRoot(App);
