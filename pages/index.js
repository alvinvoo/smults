import React, {Component} from 'react';//work with components
import {Dropdown, Button} from 'semantic-ui-react';
import Layout from '../components/Layout';
import '../css/style.css';

import {connect} from 'react-redux';
import {fetchTrendingTags} from '../actions';

class Search extends Component{

  state = {
    tagsOptions : [
      {key: 'life', value : 'life', text: 'life'},
      {key: 'photography', value : 'photography', text: 'photography'},
      {key: 'kr', value : 'kr', text: 'kr'},
      {key: 'steemit', value : 'steemit', text: 'steemit'},
      {key: 'art', value : 'art', text: 'art'},
      {key: 'bitcoin', value : 'bitcoin', text: 'bitcoin'},
      {key: 'introduceyourself', value : 'introduceyourself', text: 'introduceyourself'},
      {key: 'spanish', value : 'spanish', text: 'spanish'}
    ],
    selectedTags: ''
  }

  static getInitialProps({ reduxStore, req }) {
    //this is the initial props function in server
    console.log('init props, is server?');
    const isServer = !!req;
    console.log(isServer);
    // console.log(req);
    //get trending tags from here?
    // reduxStore.dispatch(fetchTrendingTags());
    return {};
  }

  componentDidMount(){
    console.log('props tags :');
    this.props.fetchTrendingTags();//we only want to fetch in client side
  }

  dropDownChange = (e,d) => {
    console.log('dropDownChange');
    console.log(d);
    this.setState({selectedTags: d.value})
  }

  dropDownAddItem = (e,d) =>{
    console.log('dropDownAddItem');
    console.log(d);
    let newTags = this.state.tagsOptions;
    newTags.unshift({key: d.value, value: d.value, text: d.value});
    this.setState({tagsOptions: newTags});
  }

  search = (e,d) => {
    console.log('search');
    console.log(d);
    console.log(this.state.selectedTags);
  }

  render(){
    const {tags} = this.props;
    if(tags) this.setState({tagsOptions: tags});

    return(
      <Layout item='search'>
        <div className="searchBar">
          <Dropdown
          icon="search"
          placeholder="Insert your tags here..."
          selection multiple search fluid allowAdditions
          options={this.state.tagsOptions}
          onAddItem={this.dropDownAddItem}
          onChange={this.dropDownChange}/>
          <Button positive
          onClick={this.search}> Search </Button>
        </div>
      </Layout>
    )
  }
}

function mapStateToProps({tags}){
  return {tags};
}

export default connect(mapStateToProps,{fetchTrendingTags})(Search);
