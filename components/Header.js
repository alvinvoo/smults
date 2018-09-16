import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Menu, Message } from 'semantic-ui-react';
import { Router, Link } from '../routes';

class Header extends Component {
  state = { activeItem: 'search' };

  componentDidMount() {
    const { item } = this.props;
    this.setState({ activeItem: item });
  }

  handleItemClick = (e, { name }) => {
    Router.pushRoute(`/${name}`);
  }

  render() {
    const { activeItem } = this.state;

    return (
      <div>
        <Message>
          <Message.Header as="h1">
            Steem MULti Tags Search
            <i>(a.k.a smults)</i>
          </Message.Header>
          <p>
            This web application aims to improve the search quality of
            {' '}
            <a href="https://www.steemit.com" target="_blank" rel="noopener noreferrer">steemit.com</a>
            .
            Up to 5 tags can be searched using the search bar.
            Head over to the
            {' '}
            <Link route="/about"><a>about</a></Link>
            {' '}
            tab for more info.
          </p>
        </Message>
        <Menu pointing secondary>
          <Menu.Item name="search" active={activeItem === 'search'} onClick={this.handleItemClick} />
          <Menu.Item name="about" active={activeItem === 'about'} onClick={this.handleItemClick} />
        </Menu>
      </div>
    );
  }
}

Header.propTypes = {
  item: PropTypes.string.isRequired,
};

export default Header;
