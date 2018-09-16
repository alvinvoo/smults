import React from 'react';
import { shallow } from 'enzyme';
import Layout from '../../components/Layout';

const wrapper = shallow(<Layout item="search"><div className="children" /></Layout>);

test('should render Layout with item and children', () => {
  expect(wrapper).toMatchSnapshot();
});

test('should pass in the proper item into Header as prop', () => {
  expect(wrapper.find('Header').prop('item')).toBe('search');
});

test('should have the proper children as specified', () => {
  expect(wrapper.find('.children')).toBeTruthy();
});
