import React from 'react';
import { shallow } from 'enzyme';
import Header from '../../components/Header';
import routes from '../../routes';

jest.mock('../../routes');

describe('Basic rendering tests ', () => {
  test('should render Header correctly with default "search" tab', () => {
    const wrapper = shallow(<Header item="search" />);
    expect(wrapper).toMatchSnapshot();
  });

  test('should render Header correctly with "about" tab', () => {
    const wrapper = shallow(<Header item="about" />);
    expect(wrapper).toMatchSnapshot();
  });
});

describe('Router mocks tests', () => {
  beforeEach(() => {
    // Clear all instances and calls for every run
    routes.Router.pushRoute.mockClear();
  });

  test('should route search click handler correctly', () => {
    const wrapper = shallow(<Header item="about" />);
    wrapper.find('MenuItem').at(0).simulate('click', {}, {
      name: 'search',
    });
    expect(routes.Router.pushRoute).toHaveBeenCalledTimes(1);
    expect(routes.Router.pushRoute).toHaveBeenCalledWith('/search');
  });

  test('should route about click handler correctly', () => {
    const wrapper = shallow(<Header item="search" />);
    expect(routes.Router.pushRoute).toHaveBeenCalledTimes(0);
    wrapper.find('MenuItem').at(1).simulate('click', {}, {
      name: 'about',
    });
    expect(routes.Router.pushRoute).toHaveBeenCalledTimes(1);
    expect(routes.Router.pushRoute).toHaveBeenCalledWith('/about');
  });
});
