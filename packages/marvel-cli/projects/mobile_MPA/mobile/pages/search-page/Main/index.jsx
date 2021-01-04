import React from 'react';
import style from './index.module.less';

function Main() {
  return (
    <div>
      <h1 className={style.title}>search page</h1>
      <a href="/" style={{ fontSize: '0.36rem' }}>
        /index-page
      </a>
    </div>
  );
}

export default Main;
