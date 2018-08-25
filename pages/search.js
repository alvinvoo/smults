import React, {Component} from 'react';//work with components
import {Dropdown, Button, Checkbox, Popup, Icon} from 'semantic-ui-react';
import Layout from '../components/Layout';
import PostList from '../components/PostList';
import ScrollButton from '../components/ScrollButton';
import {connect} from 'react-redux';
import {fetchTrendingTags,fetchPosts} from '../actions';
import {take} from 'lodash';

class Search extends Component{

  state = {
    tagsOptions : [],
    selectedTags: [],
    filterOptions: [
      {text:'New', value:'created'},
      {text:'Trending', value:'trending'},
      {text:'Hot', value:'hot'},
      {text:'Active', value:'active'},
      {text:'Promoted', value:'promoted'}
    ],
    selectedFilter:'created',
    checkedCategory: false,
    searchLoading: false
  }

  componentDidMount(){
    this.props.fetchTrendingTags().then(data=>{
      this.setState({tagsOptions: this.props.tags.trending_tags_options});
    });//we only want to fetch in client side once
  }

  dropDownChange = (e,d) => {
    this.setState({selectedTags: _.take(d.value,5)})
  }

  dropDownAddItem = (e,d) =>{
    let newTags = this.state.tagsOptions;
    newTags.unshift({key: d.value, value: d.value, text: d.value});
    this.setState({tagsOptions: newTags});
  }

  search = (e,d) => {
    if(this.state.selectedTags.length===0)return;
    this.setState({searchLoading: true});
    this.props.fetchPosts(this.state.selectedTags,
      this.state.selectedFilter,
      this.state.checkedCategory).catch(err=>{
      console.log(err);
      window.alert('Sorry, something is broken. Press F12, take a screenshot of the console and notify https://steemit.com/@alvinvoo');
    });
    this.setState({searchLoading: false});
  }

  filterChange = (e,d) =>{
    this.setState({selectedFilter: d.value});
  }

  checkBoxCategory = (e,d) =>{
    this.setState({checkedCategory: d.checked});
  }

  render(){
    return(
      <Layout item='search'>
        <div className="searchBar">
          <Dropdown
          icon="search"
          placeholder="Insert your tags here..."
          selection multiple search fluid allowAdditions
          options={this.state.tagsOptions}
          onAddItem={this.dropDownAddItem}
          onChange={this.dropDownChange}
          value={this.state.selectedTags}
          />
          <Button positive loading={this.state.searchLoading}
          onClick={this.search}> Search </Button>
        </div>
        <div className="searchOptionsBar">
          <div>
          Filter tags by {' '}
          <Dropdown
          inline
          options={this.state.filterOptions}
          onChange={this.filterChange}
          value={this.state.selectedFilter}
          />
          </div>
          <div className="markyTag">
            <Checkbox label='Mark tag as category' onChange={this.checkBoxCategory} checked={this.state.checkedCategory}/>
            <Popup trigger={<Icon name='question circle outline' />} content='Return search results which match the given first tag as their categories.' />
          </div>
        </div>
        <div className="postList">
          <PostList/>
        </div>
        <ScrollButton scrollStepInPx="50" delayInMs="16.66"/>
      </Layout>
    )
  }
}

function mapStateToProps({tags}){
  return {tags};
}

export default connect(mapStateToProps,{fetchTrendingTags,fetchPosts})(Search);
