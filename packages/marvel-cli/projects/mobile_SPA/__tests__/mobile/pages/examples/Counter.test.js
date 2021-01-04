import React from 'react';
// import { Provider } from 'react-redux';
// import configureMockStore from 'redux-mock-store';
import { shallow } from 'enzyme';
// import { useDispatch, renderHook } from '@testing-library/react-hooks';
import Counter from '@/pages/examples/Counter';

describe('examples/Counter', () => {
  // // eslint-disable-next-line react/prop-types
  // const ReduxProvider = ({ children, reduxStore }) => (
  //   <Provider store={reduxStore}>{children}</Provider>
  // );

  // const mockStore = configureMockStore();
  // const store = mockStore({ count: 0 });
  // // eslint-disable-next-line react/prop-types
  // const wrapper = ({ children }) => (
  //   <ReduxProvider reduxStore={store}>{children}</ReduxProvider>
  // );
  // const { result } = renderHook(() => {

  // }, { wrapper });
  it('renders node with correct class name', () => {
    const props = {
      examples: {},
      actions: {},
    };
    const renderedComponent = shallow(<Counter {...props} />);

    expect(renderedComponent.find('.examples-counter-page').length).toBe(1);
  });

  it('counter actions are called when buttons clicked', () => {
    const pageProps = {
      examples: {},
      actions: {
        counterPlusOne: jest.fn(),
        counterMinusOne: jest.fn(),
        counterReset: jest.fn(),
      },
    };
    const renderedComponent = shallow(<Counter {...pageProps} />);
    renderedComponent.find('.btn-plus-one').simulate('click');
    renderedComponent.find('.btn-minus-one').simulate('click');
    renderedComponent.find('.btn-reset').simulate('click');
    expect(pageProps.actions.counterPlusOne.mock.calls.length).toBe(1);
    expect(pageProps.actions.counterMinusOne.mock.calls.length).toBe(1);
    expect(pageProps.actions.counterReset.mock.calls.length).toBe(1);
  });
});
