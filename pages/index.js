import React, {Component} from 'react';//work with components
import Search from './search';

import {connect} from 'react-redux';


class Index extends Component{

  static getInitialProps({ reduxStore, req }) {
    //this is the initial props function in server
    const isServer = !!req;
    console.log('server alive? ',isServer);
    return {};
  }

  render(){
    return <Search/>;
  }

}

export default connect()(Index);
