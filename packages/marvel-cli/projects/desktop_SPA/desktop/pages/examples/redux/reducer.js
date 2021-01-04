// This is the root reducer of the feature. It is used for:
//   1. Load reducers from each action in the feature and process them one by one.
//      Note that this part of code is mainly maintained by @bybit/Marvel-cli, you usually don't need to edit them.
//   2. Write cross-topic reducers. If a reducer is not bound to some specific action.
//      Then it could be written here.

import initialState from './initialState';
import { reducer as counterPlusOneReducer } from './counterPlusOne';
import { reducer as counterMinusOneReducer } from './counterMinusOne';
import { reducer as counterResetReducer } from './counterReset';
import { reducer as fetchMarvelListReducer } from './fetchMarvelList';

const reducers = [
  counterPlusOneReducer,
  counterMinusOneReducer,
  counterResetReducer,
  fetchMarvelListReducer,
];

export default function reducer(state = initialState, action) {
  let newState;
  switch (action.type) {
    // Handle cross-topic actions here
    default:
      newState = state;
      break;
  }
  return reducers.reduce((s, r) => r(s, action), newState);
}
