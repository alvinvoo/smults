import React, { Component } from 'react';// work with components
import PropTypes from 'prop-types';
import {
  Dropdown, Button, Checkbox, Popup, Icon,
} from 'semantic-ui-react';
import { take, debounce, throttle } from 'lodash';
import { connect } from 'react-redux';
import Layout from '../components/Layout';
import ConnectedPostList from '../components/PostList';
import ScrollButton from '../components/ScrollButton';
import { fetchTrendingTags, lookupAuthors, fetchPosts } from '../actions';

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
      { text: 'Author', value: 'author' },
    ],
    selectedFilter: 'created',
    checkedCategory: false,
    checkedDisabled: true,
    searchLoading: false,
    error: '',
    authorName: '',
    authorInputEnabled: false,
    authorsOptions: [],
  }

  componentDidMount = async () => {
    const { fetchTrendingTags } = this.props;
    await fetchTrendingTags();
    // we only want to fetch in client side once
    const { tagsOptions } = this.props;
    this.setState({ tagsOptions });
  }

  dropDownChange = (e, d) => {
    const selectedTags = take(d.value, 5);
    this.setState({ selectedTags });
    if (selectedTags.length > 0) this.setState({ checkedDisabled: false });
    else this.setState({ checkedDisabled: true });
  }

  dropDownAddItem = (e, d) => {
    this.setState((prevState) => {
      const newTags = prevState.tagsOptions;
      newTags.unshift({ key: d.value, value: d.value, text: d.value });
      return { tagsOptions: newTags };
    });
  }

  search = async () => {
    const {
      selectedTags, selectedFilter, checkedCategory, authorName,
    } = this.state;
    const { fetchPosts } = this.props;
    this.setState({ searchLoading: true, error: '' });
    await fetchPosts(selectedTags, selectedFilter, authorName, checkedCategory).catch(
      (error) => {
        this.setState({ error: String(error) });
      },
    );
    this.setState({ searchLoading: false });
  }

  filterChange = (e, d) => {
    const selectedFilter = d.value;
    this.setState({ selectedFilter });
    if (selectedFilter === 'author') this.setState({ authorInputEnabled: true });
    else this.setState(({ authorInputEnabled: false }));
  }

  asyncLookupAuthors = async (query) => {
    const { lookupAuthors } = this.props;
    await lookupAuthors(query);
    const { authorsOptions } = this.props;
    this.setState({ authorsOptions });
  }

  // since debounce and throttle functions *returns* the executable function
  // they are declared here
  lookupAuthorsDebouncer = debounce(this.asyncLookupAuthors, 150);

  lookupAuthorsThrottler = throttle(this.asyncLookupAuthors, 150);

  authorSearchChange = async (e, d) => {
    const query = d.searchQuery;

    if (query.length < 5) this.lookupAuthorsDebouncer(query);
    else this.lookupAuthorsThrottler(query);
  }

  authorChange = (e, d) => {
    const authorName = d.value;
    this.setState({ authorName });
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
      tagsOptions, selectedTags,
      filterOptions, selectedFilter,
      searchLoading, checkedCategory,
      checkedDisabled, authorName,
      authorInputEnabled, authorsOptions,
    } = this.state;
    return (
      <Layout item="search">
        <div className="searchBar">
          <Dropdown
            icon="search"
            placeholder="Insert your tags here. Or leave empty to search for all posts..."
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
          {
            authorInputEnabled ? (
              <div className="authorName">
                <Icon name="at" />
                <Dropdown
                  search
                  selection
                  options={authorsOptions}
                  placeholder="username..."
                  onSearchChange={this.authorSearchChange}
                  onChange={this.authorChange}
                  value={authorName}
                />
              </div>
            ) : (
              <div />
            )
          }
          <div className="markyTag">
            <Checkbox
              label="Mark first tag as category"
              onChange={this.checkBoxCategory}
              disabled={checkedDisabled}
              checked={checkedCategory && !checkedDisabled}
            />
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
  lookupAuthors: PropTypes.func.isRequired,
  tagsOptions: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired,
  authorsOptions: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired,
};

export function mapStateToProps({ tags, authors }) {
  return { tagsOptions: tags.trending_tags_options, authorsOptions: authors.authors_search_list };
}

export default connect(mapStateToProps, { fetchTrendingTags, lookupAuthors, fetchPosts })(Search);
