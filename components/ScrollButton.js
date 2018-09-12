import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';

class ScrollButton extends Component {
  state={
    intervalId: 0,
  }

  scrollStep=() => {
    const { intervalId } = this.state;
    const { scrollStepInPx } = this.props;
    if (window.pageYOffset === 0) {
      clearInterval(intervalId);
    }
    window.scroll(0, window.pageYOffset - scrollStepInPx);
  }

  scrollToTop=() => {
    const { delayInMs } = this.props;
    const intervalId = setInterval(this.scrollStep, delayInMs);
    this.setState({ intervalId });
  }

  render() {
    return (
      <Button
        className="scrollButton"
        title="Back to top"
        icon="angle double up"
        onClick={this.scrollToTop}
      />
    );
  }
}

ScrollButton.propTypes = {
  scrollStepInPx: PropTypes.number.isRequired,
  delayInMs: PropTypes.number.isRequired,
};

export default ScrollButton;
