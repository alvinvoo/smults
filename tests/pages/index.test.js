import React from 'react';
import { shallow } from 'enzyme';
import { Index } from '../../pages/index';

test('should render Index page properly ', () => {
  const wrapper = shallow(<Index />);
  expect(wrapper).toMatchSnapshot();
});

test('should have a static getInitialProps method for connected Index', async () => {
  const ret = await Index.getInitialProps({ reduxStore: '', req: true });
  expect(ret).toEqual({ isServer: true });
});
