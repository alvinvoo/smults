import React from 'react';
import PropTypes from 'prop-types';
import { Container } from 'semantic-ui-react';
import Header from './Header';
import Footer from './Footer';

export default function Layout(props) {
  const { item, children } = props;
  return (
    <Container style={{ padding: '2em 0em' }}>
      <Header item={item} />
      {children}
      <Footer />
    </Container>
  );
}

Layout.propTypes = {
  item: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};
