import React from 'react';
import { SidePanel } from '.';

// eslint-disable-next-line react/prop-types
export default function Layout({ children }) {
  return (
    <div className="examples-layout">
      <SidePanel />
      <div className="examples-page-container">{children}</div>
    </div>
  );
}
