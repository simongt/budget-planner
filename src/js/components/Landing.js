import React, { Component } from 'react';
// import { connect } from 'react-redux';

class Landing extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return <div>Landing</div>;
  }
}

// const mapStateToProps = (state) => ({});

// const mapDispatchToProps = {};

// export default connect(mapStateToProps, mapDispatchToProps)(Landing);

export default Landing;

const wrapper = document.getElementById('container');
wrapper ? ReactDOM.render(<Form />, wrapper) : false;
