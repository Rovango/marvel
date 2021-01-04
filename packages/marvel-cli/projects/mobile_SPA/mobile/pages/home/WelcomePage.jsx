import React from 'react';
import { Link } from 'react-router-dom';
import BybitLogo from '@/assets/images/bybit.png';

export default function WelcomePage() {
  return (
    <div className="home-welcome-page">
      <header className="app-header">
        <img src={BybitLogo} className="bybit-logo" alt="logo" />
        <h1 className="app-title">Welcome to Bybit Marvel</h1>
      </header>
      <div className="app-intro">
        <h3>快速开始:</h3>
        <ul>
          <li>
            若要编辑此页面，请编辑组件{' '}
            <code>src/pages/home/WelcomePage.js</code> 。
          </li>
          <li>
            若要编辑根路由容器的Layout，请编辑组件{' '}
            <code>src/pages/home/App.jsx</code> 。
          </li>
          <li>
            更多示例, 请前往:&nbsp;
            <Link to="/examples">/examples</Link>
          </li>
        </ul>
        <h3>To get started:</h3>
        <ul>
          <li>
            Edit component <code>src/pages/home/WelcomePage.js</code> for this
            page.
          </li>
          <li>
            Edit component <code>src/pages/home/App.jsx</code> for the root
            container layout.
          </li>
          <li>
            To see examples, access:&nbsp;
            <Link to="/examples">/examples</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
