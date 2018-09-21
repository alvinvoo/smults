import React from 'react';
import { shallow } from 'enzyme';
import Post from '../../components/Post';
import postListData from '../fixtures/postList';

test('should render a single post by author correctly', () => {
  const wrapper = shallow(<Post post={postListData[0]} />);
  expect(wrapper).toMatchSnapshot();
});

test('should render a \'resteem\' label when filtering by author and encounter resteemded post', () => {
  const wrapper = shallow(<Post post={postListData[1]} />);
  expect(wrapper.find('Label').at(0).find('Icon').prop('name')).toBe('share');
  expect(wrapper.find('Label').at(0).html()).toEqual(expect.stringContaining('resteemed'));
  expect(wrapper).toMatchSnapshot();
});
