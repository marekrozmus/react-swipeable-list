import React, { PureComponent } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';

import './SwipeableList.css';

export const Type = {
  ANDROID: Symbol('ANDROID'),
  IOS: Symbol('IOS'),
  MS: Symbol('MS'),
};

class SwipeableList extends PureComponent {
  constructor(props) {
    super(props);

    this.itemsMap = {};
    this.clickedItem = this.clickedItem.bind(this);
  }

  clickedItem(itemId) {
    Object.keys(this.itemsMap).forEach(listItem => {
      if (listItem !== itemId) {
        this.itemsMap[listItem]();
      }
    });
  }

  render() {
    const {
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
    } = this.props;

    return (
      <Tag className={clsx('swipeable-list', className)} style={style}>
        {React.Children.map(children, (child, index) =>
          React.cloneElement(child, {
            actionDelay,
            destructiveCallbackDelay,
            fullSwipe,
            listType: type,
            scrollStartThreshold,
            swipeStartThreshold,
            threshold,
            clickedCallback: this.clickedItem,
            id: `listItem-${index}`,
            resetState: func => {
              this.itemsMap[`listItem-${index}`] = func;
            },
          })
        )}
      </Tag>
    );
  }
}

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
