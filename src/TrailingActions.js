import React from 'react';

import './TrailingActions.css';

const TrailingActions = ({ children }) => {
  if (children === null || children === undefined) {
    return null;
  }

  if (Array.isArray(children)) {

    let lastValidChildIndex = 0;

    React.Children.forEach(children, (child, index) => {
        if (React.isValidElement(child)) {
            lastValidChildIndex = index;
        }
    });

    return React.Children.map(children, (child, index) => {
      if (!React.isValidElement(child)) {
        return child;
      }
      return React.cloneElement(child, {
        main: index === lastValidChildIndex,
        trailing: true,
      });
    });
  }

  return React.cloneElement(children, {
    main: true,
    trailing: true,
  });
};

export default TrailingActions;
