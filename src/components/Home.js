import React, { Component } from 'react';
// import { connect } from 'react-redux';
import { auth } from '../services/firebase';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = { user: null, loading: true };
  }

  componentDidMount = () => {
    this.setState({ user: auth().currentUser }, () => {
      this.setState({ loading: false });
    });
  };

  render() {
    return <div>Home</div>;
  }
}

// const mapStateToProps = (state) => ({});

// const mapDispatchToProps = {};

// export default connect(mapStateToProps, mapDispatchToProps)(Home);

export default Home;
