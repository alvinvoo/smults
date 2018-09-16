import React from 'react';
import configureStore from 'redux-mock-store';
import { shallow, mount } from 'enzyme';
import ConnectedPostList, { PostList } from '../../components/PostList';
import postListData from '../fixtures/postList';

const mockStore = configureStore();

describe('Shallow rendering on unconnected PostList', () => {
  test('should render correctly', () => {
    const wrapper = shallow(<PostList posts={postListData} />);
    expect(wrapper).toMatchSnapshot();
  });
});

describe('Test on connected PostList', () => {
  let store;
  let container;

  beforeEach(() => {
    store = mockStore({
      posts: {
        posts: postListData,
      },
    });
    container = mount(<ConnectedPostList store={store} />);
  });

  test('should render correctly', () => {
    expect(container.find('PostList')).toHaveLength(1);
    expect(container.find('Post')).toHaveLength(2);
  });

  test('should have posts prop that matches dummy posts list', () => {
    const postsProp = container.find('PostList').prop('posts');
    expect(postsProp).toHaveLength(2);
    expect(postsProp).toEqual(postListData);
  });
});
