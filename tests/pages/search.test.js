import React from 'react';
import { shallow } from 'enzyme';
import { Search, mapStateToProps } from '../../pages/search';
import tags from '../fixtures/trendingTagsList';

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
  let fetchPosts;
  let fetchTrendingTags;
  beforeEach(async () => {
    fetchPosts = jest.fn(() => Promise.resolve(true));
    fetchTrendingTags = jest.fn(() => Promise.resolve(true));
    // shallow will call componentDidMount() which will fetchTrendingTags - which is async function
    wrapper = await shallow(
      <Search
        fetchPosts={fetchPosts}
        fetchTrendingTags={fetchTrendingTags}
        tagsOptions={[...tags]}
        // to pass only a COPY of tags, if passed direct, tagsOptions will refer to tags
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
      expect(wrapper.state('tagsOptions')).toEqual([{ key: tagToAdd, value: tagToAdd, text: tagToAdd }, ...tags]);
      expect(wrapper.find('Dropdown').at(0).prop('options')).toEqual([{ key: tagToAdd, value: tagToAdd, text: tagToAdd }, ...tags]);
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
      expect(fetchPosts).toHaveBeenCalledWith(tagsToSelect, 'created', false);
    });

    // might have to remove very soon
    test('should not search if no tags are selected', () => {
      wrapper.find('Button').simulate('click');
      expect(wrapper.state('selectedTags')).toEqual([]);
      expect(fetchPosts).toHaveBeenCalledTimes(0);
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
      expect(wrapper.state('error')).toBe(`Error: ${error}`);
      expect(wrapper.find('.error')).toBeTruthy();
      expect(wrapper.find('.error > p:first-child').text()).toBe(`Error: ${error}`);
      expect(wrapper).toMatchSnapshot();
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
      expect(wrapper.instance().setState).toHaveBeenNthCalledWith(1, { searchLoading: true, error: '' });
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
    });
  });

  describe('Testing Mark first tag as category', () => {
    test('should default to checkedCategory default state, which is false', () => {
      expect(wrapper.state('checkedCategory')).toBe(false);
      expect(wrapper.find('Checkbox').prop('checked')).toBe(false);
    });

    test('should change accordingly', () => {
      wrapper.find('Checkbox').prop('onChange')({}, {
        checked: true,
      });
      expect(wrapper.state('checkedCategory')).toBe(true);
      expect(wrapper.find('Checkbox').prop('checked')).toBe(true);
    });
  });
});

test('mapStateToProps should return props correctly', () => {
  const props = mapStateToProps({
    tags: {
      trending_tags_options: tags,
    },
  });
  expect(props).toEqual({
    tagsOptions: tags,
  });
});
