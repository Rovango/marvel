import React from 'react';
// import PropTypes from 'prop-types/prop-types';

// eslint-disable-next-line react/prop-types
function App({ children }) {
  return (
    <div className="home-app">
      <div className="page-container">{children}</div>
    </div>
  );
}
export default App;
