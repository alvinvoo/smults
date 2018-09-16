import React from 'react';
import { shallow } from 'enzyme';
import About from '../../pages/about';

test('should render About page', () => {
  const wrapper = shallow(<About />);
  expect(wrapper).toMatchSnapshot();
});
