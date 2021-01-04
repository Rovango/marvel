import React from 'react';
import ReactDOM from 'react-dom';
import 'common/utils/mobile-debug';
import fontAdapt from 'common/utils/fontAdaptation';

import '@/styles/global.less';
import Main from './Main';

fontAdapt();

ReactDOM.render(<Main />, document.getElementById('root'));
