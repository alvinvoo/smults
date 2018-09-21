import React from 'react';
import _ from 'lodash';
import { shallow } from 'enzyme';
import { Search, mapStateToProps } from '../../pages/search';
import { ERROR, MESSAGE } from '../../components/Notifier';
import { FETCHED_POSTS } from '../../actions';
import tags from '../fixtures/trendingTagsList';
import authors from '../fixtures/authorsList';
import postList from '../fixtures/postList';

jest.unmock('lodash');
_.debounce = jest.fn((func, delay) => (func));
_.throttle = jest.fn((func, delay) => (func));

/**
 * There's no direct test on the connected search component because the main
 * pain point would be dealing with the async actions. I tried jest.mock but
 * there's a complain about Unhandled promise rejection. So, I've decided to
 * just test the unconnected component and the mapStateToProps function itself.
 * Since the actions and store middlewares is already tested in the actions'
 * unit test cases
*/
describe('Testing on unconnected Search', () => {
  let wrapper;
  // all the mock functions that are avail in props needed to be tested
  // to see whther they are called
  let fetchPosts;
  let fetchTrendingTags;
  let lookupAuthors;
  beforeEach(async () => {
    fetchPosts = jest.fn(() => Promise.resolve(true));
    fetchTrendingTags = jest.fn(() => Promise.resolve(true));
    lookupAuthors = jest.fn(() => Promise.resolve(true));
    // shallow will call componentDidMount() which will fetchTrendingTags - which is async function
    wrapper = await shallow(
      <Search
        fetchPosts={fetchPosts}
        fetchTrendingTags={fetchTrendingTags}
        lookupAuthors={lookupAuthors}
        tagsOptions={[...tags]}
        // to pass only a COPY of tags, if passed direct, tagsOptions will refer to tags
        authorsOptions={[]}
        postsLength={0}
        postsState=""
      />,
    );
  });

  test('should render Search page correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  test('should fetch trending tags on mount', () => {
    expect(fetchTrendingTags).toHaveBeenCalledTimes(1);
    expect(wrapper.state('tagsOptions')).toEqual(tags);
    expect(wrapper.find('Dropdown').at(0).prop('options')).toEqual(tags);
  });

  test('should have default tags list in dropdown', () => {
    const defaultTagsOptions = wrapper.find('Dropdown').at(0).prop('options');
    expect(defaultTagsOptions).toEqual(tags);
  });

  describe('Testing tags dropdown', () => {
    test('should add tag to dropdown', () => {
      const tagToAdd = 'whale';
      wrapper.find('Dropdown').at(0).prop('onAddItem')({}, { value: tagToAdd });
      expect(wrapper.state('tagsOptions')).toEqual([{ value: tagToAdd, text: tagToAdd }, ...tags]);
      expect(wrapper.find('Dropdown').at(0).prop('options')).toEqual([{ value: tagToAdd, text: tagToAdd }, ...tags]);
    });

    test('should change selected tags accordingly', () => {
      const tagsToSelect = ['laundry', 'sewing machine'];
      wrapper.find('Dropdown').at(0).prop('onChange')({}, { value: tagsToSelect });
      expect(wrapper.state('selectedTags')).toEqual(tagsToSelect);
      expect(wrapper.find('Dropdown').at(0).prop('value')).toEqual(tagsToSelect);
    });

    test('should select only maximum of 5 tags', () => {
      const tagsToSelect = ['tag1', 'tag2', 'tag3', 'tag4', 'tag5', 'tag6', 'tag7'];
      wrapper.find('Dropdown').at(0).prop('onChange')({}, { value: tagsToSelect });
      expect(wrapper.state('selectedTags')).toEqual(tagsToSelect.slice(0, 5));
      expect(wrapper.find('Dropdown').at(0).prop('value')).toEqual(tagsToSelect.slice(0, 5));
    });
  });

  describe('Testing search function', () => {
    test('should search accordingly', () => {
      const tagsToSelect = [tags[2].value, tags[4].value];// kr, art
      wrapper.find('Dropdown').at(0).prop('onChange')({}, { value: tagsToSelect });
      wrapper.find('Button').simulate('click');
      expect(fetchPosts).toHaveBeenCalledTimes(1);
      expect(fetchPosts).toHaveBeenCalledWith(tagsToSelect, 'created', '', false);
    });

    test('should set error state and display error if fetchPost returned with error', async () => {
      const error = 'some kinda error';
      const tagsToSelect = [tags[2].value, tags[4].value];// kr, art
      // overwrite fetchPosts implementation here
      wrapper.instance().props.fetchPosts.mockImplementation(
        () => Promise.reject(new Error(error)),
      );
      wrapper.find('Dropdown').at(0).prop('onChange')({}, { value: tagsToSelect });
      // wait for ALL async functions (including async inner function) to return
      await Promise.all(wrapper.find('Button').simulate('click'));
      expect(fetchPosts).toHaveBeenCalledTimes(1);
      expect(wrapper.state('notify')).toEqual({
        type: ERROR,
        message: `Error: ${error}`,
      });
      expect(wrapper.find('Notifier')).toHaveLength(1);
      expect(wrapper.find('Notifier').prop('message')).toBe(`Error: ${error}`);
      expect(wrapper.find('Notifier').prop('type')).toBe(ERROR);
      expect(wrapper).toMatchSnapshot();
    });

    test('should return not return any notification message if fetchPost returned with posts', () => {
      wrapper.setProps({ postsState: FETCHED_POSTS, postsLength: 10 });
      expect(wrapper.state('notify')).toEqual({
        type: '',
        message: '',
      });
    });

    test('should return a custom \'no post found\' message if fetchPost returned with no post', () => {
      const message = 'Opps. No post found!';
      wrapper.setProps({ postsState: FETCHED_POSTS, postsLength: 0 });
      expect(wrapper.state('notify')).toEqual({
        type: MESSAGE,
        message,
      });
    });
  });

  /**
   * Since the search loading animation will happen from false to true to false
   * within one click, there's no way to test UI changes in stages; Splitting
   * the test into a test for state change and a test for linkage of state to UI
   * prop
   */
  describe('Testing search Button loading animation', () => {
    test('should have searchLoading state enabled while searching, and disabled after that', async () => {
      const tagsToSelect = [tags[2].value, tags[4].value];// kr, art
      wrapper.find('Dropdown').at(0).prop('onChange')({}, { value: tagsToSelect });
      wrapper.instance().setState = jest.fn();
      await Promise.all(wrapper.find('Button').simulate('click'));

      expect(wrapper.instance().setState).toBeCalledTimes(2);
      expect(wrapper.instance().setState).toHaveBeenNthCalledWith(1,
        { notify: { message: '', type: '' }, searchLoading: true });
      expect(wrapper.instance().setState).toHaveBeenLastCalledWith({ searchLoading: false });
    });

    test('Button should have loading prop tied to searchLoading state', () => {
      wrapper.setState({ searchLoading: true });
      expect(wrapper.find('Button').prop('loading')).toBe(true);
      wrapper.setState({ searchLoading: false });
      expect(wrapper.find('Button').prop('loading')).toBe(false);
    });
  });

  describe('Testing filter dropdown', () => {
    test('should have all filter options, and default to first filter options value', () => {
      const filters = wrapper.state('filterOptions');
      expect(wrapper.find('Dropdown').at(1).prop('options')).toEqual(filters);
      const value = wrapper.state('selectedFilter');
      expect(wrapper.find('Dropdown').at(1).prop('value')).toBe(value);
    });

    test('should change filter accordingly', () => {
      const filters = wrapper.state('filterOptions');
      const { value } = filters[3];
      wrapper.find('Dropdown').at(1).prop('onChange')({}, {
        value,
      });
      expect(wrapper.state('selectedFilter')).toBe(value);
      expect(wrapper.find('Dropdown').at(1).prop('value')).toBe(value);
      expect(wrapper.state('authorInputEnabled')).toBe(false);
    });

    test('should change filter for author accordingly', () => {
      const filters = wrapper.state('filterOptions');
      const { value } = filters[5];
      expect(wrapper.state('authorName')).toBe('');
      expect(value).toBe('author');
      wrapper.find('Dropdown').at(1).prop('onChange')({}, {
        value,
      });
      expect(wrapper.state('selectedFilter')).toBe('author');
      expect(wrapper.find('Dropdown').at(1).prop('value')).toBe('author');
      expect(wrapper.state('authorInputEnabled')).toBe(true);
    });
  });

  describe('Testing dropdown input for author\'s name search', () => {
    function triggerAuthorFilter() {
      const filters = wrapper.state('filterOptions');
      const { value } = filters[5];
      expect(value).toBe('author');
      wrapper.find('Dropdown').at(1).prop('onChange')({}, {
        value,
      });
    }

    test('should render the .authorName div with icon and dropdown when filter = author', () => {
      triggerAuthorFilter();
      expect(wrapper.find('.authorName')).toHaveLength(1);
      expect(wrapper).toMatchSnapshot();
    });

    test('should render author name correctly when entered', () => {
      triggerAuthorFilter();
      const value = 'alvin';
      wrapper.find('Dropdown').at(2).prop('onChange')({}, {
        value,
      });
      expect(wrapper.state('authorName')).toBe(value);
      expect(wrapper.find('Dropdown').at(2).prop('value')).toBe(value);
    });

    test('should search for author (search query < 5 characters) properly', async () => {
      wrapper.setProps({ authorsOptions: authors });
      triggerAuthorFilter();
      expect(wrapper.state('authorsOptions')).toHaveLength(0);
      await wrapper.find('Dropdown').at(2).prop('onSearchChange')({}, {
        searchQuery: 'alvi',
      });
      expect(lookupAuthors).toBeCalledTimes(1);
      expect(lookupAuthors).toBeCalledWith('alvi');
      expect(wrapper.state('authorsOptions')).toHaveLength(3);
    });

    test('should search for author (search query >= 5 characters) properly', async () => {
      wrapper.setProps({ authorsOptions: authors });
      _.throttle.mockClear();
      triggerAuthorFilter();
      expect(wrapper.state('authorsOptions')).toHaveLength(0);
      await wrapper.find('Dropdown').at(2).prop('onSearchChange')({}, {
        searchQuery: 'alvin',
      });
      expect(lookupAuthors).toBeCalledTimes(1);
      expect(lookupAuthors).toBeCalledWith('alvin');
      expect(wrapper.state('authorsOptions')).toHaveLength(3);
    });

    test('search function should return all options by default', () => {
      triggerAuthorFilter();
      const ret = (wrapper.find('Dropdown').at(2).prop('search')(
        authors,
      ));
      expect(ret).toBe(authors);
    });
  });

  describe('Testing Mark first tag as category', () => {
    test('should default to checkedCategory default state, which is false', () => {
      expect(wrapper.state('checkedCategory')).toBe(false);
      expect(wrapper.find('Checkbox').prop('checked')).toBe(false);
    });

    test('should remained unchecked (disabled) when there\'s no tag selected', () => {
      const tagsToSelect = [];
      wrapper.find('Dropdown').at(0).prop('onChange')({}, { value: tagsToSelect });
      expect(wrapper.state('checkedDisabled')).toBe(true);
      expect(wrapper.find('Checkbox').prop('checked')).toBe(false);
    });

    test('should available to be checked (enabled) when there\'s tag selected', () => {
      const tagsToSelect = ['laundry', 'sewing machine'];
      expect(wrapper.state('checkedDisabled')).toBe(true);
      wrapper.find('Dropdown').at(0).prop('onChange')({}, { value: tagsToSelect });
      wrapper.find('Checkbox').prop('onChange')({}, {
        checked: true,
      });
      expect(wrapper.state('checkedDisabled')).toBe(false);
      expect(wrapper.state('checkedCategory')).toBe(true);
      expect(wrapper.find('Checkbox').prop('checked')).toBe(true);
    });
  });
});

test('mapStateToProps should return props correctly (separate test)', () => {
  const reducerState = 'STORED_TAGS';
  const props = mapStateToProps({
    tags: {
      trending_tags_options: tags,
    },
    authors: {
      authors_search_list: authors,
    },
    posts: {
      posts: postList,
      reducerState,
    },
  });
  expect(props).toEqual({
    tagsOptions: tags,
    authorsOptions: authors,
    postsLength: 2,
    postsState: reducerState,
  });
});
