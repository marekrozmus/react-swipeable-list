import React from 'react';

import './LeadingActions.css';

const LeadingActions = ({ children }) => {
  if (children === null || children === undefined) {
    return null;
  }

  if (Array.isArray(children)) {
    return React.Children.map(children, (child, index) =>
      React.cloneElement(child, {
        leading: true,
        main: index === 0,
      })
    );
  }

  return React.cloneElement(children, {
    leading: true,
    main: true,
  });
};

export default LeadingActions;
