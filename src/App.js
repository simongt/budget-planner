import React, { Component } from 'react';
import { Login, Home, Landing, Report, Slider } from './components';
import { Route, BrowserRouter as Router, Switch, Redirect } from 'react-router-dom';
import { hot } from 'react-hot-loader/root';
// import { connect } from 'react-redux';
import { auth } from './services/firebase';
import { PrivateRoute, PublicRoute } from './components/Routes';

class App extends Component {
  constructor(props) {
    console.log('src/App.js --> constructor');
    super(props);

    this.state = { authenticated: false, loading: true };
  }

  componentDidMount() {
    console.log('src/App.js --> componentDidMount');
    auth().onAuthStateChanged((user) => {
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
    return this.state.loading ? (
      'Loading...'
    ) : (
      <Router>
        <Switch>
          <Route exact path='/' component={Home}></Route>
          <PrivateRoute
            path='/home'
            authenticated={this.state.authenticated}
            component={Home}
          ></PrivateRoute>
          <PublicRoute
            path='/landing'
            authenticated={this.state.authenticated}
            component={Landing}
          ></PublicRoute>
          <PublicRoute
            path='/login'
            authenticated={this.state.authenticated}
            component={Login}
          ></PublicRoute>
        </Switch>
      </Router>
    );
  }
}

// const mapStateToProps = (state) => ({});

// const mapDispatchToProps = {};

// export default connect(mapStateToProps, mapDispatchToProps)(App);

export default hot(App);
