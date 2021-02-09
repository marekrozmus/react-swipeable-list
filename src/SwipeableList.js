import React from 'react';
import PropTypes from 'prop-types';

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

SwipeableList.propTypes = {
  children: PropTypes.node,
  fullSwipe: PropTypes.bool,
  destructiveCallbackDelay: PropTypes.number,
  style: PropTypes.object,
  type: PropTypes.oneOf(Object.values(Type)),
  Tag: PropTypes.string,
  scrollStartThreshold: PropTypes.number,
  swipeStartThreshold: PropTypes.number,
  threshold: PropTypes.number,
};

export default SwipeableList;
