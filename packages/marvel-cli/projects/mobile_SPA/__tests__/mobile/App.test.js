import React from 'react';
import { shallow } from 'enzyme';
import store from '@/common/store';
import App from '@/App';

describe('App', () => {
  it('App has no error', () => {
    const DumpContainer = () => (
      <div className="container">{this.props.children}</div>
    );
    const NotFoundComp = () => <div className="not-found">Not found</div>;
    const routes = [
      {
        childRoutes: [
          {
            path: '/',
            component: DumpContainer,
            childRoutes: [{ path: 'abc' }],
          },
          { path: '/root', autoIndexRoute: true },
          { path: 'relative-path', name: 'Link Name' },
          {
            path: 'sub-links',
            childRoutes: [{ path: 'sub-link' }],
          },
          { path: '*', component: NotFoundComp },
        ],
      },
    ];

    shallow(<App store={store} routeConfig={routes} />);
  });
});
