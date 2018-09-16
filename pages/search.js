import React, { Component } from 'react';// work with components
import PropTypes from 'prop-types';
import {
  Dropdown, Button, Checkbox, Popup, Icon,
} from 'semantic-ui-react';
import { take } from 'lodash';
import { connect } from 'react-redux';
import Layout from '../components/Layout';
import ConnectedPostList from '../components/PostList';
import ScrollButton from '../components/ScrollButton';
import { fetchTrendingTags, fetchPosts } from '../actions';

export class Search extends Component {
  state = {
    tagsOptions: [],
    selectedTags: [],
    filterOptions: [
      { text: 'New', value: 'created' },
      { text: 'Trending', value: 'trending' },
      { text: 'Hot', value: 'hot' },
      { text: 'Active', value: 'active' },
      { text: 'Promoted', value: 'promoted' },
    ],
    selectedFilter: 'created',
    checkedCategory: false,
    searchLoading: false,
    error: '',
  }

  componentDidMount = async () => {
    const { fetchTrendingTags } = this.props;
    await fetchTrendingTags();
    // we only want to fetch in client side once
    const { tagsOptions } = this.props;
    this.setState({ tagsOptions });
  }

  dropDownChange = (e, d) => {
    this.setState({ selectedTags: take(d.value, 5) });
  }

  dropDownAddItem = (e, d) => {
    this.setState((prevState) => {
      const newTags = prevState.tagsOptions;
      newTags.unshift({ key: d.value, value: d.value, text: d.value });
      return { tagsOptions: newTags };
    });
  }

  search = async () => {
    const { selectedTags, selectedFilter, checkedCategory } = this.state;
    const { fetchPosts } = this.props;
    if (selectedTags.length === 0) return;
    this.setState({ searchLoading: true, error: '' });
    await fetchPosts(selectedTags, selectedFilter, checkedCategory).catch(
      (error) => {
        this.setState({ error: String(error) });
      },
    );
    this.setState({ searchLoading: false });
  }

  filterChange = (e, d) => {
    this.setState({ selectedFilter: d.value });
  }

  checkBoxCategory = (e, d) => {
    this.setState({ checkedCategory: d.checked });
  }

  displayError = () => {
    const { error } = this.state;
    if (error) {
      return (
        <div className="error">
          <p>{error}</p>
          <p>
            Sorry, something is broken. Take a screenshot and notify
            <a href="https://steemit.com/@alvinvoo" target="_blank" rel="noopener noreferrer">
              {' '}
              @alvinvoo
            </a>
          </p>
        </div>
      );
    }
  }

  render() {
    const {
      tagsOptions, selectedTags, filterOptions, selectedFilter, searchLoading, checkedCategory,
    } = this.state;
    return (
      <Layout item="search">
        <div className="searchBar">
          <Dropdown
            icon="search"
            placeholder="Insert your tags here..."
            selection
            multiple
            search
            fluid
            allowAdditions
            options={tagsOptions}
            onAddItem={this.dropDownAddItem}
            onChange={this.dropDownChange}
            value={selectedTags}
          />
          <Button
            positive
            loading={searchLoading}
            onClick={this.search}
          >
            {' '}
            Search
          </Button>
        </div>
        <div className="searchOptionsBar">
          <div>
          Filter tags by
            {' '}
            {' '}
            <Dropdown
              inline
              options={filterOptions}
              onChange={this.filterChange}
              value={selectedFilter}
            />
          </div>
          <div className="markyTag">
            <Checkbox label="Mark first tag as category" onChange={this.checkBoxCategory} checked={checkedCategory} />
            <Popup trigger={<Icon name="question circle outline" />} content="Return search results which match the given first tag as their categories." />
          </div>
        </div>
        <div className="postList">
          <ConnectedPostList />
          {this.displayError()}
        </div>
        <ScrollButton scrollStepInPx={50} delayInMs={16.66} />
      </Layout>
    );
  }
}

Search.propTypes = {
  fetchPosts: PropTypes.func.isRequired,
  fetchTrendingTags: PropTypes.func.isRequired,
  tagsOptions: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired,
};

export function mapStateToProps({ tags }) {
  return { tagsOptions: tags.trending_tags_options };
}

export default connect(mapStateToProps, { fetchTrendingTags, fetchPosts })(Search);
