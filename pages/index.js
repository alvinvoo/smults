import React, { Component } from 'react';// work with components
import { connect } from 'react-redux';
import ConnectedSearch from './search';


export class Index extends Component {
  static getInitialProps({ reduxStore, req }) {
    // this is the initial props function in server
    const isServer = !!req;
    return { isServer };
  }

  render() {
    return <ConnectedSearch />;
  }
}

export default connect()(Index);
