import React from 'react';
import { shallow } from 'enzyme';
import Welcome from '@/pages/examples/Welcome';

describe('examples/Welcome', () => {
  it('renders node with correct class name', () => {
    const props = {
      examples: {},
      actions: {},
    };
    const renderedComponent = shallow(<Welcome {...props} />);

    expect(renderedComponent.find('.examples-welcome-page').length).toBe(1);
  });
});
