import React from 'react';
import ReactDOM from 'react-dom';
import 'common/utils/mobile-debug';
import { fontAdaptation } from 'common/utils';

import App from './App';
import * as serviceWorker from './serviceWorker';
import './styles/index.less';

fontAdaptation();

ReactDOM.render(<App />, document.getElementById('root'));

// TODO PWA
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
