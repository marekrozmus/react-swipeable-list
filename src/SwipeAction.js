import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';

import { Type as ListType } from './SwipeableList';
import { ItemContext } from './SwipeableListItem';

import './SwipeAction.css';

const SwipeAction = ({
  children,
  className,
  destructive = false,
  main = false,
  leading,
  onClick,
  trailing,
  Tag = 'span',
}) => {
  const {
    destructiveCallbackDelay,
    leadingFullSwipe,
    listType,
    onActionTriggered,
    setLeadingFullSwipeAction,
    setTrailingFullSwipeAction,
    trailingFullSwipe,
    scaleLeading,
    scaleTrailing,
  } = React.useContext(ItemContext);

  const onHandleClick = React.useCallback(() => {
    onActionTriggered(destructive);
    if (destructive) {
      window.setTimeout(() => onClick(), destructiveCallbackDelay);
    } else {
      onClick();
    }
  }, [destructive, destructiveCallbackDelay, onActionTriggered, onClick]);

  React.useEffect(() => {
    if (leading && main) {
      setLeadingFullSwipeAction(onHandleClick);
    }
  }, [leading, main, onHandleClick, setLeadingFullSwipeAction]);

  React.useEffect(() => {
    if (trailing && main) {
      setTrailingFullSwipeAction(onHandleClick);
    }
  }, [trailing, main, onHandleClick, setTrailingFullSwipeAction]);

  return (
    <Tag
      className={clsx(
        'swipe-action',
        {
          'swipe-action__leading': leading,
          'swipe-action__trailing': trailing,
          'swipe-action__leading--full-swipe-rest':
            leading && leadingFullSwipe && !main && listType === ListType.IOS,
          'swipe-action__leading--full-swipe-main':
            leading && leadingFullSwipe && main && listType === ListType.IOS,
          'swipe-action__trailing--full-swipe-rest':
            trailing && trailingFullSwipe && !main && listType === ListType.IOS,
          'swipe-action__trailing--full-swipe-main':
            trailing && trailingFullSwipe && main && listType === ListType.IOS,
          'swipe-action__grayed':
            listType === ListType.MS && !(scaleLeading || scaleTrailing),
        },
        className
      )}
      onClick={onHandleClick}
    >
      {children}
    </Tag>
  );
};

SwipeAction.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  destructive: PropTypes.bool,
  main: PropTypes.bool,
  leading: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  trailing: PropTypes.bool,
  Tag: PropTypes.string,
};

export default SwipeAction;
