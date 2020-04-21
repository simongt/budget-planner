import React, { Component } from 'react';
import { Auth, Home, Landing, Report, Slider } from './';
// import { connect } from 'react-redux';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div>
        <h1>App</h1>
        <Auth />
        <Home />
        <Landing />
        <Report />
        <Slider />
      </div>
    );
  }
}

// const mapStateToProps = (state) => ({});

// const mapDispatchToProps = {};

// export default connect(mapStateToProps, mapDispatchToProps)(App);

export default App;
