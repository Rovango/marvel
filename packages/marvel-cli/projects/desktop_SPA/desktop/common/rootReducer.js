import { combineReducers } from 'redux';
// import { routerReducer } from 'react-router-redux';
import { connectRouter } from 'connected-react-router';
import history from './history';
import homeReducer from '../pages/home/redux/reducer';
import commonReducer from '../pages/common/redux/reducer';
import examplesReducer from '../pages/examples/redux/reducer';

// NOTE 1: DO NOT CHANGE the 'reducerMap' name and the declaration pattern.
// This is used for @bybit/marvel-cli cmds to register new features, remove features, etc.
// NOTE 2: always use the camel case of the feature folder name as the store branch name
// So that it's easy for others to understand it and @bybit/marvel-cli could manage them.

const reducerMap = {
  router: connectRouter(history),
  home: homeReducer,
  common: commonReducer,
  examples: examplesReducer,
};

export default combineReducers(reducerMap);
