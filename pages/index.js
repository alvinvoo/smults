import React, { Component } from 'react';// work with components
import { connect } from 'react-redux';
import Search from './search';


class Index extends Component {
  static getInitialProps({ reduxStore, req }) {
    // this is the initial props function in server
    const isServer = !!req;
    console.log('server alive? ', isServer);
    return {};
  }

  render() {
    return <Search />;
  }
}

export default connect()(Index);
