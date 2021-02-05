import React from 'react';

import './SwipeableList.css';

export const Type = {
  IOS: Symbol('IOS'),
  MS: Symbol('MS'),
  ANDROID: Symbol('ANDROID'),
};

const SwipeableList = ({
  children,
  fullSwipe = false,
  destructiveCallbackDelay = 1000,
  style,
  type = Type.ANDROID,
  Tag = 'div',
  scrollStartThreshold,
  swipeStartThreshold,
  threshold = 0.5,
}) => (
  <Tag className="swipeable-list" style={style}>
    {React.Children.map(children, child =>
      React.cloneElement(child, {
        destructiveCallbackDelay,
        fullSwipe,
        listType: type,
        scrollStartThreshold,
        swipeStartThreshold,
        threshold,
      })
    )}
  </Tag>
);

export default SwipeableList;
