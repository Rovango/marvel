import React from 'react';
import ReactDOM from 'react-dom';
import style from './index.module.less';

function Search() {
  return (
    <div>
      <h1 className={style.title}>search page</h1>
    </div>
  );
}

ReactDOM.render(<Search />, document.getElementById('root'));
