import React, { Component } from 'react';
import { Login, Signup, Home, Landing, Report, Slider } from './components';
import { Route, BrowserRouter as Router, Switch, Redirect } from 'react-router-dom';
// import { hot } from 'react-hot-loader/root';
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
          <Route
            exact
            path='/'
            component={() => {
              return <Login authenticated={this.state.authenticated} />;
            }}
          ></Route>
          <PrivateRoute
            path='/home'
            authenticated={this.state.authenticated}
            component={() => {
              return <Home authenticated={this.state.authenticated} />;
            }}
          ></PrivateRoute>
          <PrivateRoute
            path='/login'
            authenticated={this.state.authenticated}
            component={() => {
              return <Login authenticated={this.state.authenticated} />;
            }}
          ></PrivateRoute>
          <PublicRoute
            path='/landing'
            authenticated={this.state.authenticated}
            component={() => {
              return <Landing authenticated={this.state.authenticated} />;
            }}
          ></PublicRoute>
          <PublicRoute
            path='/login'
            authenticated={this.state.authenticated}
            component={() => {
              return <Login authenticated={this.state.authenticated} />;
            }}
          ></PublicRoute>
          <PublicRoute
            path='/signup'
            authenticated={this.state.authenticated}
            component={() => {
              return <Signup authenticated={this.state.authenticated} />;
            }}
          ></PublicRoute>
        </Switch>
      </Router>
    );
  }
}

// const mapStateToProps = (state) => ({});

// const mapDispatchToProps = {};

// export default hot(connect(mapStateToProps, mapDispatchToProps)(App));

// export default hot(App);
export default App;
