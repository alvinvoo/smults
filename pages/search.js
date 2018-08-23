import React, {Component} from 'react';//work with components
import {Dropdown, Button, Checkbox, Popup, Icon} from 'semantic-ui-react';
import Layout from '../components/Layout';
import '../css/style.css';
import {connect} from 'react-redux';
import {fetchTrendingTags,fetchPosts} from '../actions';

class Search extends Component{

  state = {
    tagsOptions : [],
    filterOptions: [
      {text:'New', value:'created'},
      {text:'Trending', value:'trending'},
      {text:'Hot', value:'hot'},
      {text:'Active', value:'active'},
      {text:'Promoted', value:'promoted'}
    ],
    selectedTags: ''
  }

  componentDidMount(){
    this.props.fetchTrendingTags().then(data=>{
      this.setState({tagsOptions: this.props.tags.trending_tags_options});
    });//we only want to fetch in client side once
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
    if(this.state.selectedTags.length===0)return;
    console.log('search');
    console.log(this.state.selectedTags);
    this.props.fetchPosts(this.state.selectedTags[0]);
  }

  render(){
    console.log('index rendering');
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
        <div className="searchOptionsBar">
          <div>
          Filter tags by {' '}
          <Dropdown inline options={this.state.filterOptions} defaultValue={this.state.filterOptions[0].value}/>
          </div>
          <div className="markyTag">
            <Checkbox label='Mark tag as category' />
            <Popup trigger={<Icon name='question circle outline' />} content='Return search results which match the given first tag as their categories.' />
          </div>
        </div>
      </Layout>
    )
  }
}

function mapStateToProps({tags}){
  return {tags};
}

export default connect(mapStateToProps,{fetchTrendingTags,fetchPosts})(Search);
