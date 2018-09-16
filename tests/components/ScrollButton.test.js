import React from 'react';
import { shallow } from 'enzyme';
import ScrollButton from '../../components/ScrollButton';


let wrapper;

beforeEach(() => {
  wrapper = shallow(<ScrollButton scrollStepInPx={50} delayInMs={16.66} />);
});

test('should render correctly', () => {
  expect(wrapper).toMatchSnapshot();
});

describe('Scroll Up click function tests', () => {
  jest.useFakeTimers();

  test('should trigger scrollToTop function correctly', () => {
    wrapper.simulate('click');
    expect(setInterval).toHaveBeenCalledTimes(1);
    expect(setInterval).toHaveBeenCalledWith(wrapper.instance().scrollStep, 16.66);
    expect(wrapper.state('intervalId')).toBeGreaterThan(0);
  });

  test('should trigger scrollStep function correctly', () => {
    // the test case before this has called click once, so clear before hand
    jest.clearAllTimers();
    jest.clearAllMocks();

    window.pageYOffset = 1000;
    window.scroll = jest.fn((initVal, offsetVal) => {
      window.pageYOffset = offsetVal;
    });
    wrapper.simulate('click');

    const intervalId = wrapper.state('intervalId');

    expect(window.scroll).not.toBeCalled();

    // fast forward one timer call
    jest.runOnlyPendingTimers();
    expect(setInterval).toHaveBeenCalledTimes(1);
    expect(window.scroll).toHaveBeenCalledTimes(1);
    expect(window.scroll).toHaveBeenCalledWith(0, 1000 - 50);
    expect(window.pageYOffset).toBe(1000 - 50);

    // fast forward until the end
    jest.runAllTimers();
    expect(window.scroll).toHaveBeenCalledTimes(20);
    expect(window.scroll).toHaveBeenLastCalledWith(0, 0);
    expect(window.pageYOffset).toBe(0);
    expect(clearInterval).toHaveBeenCalledTimes(1);
    expect(clearInterval).toHaveBeenCalledWith(intervalId);
    expect(wrapper.state('intervalId')).toBe(0);
  });
});
