import React from 'react';
import { Link } from 'react-router-dom';

export default function SidePanel() {
  return (
    <div className="examples-side-panel">
      <ul>
        <li>
          <Link to="/examples">Welcome</Link>
        </li>
        <li>
          <Link to="/examples/counter">Counter Demo</Link>
        </li>
        <li>
          <Link to="/examples/rest">REST API Demo</Link>
        </li>
        <li>
          <Link to="/examples/ws">WS API Demo</Link>
        </li>
        <li>
          <Link to="/">Back to start page</Link>
        </li>
      </ul>
      <div className="memo">
        This is a Bybit-Marvel page that contains some examples for you to quick
        learn how Bybit-Marvel SPA works.
        {/* To remove it just delete the page and its relative files. Please consult <code>rovango.zheng@bybit.com</code> for more information. */}
        <br />
        <br />
        这是一个包含了一些示例代码的页面,
        能让你快速学习Bybit-Marvel单页应用是如何组织结构以及如何运行的。
        {/* 若想删除，直接移除该page及其相关代码即可。更多信息请咨询：rovango.zheng@bybit.com。 */}
      </div>
    </div>
  );
}
