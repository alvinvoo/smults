import React from 'react';
import { shallow } from 'enzyme';
import Notifier, { ERROR, MESSAGE } from '../../components/Notifier';

test('should return an empty <DIV /> by default', () => {
  const wrapper = shallow(<Notifier type="" message="" />);
  expect(wrapper).toMatchSnapshot();
});

test('should render ERROR display correctly', () => {
  const errorMessage = 'some error message';
  const wrapper = shallow(<Notifier type={ERROR} message={errorMessage} />);
  expect(wrapper).toMatchSnapshot();
});

test('should render MESSAGE display correctly', () => {
  const message = 'some message';
  const wrapper = shallow(<Notifier type={MESSAGE} message={message} />);
  expect(wrapper).toMatchSnapshot();
});
