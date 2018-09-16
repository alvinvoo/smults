import React from 'react';
import { shallow } from 'enzyme';
import Post from '../../components/Post';
import postListData from '../fixtures/postList';

test('should render a single post correctly', () => {
  const wrapper = shallow(<Post post={postListData[0]} />);
  expect(wrapper).toMatchSnapshot();
});
