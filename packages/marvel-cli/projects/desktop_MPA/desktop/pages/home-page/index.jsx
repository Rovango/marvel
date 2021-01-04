import React from 'react';
import ReactDOM from 'react-dom';
import './index.less';
import QRCode from '@/assets/bybit-app-download.png';

function Home() {
  return (
    <div>
      <h1 className="antman-home-title">home page</h1>
      <img src={QRCode} alt="qrcode" />
    </div>
  );
}

ReactDOM.render(<Home />, document.getElementById('root'));
