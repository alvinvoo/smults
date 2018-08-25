import React from 'react';
import {Container} from 'semantic-ui-react';
// import 'semantic-ui-css/semantic.min.css';
import '../css/style.css';
import Header from './Header';
import Footer from './Footer';
import Head from 'next/head';


export default props => {
  return(
    <Container style={{padding: '2em 0em'}}>
      <Head>
        <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.3.1/semantic.min.css"></link>
      </Head>
      <Header item={props.item}/>
      {props.children}
      <Footer/>
    </Container>
  )
}
