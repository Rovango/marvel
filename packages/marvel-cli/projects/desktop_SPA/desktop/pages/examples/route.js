// This is the JSON way to define React Router rules in a Marvel app.
import { Welcome, Counter, MarvelList, MarvelWs, Layout } from '.';

export default {
  path: 'examples',
  component: Layout,
  childRoutes: [
    { path: '', component: Welcome, isIndex: true },
    { path: 'counter', component: Counter },
    { path: 'rest', component: MarvelList },
    { path: 'ws', component: MarvelWs },
  ],
};
