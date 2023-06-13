import React from 'react';

import './TrailingActions.css';

const TrailingActions = ({ children }) => {
  if (children === null || children === undefined) {
    return null;
  }

  if (Array.isArray(children)) {
    return React.Children.map(children, (child, index) => {
      if (!React.isValidElement(child)) {
        return child;
      }
      return React.cloneElement(child, {
        main: index === children.length - 1,
        trailing: true,
      })
    });
  }

  return React.cloneElement(children, {
    main: true,
    trailing: true,
  });
};

export default TrailingActions;
