import React, { Component } from 'react';
import PropTypes from 'prop-types';

export const ERROR = 'ERROR';
export const MESSAGE = 'MESSAGE';

export default class Notifier extends Component {
  displayMessage() {
    const { type, message } = this.props;
    switch (type) {
      case ERROR:
        return (
          <div className="error">
            <p>{ message }</p>
            <p>
          Sorry, something is broken. Take a screenshot and notify
              <a href="https://steemit.com/@alvinvoo" target="_blank" rel="noopener noreferrer">
                {' '}
            @alvinvoo
              </a>
            </p>
          </div>
        );
      case MESSAGE:
        return (
          <p>{ message }</p>
        );
      default:
        return <div />;
    }
  }

  render() {
    return this.displayMessage();
  }
}

Notifier.propTypes = {
  type: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
};
