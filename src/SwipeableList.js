import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';

import './SwipeableList.css';

export const Type = {
  ANDROID: Symbol('ANDROID'),
  IOS: Symbol('IOS'),
  MS: Symbol('MS'),
};

const SwipeableList = ({
  actionDelay = 0,
  children,
  className = '',
  fullSwipe = false,
  destructiveCallbackDelay = 1000,
  style,
  type = Type.ANDROID,
  Tag = 'div',
  scrollStartThreshold,
  swipeStartThreshold,
  threshold = 0.5,
}) => (
  <Tag className={clsx('swipeable-list', className)} style={style}>
    {React.Children.map(children, child =>
      React.cloneElement(child, {
        actionDelay,
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
  actionDelay: PropTypes.number,
  children: PropTypes.node,
  className: PropTypes.string,
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
