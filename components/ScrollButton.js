import React, {Component} from 'react';
import {Button} from 'semantic-ui-react';

class ScrollButton extends Component {

  state={
    intervalId: 0
  }

  scrollStep=()=> {
    if (window.pageYOffset === 0) {
        clearInterval(this.state.intervalId);
    }
    window.scroll(0, window.pageYOffset - this.props.scrollStepInPx);
  }

  scrollToTop=()=> {
    let intervalId = setInterval(this.scrollStep, this.props.delayInMs);
    this.setState({ intervalId: intervalId });
  }

  render () {
      return (
        <Button className="scrollButton" title='Back to top' icon="angle double up"
          onClick={this.scrollToTop}>
        </Button>
      );
   }
}

export default ScrollButton;
