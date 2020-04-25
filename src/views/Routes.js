import React, { Component } from 'react';
import { Route, BrowserRouter as Router, Switch, Redirect } from 'react-router-dom';
import { Login, Signup, Home, Landing, Report, Slider } from './';

function PrivateRoute({ component: Component, authenticated, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        authenticated === true ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        )
      }
    />
  );
}

function PublicRoute({ component: Component, authenticated, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        authenticated === false ? <Component {...props} /> : <Redirect to='/home' />
      }
    />
  );
}

function Routes({ authenticated }) {
  return (
    <Router>
      <Switch>
        <Route
          exact
          path='/'
          component={() => {
            return <Home authenticated={authenticated} />;
          }}
        ></Route>
        {/* <PrivateRoute
          path='/home'
          authenticated={authenticated}
          component={() => {
            return <Home authenticated={authenticated} />;
          }}
        ></PrivateRoute>
        <PrivateRoute
          path='/login'
          authenticated={authenticated}
          component={() => {
            return <Login authenticated={authenticated} />;
          }}
        ></PrivateRoute>
        <PublicRoute
          path='/landing'
          authenticated={authenticated}
          component={() => {
            return <Landing authenticated={authenticated} />;
          }}
        ></PublicRoute>
        <PublicRoute
          path='/login'
          authenticated={authenticated}
          component={() => {
            return <Login authenticated={authenticated} />;
          }}
        ></PublicRoute>
        <PublicRoute
          path='/signup'
          authenticated={authenticated}
          component={() => {
            return <Signup authenticated={authenticated} />;
          }}
        ></PublicRoute> */}
      </Switch>
    </Router>
  );
}

export { PrivateRoute, PublicRoute, Routes };
