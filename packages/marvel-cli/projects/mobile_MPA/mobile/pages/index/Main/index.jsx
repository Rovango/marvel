import React from 'react';
import QRCode from '@/assets/bybit-app-download.png';
import style from './index.module.less';

function Main() {
  return (
    <div>
      <h1 className={style.title}>index page</h1>
      <img src={QRCode} className={style.image} alt="qrcode" />
      <a href="/search-page.html" style={{ fontSize: '0.36rem' }}>
        /search-page
      </a>
    </div>
  );
}

export default Main;
