import _ from 'lodash';
import { App } from '../pages/home';
import { PageNotFound } from '../pages/common';
import homeRoute from '../pages/home/route';
import commonRoute from '../pages/common/route';
import examplesRoute from '../pages/examples/route';

// NOTE: DO NOT CHANGE the 'childRoutes' name and the declaration pattern.
// This is used for @bybit/marvel-cli cmds to register routes config for new features, and remove config when remove features, etc.
const childRoutes = [homeRoute, commonRoute, examplesRoute];

const routes = [
  {
    path: '/',
    component: App,
    childRoutes: [
      ...childRoutes,
      { path: '*', name: 'Page not found', component: PageNotFound },
    ].filter((r) => r.component || (r.childRoutes && r.childRoutes.length > 0)),
  },
];

// Handle isIndex property of route config:
//  Dupicate it and put it as the first route rule.
function handleIndexRoute(route) {
  if (!route.childRoutes || !route.childRoutes.length) {
    return;
  }

  const indexRoute = _.find(route.childRoutes, (child) => child.isIndex);
  if (indexRoute) {
    const first = { ...indexRoute };
    first.path = '';
    first.exact = true;
    first.autoIndexRoute = true; // mark it so that the simple nav won't show it.
    route.childRoutes.unshift(first);
  }
  route.childRoutes.forEach(handleIndexRoute);
}

routes.forEach(handleIndexRoute);
export default routes;
