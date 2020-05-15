import React, { Component } from 'react';
import { Route, BrowserRouter, Switch, Redirect } from 'react-router-dom';
import { Login, Signup, Home, Landing, Report, Slider } from '.';

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

function Router({ authenticated }) {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path='/:filter?' render={() => <Home authenticated={authenticated} />}></Route>
      </Switch>
    </BrowserRouter>
  );
}

export default Router;
