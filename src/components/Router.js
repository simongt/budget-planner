import React, { Component } from 'react';
import { Route, BrowserRouter, Switch, Redirect } from 'react-router-dom';
import {
  Home,
  Report,
  Signin,
  Signup,
  Landing,
  Dashboard,
  TopNavBar,
  Container,
  ForgotPassword,
  ElectionSlider,
  ElectionPieChart
} from './';

function ProtectedRoute({ component: Component, authenticated, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        authenticated === true ? (
          <Component {...props} />
        ) : (
          <>
            {/* if user tries to access protected route, redirect them to login */}
            <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
          </>
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
        authenticated === false ? (
          <Component {...props} />
        ) : (
          <>
            {/* if user tries to access login while logged in, redirect them to / */}
            <Redirect to='/' />
          </>
        )
      }
    />
  );
}

function Router({ authenticated }) {
  return (
    <BrowserRouter>
      <Switch>
        <Route
          exact
          path='/'
          component={() => {
            return <Home authenticated={authenticated} />;
          }}
        ></Route>
        <ProtectedRoute
          path='/dashboard'
          authenticated={authenticated}
          component={() => {
            return <Dashboard authenticated={authenticated} />;
          }}
        ></ProtectedRoute>
        <PublicRoute
          path='/login'
          authenticated={authenticated}
          component={() => {
            return <Signin authenticated={authenticated} />;
          }}
        ></PublicRoute>
        <PublicRoute
          path='/signup'
          authenticated={authenticated}
          component={() => {
            return <Signup authenticated={authenticated} />;
          }}
        ></PublicRoute>
      </Switch>
    </BrowserRouter>
  );
}

export { ProtectedRoute, PublicRoute, Router };
