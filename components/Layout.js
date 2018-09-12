import React from 'react';
import PropTypes from 'prop-types';
import { Container } from 'semantic-ui-react';
// import 'semantic-ui-css/semantic.min.css';
import '../css/style.css';
import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';

export default function Layout(props) {
  const { item, children } = props;
  return (
    <Container style={{ padding: '2em 0em' }}>
      <Head>
        <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.3.1/semantic.min.css" />
      </Head>
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
