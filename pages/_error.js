import React from 'react';
import PropTypes from 'prop-types';
import Error from 'next/error';

export default class MyError extends React.Component {
  static async getInitialProps({ req, res }) {
    const { statusCode } = res;

    return { statusCode };
  }

  render() {
    const { statusCode } = this.props;
    return (
      <div className="errorPage">
        <a href="/">Return to Home Page</a>
        <Error statusCode={statusCode} />
      </div>
    );
  }
}

MyError.propTypes = {
  statusCode: PropTypes.number.isRequired,
}
