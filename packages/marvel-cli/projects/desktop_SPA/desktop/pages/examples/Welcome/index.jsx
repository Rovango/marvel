import React from 'react';
import AppLogo from '@/assets/images/bybit.png';

export default function WelcomePage() {
  return (
    <div className="examples-welcome-page">
      <a href="//bybit-cn.com">
        <img src={AppLogo} className="app-logo" alt="logo" />
      </a>
      <h1>Welcome to Bybit Marvel!</h1>
      <p>
        恭喜! 您已经成功地使用 <code>@bybit/marvel-cli</code>{' '}
        创建了您的单页应用! 看到这个页面意味着一切运行正常。
      </p>
      <p>
        这个示例应用展示了如何对容器进行布局，如何使用Redux和React Router。
        {/* 如果您想要移除所有示例代码，您需要将这个页面及相关文件全部删除。
        您也可以在项目文件夹中运行已下命令来达到此目的：
        <code>&quot;@bybit/marvel-cli remove spa examples&quot;</code>。 */}
      </p>
      <p>
        Contratulations! You have created your single-page app by{' '}
        <code>@bybit/marvel-cli</code> successfully! Seeing this page means
        everything works well now.
      </p>
      <p>
        This is an example page showing about how to layout the container, how
        to use Redux and React Router.
        {/* If you want to remove all sample code, just delete the feature and its relative files.
        Alternatively you can run&nbsp;
        <code>&quot;@bybit/marvel-cli remove spa examples&quot;</code> via command line under the project folder. */}
      </p>
    </div>
  );
}
