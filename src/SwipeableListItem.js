import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

import { Type as ListType } from './SwipeableList';
import './SwipeableListItem.css';

export const ItemContext = React.createContext();

const ActionAnimation = {
  RETURN: Symbol('Return'),
  REMOVE: Symbol('Remove'),
  NONE: Symbol('None'),
};

const DragDirection = {
  UP: 'up',
  DOWN: 'down',
  LEFT: 'left',
  RIGHT: 'right',
  UNKNOWN: 'unknown',
};

const FPS_INTERVAL = 1000 / 60;

const measure = (element, fn) => {
  const prevWidth = element.style.width;
  const prevVisibility = element.style.visibility;

  element.style.width = 'auto';
  element.style.visibility = 'hidden';

  const result = fn(element);

  element.style.width = prevWidth;
  element.style.visibility = prevVisibility;

  return result;
};

const initialState = {
  leadingFullSwipe: false,
  trailingFullSwipe: false,
  triggerAction: false,
  scaleLeading: false,
  scaleTrailing: false,
};

class SwipeableListItem extends PureComponent {
  constructor(props) {
    super(props);

    this.state = initialState;

    // binded elements
    this.listElement = null;
    this.leadingActionsElement = null;
    this.trailingActionsElement = null;
    this.wrapperElement = null;

    this.requestedAnimationFrame = null;

    this.leadingActionsWidth = 0;
    this.trailingActionsWidth = 0;

    this.startTime = null;

    this.previousSwipeDistancePercent = 0;

    this.leadingFullSwipeAction = null;
    this.trailingFullSwipeAction = null;

    this.id = props.id;

    this.resetState();
  }

  setLeadingFullSwipeAction = action => {
    this.leadingFullSwipeAction = action;
  };

  setTrailingFullSwipeAction = action => {
    this.trailingFullSwipeAction = action;
  };

  resetState = () => {
    this.dragStartPoint = { x: -1, y: -1 };
    this.dragDirection = DragDirection.UNKNOWN;
    this.left = 0;
    this.previousSwipeDistancePercent = 0;
    this.leadingActionsOpened = false;
    this.trailingActionsOpened = false;
  };

  get dragHorizontalDirectionThreshold() {
    return this.props.swipeStartThreshold || 10;
  }

  get dragVerticalDirectionThreshold() {
    return this.props.scrollStartThreshold || 10;
  }

  get fullSwipe() {
    const { fullSwipe, listType } = this.props;

    if (listType === ListType.IOS) {
      return fullSwipe;
    }

    return true;
  }

  componentDidMount() {
    if (!this.props.optOutMouseEvents) {
      this.listElement.addEventListener('mousedown', this.handleDragStartMouse);
    }

    this.listElement.addEventListener('touchstart', this.handleDragStartTouch, {
      passive: true,
    });
    this.listElement.addEventListener('touchend', this.handleDragEndTouch);
    this.listElement.addEventListener('touchmove', this.handleTouchMove, {
      capture: true,
      passive: false,
    });

    if (this.leadingActionsElement) {
      this.leadingActionsWidth = measure(
        this.leadingActionsElement,
        el => el.offsetWidth
      );
    }

    if (this.trailingActionsElement) {
      this.trailingActionsWidth = measure(
        this.trailingActionsElement,
        el => el.offsetWidth
      );
    }

    if (this.props.resetState) {
      this.props.resetState(this.playReturnAnimation);
    }

    if (this.props.maxSwipe) {
      this.maxSwipeThreshold =
        this.props.maxSwipe * this.listElement.offsetWidth;
    } else {
      this.maxSwipeThreshold = this.listElement.offsetWidth;
    }
  }

  componentWillUnmount() {
    if (this.requestedAnimationFrame) {
      cancelAnimationFrame(this.requestedAnimationFrame);

      this.requestedAnimationFrame = null;
    }

    if (!this.props.optOutMouseEvents) {
      this.listElement.removeEventListener(
        'mousedown',
        this.handleDragStartMouse
      );
    }

    this.listElement.removeEventListener(
      'touchstart',
      this.handleDragStartTouch
    );
    this.listElement.removeEventListener('touchend', this.handleDragEndTouch);
    this.listElement.removeEventListener('touchmove', this.handleTouchMove, {
      capture: true,
      passive: false,
    });
  }

  handleDragStartMouse = event => {
    window.addEventListener('mouseup', this.handleDragEndMouse);
    window.addEventListener('mousemove', this.handleMouseMove);

    this.listElement.addEventListener('mouseup', this.handleDragEndMouse);
    this.listElement.addEventListener('mousemove', this.handleMouseMove);

    this.handleDragStart(event);
  };

  handleDragStartTouch = event => {
    window.addEventListener('touchend', this.handleDragEndTouch);

    const touch = event.targetTouches[0];
    this.handleDragStart(touch);
  };

  handleDragStart = ({ clientX, clientY }) => {
    if (this.props.clickedCallback) {
      this.props.clickedCallback(this.id);
    }

    if (!this.leadingActionsOpened && !this.trailingActionsOpened) {
      this.resetState();
      this.setState(initialState);
    }

    let startOffsetX = 0;

    if (this.leadingActionsOpened) {
      startOffsetX = -this.leadingActionsWidth;
    }

    if (this.trailingActionsOpened) {
      startOffsetX = this.trailingActionsWidth;
    }

    this.dragStartPoint = { x: clientX + startOffsetX, y: clientY };

    this.listElement.className = 'swipeable-list-item__content';

    if (this.leadingActionsElement) {
      this.leadingActionsElement.className =
        'swipeable-list-item__leading-actions';
    }

    if (this.trailingActionsElement) {
      this.trailingActionsElement.className =
        'swipeable-list-item__trailing-actions';
    }

    this.startTime = Date.now();
    this.scheduleUpdatePosition();
  };

  handleMouseMove = event => {
    if (this.dragStartedWithinItem()) {
      const { clientX, clientY } = event;

      this.setDragDirection(clientX, clientY);

      if (this.isSwiping()) {
        event.stopPropagation();
        event.preventDefault();

        const newLeft = clientX - this.dragStartPoint.x;

        if (newLeft > 0) {
          this.left = Math.min(newLeft, this.maxSwipeThreshold);
        } else {
          this.left = Math.max(newLeft, -this.maxSwipeThreshold);
        }
        this.scheduleUpdatePosition();
      }
    }
  };

  handleTouchMove = event => {
    if (this.dragStartedWithinItem()) {
      const { clientX, clientY } = event.targetTouches[0];

      this.setDragDirection(clientX, clientY);

      if (!event.cancelable) {
        return;
      }

      if (this.isSwiping()) {
        event.stopPropagation();
        event.preventDefault();

        const newLeft = clientX - this.dragStartPoint.x;

        if (newLeft > 0) {
          this.left = Math.min(newLeft, this.maxSwipeThreshold);
        } else {
          this.left = Math.max(newLeft, -this.maxSwipeThreshold);
        }

        this.scheduleUpdatePosition();
      }
    }
  };

  handleDragEndMouse = () => {
    window.removeEventListener('mouseup', this.handleDragEndMouse);
    window.removeEventListener('mousemove', this.handleMouseMove);

    if (this.listElement) {
      this.listElement.removeEventListener('mouseup', this.handleDragEndMouse);
      this.listElement.removeEventListener('mousemove', this.handleMouseMove);
    }

    this.handleDragEnd();
  };

  handleDragEndTouch = () => {
    window.removeEventListener('touchend', this.handleDragEndTouch);

    this.handleDragEnd();
  };

  playReturnAnimationForLeadingActions = ({
    to,
    isIosType,
    playMsReturnAnimation,
  }) => {
    if (this.leadingActionsElement) {
      this.leadingActionsElement.className = clsx(
        'swipeable-list-item__leading-actions',
        playMsReturnAnimation
          ? 'swipeable-list-item__actions--return-ms'
          : 'swipeable-list-item__leading-actions--return'
      );

      if (this.leadingActionsOpened && isIosType && to !== 0) {
        this.leadingActionsElement.className += ' test-actions-opened';
      }

      if (playMsReturnAnimation) {
        const keepAnimationEnd = () => {
          this.leadingActionsElement.removeEventListener(
            'animationend',
            keepAnimationEnd
          );
          this.leadingActionsElement.style.width = 0;
        };

        this.leadingActionsElement.addEventListener(
          'animationend',
          keepAnimationEnd
        );
      } else {
        this.leadingActionsElement.style.width = `${
          to === 0 || !isIosType
            ? 0
            : this.leadingActionsOpened && isIosType
            ? this.leadingActionsWidth
            : 0
        }px`;
      }
    }
  };

  playReturnAnimationForTrailingActions = ({
    to,
    isIosType,
    playMsReturnAnimation,
  }) => {
    if (this.trailingActionsElement) {
      this.trailingActionsElement.className = clsx(
        'swipeable-list-item__trailing-actions',
        playMsReturnAnimation
          ? 'swipeable-list-item__actions--return-ms'
          : 'swipeable-list-item__trailing-actions--return'
      );

      if (this.trailingActionsOpened && isIosType && to !== 0) {
        this.trailingActionsElement.className += ' test-actions-opened';
      }

      if (!playMsReturnAnimation) {
        this.trailingActionsElement.style.width = `${
          to === 0 || !isIosType
            ? 0
            : this.trailingActionsOpened && isIosType
            ? this.trailingActionsWidth
            : 0
        }px`;
      } else {
        const keepAnimationEnd = () => {
          this.trailingActionsElement.removeEventListener(
            'animationend',
            keepAnimationEnd
          );
          this.trailingActionsElement.style.width = 0;
        };

        this.trailingActionsElement.addEventListener(
          'animationend',
          keepAnimationEnd
        );
      }
    }
  };

  playReturnAnimation = ({ to = 0 } = {}) => {
    if (this.left === 0) {
      return;
    }

    const { listElement } = this;
    const { listType } = this.props;
    const { triggerAction } = this.state;

    const isIosType = listType === ListType.IOS;
    const isMsType = listType === ListType.MS;
    const playMsReturnAnimation = triggerAction && isMsType;

    if (playMsReturnAnimation) {
      const keepAnimationEnd = () => {
        listElement.removeEventListener('animationend', keepAnimationEnd);
        listElement.style.transform = `translateX(0)`;
      };

      listElement.addEventListener('animationend', keepAnimationEnd);
    }

    if (listElement) {
      listElement.className = clsx(
        'swipeable-list-item__content',
        playMsReturnAnimation
          ? `swipeable-list-item__content--return-${
              this.left < 0 ? 'trailing' : 'leading'
            }-ms`
          : 'swipeable-list-item__content--return'
      );

      if (!playMsReturnAnimation) {
        listElement.style.transform = `translateX(${isIosType ? to : 0}px)`;
      }
    }

    if (this.left < 0) {
      this.playReturnAnimationForTrailingActions({
        to,
        isIosType,
        playMsReturnAnimation,
      });
    } else {
      this.playReturnAnimationForLeadingActions({
        to,
        isIosType,
        playMsReturnAnimation,
      });
    }

    if (to === 0) {
      this.leadingActionsOpened = false;
      this.trailingActionsOpened = false;
      this.resetState();
    }
  };

  playRemoveAnimation = () => {
    const { listElement, wrapperElement } = this;
    const { listType } = this.props;

    if (listElement) {
      wrapperElement.className =
        'swipeable-list-item swipeable-list-item--remove';
      listElement.className =
        'swipeable-list-item__content swipeable-list-item__content--remove';
      const isIosType = listType === ListType.IOS;

      const leadingFullSwipe = isIosType
        ? this.leadingActionsOpened
        : this.dragDirection === DragDirection.RIGHT;
      const trailingFullSwipe = isIosType
        ? this.trailingActionsOpened
        : this.dragDirection === DragDirection.LEFT;

      const translateLength =
        listElement.offsetWidth * (leadingFullSwipe ? 1 : -1);

      listElement.style.transform = `translateX(${translateLength}px)`;

      this.setState({
        leadingFullSwipe,
        trailingFullSwipe,
      });

      if (leadingFullSwipe) {
        this.leadingActionsElement.className +=
          ' swipeable-list-item__leading-actions--return';
        this.leadingActionsElement.style.width = `${Math.abs(
          translateLength
        )}px`;
      } else if (trailingFullSwipe) {
        this.trailingActionsElement.className +=
          ' swipeable-list-item__trailing-actions--return';
        this.trailingActionsElement.style.width = `${Math.abs(
          translateLength
        )}px`;
      }
    }
  };

  playActionAnimation = ({ type }) => {
    const { listElement } = this;

    if (listElement) {
      switch (type) {
        case ActionAnimation.REMOVE:
          this.playRemoveAnimation();
          break;
        case ActionAnimation.NONE:
          break;
        default:
          this.playReturnAnimation();
      }
    }
  };

  handleDragEnd = () => {
    if (this.requestedAnimationFrame) {
      cancelAnimationFrame(this.requestedAnimationFrame);
      this.requestedAnimationFrame = null;
    }

    if (this.isSwiping()) {
      const { leadingFullSwipe, trailingFullSwipe, triggerAction } = this.state;
      const { onSwipeEnd } = this.props;

      if (onSwipeEnd) {
        onSwipeEnd(this.dragDirection);
      }

      if (triggerAction) {
        if (leadingFullSwipe) {
          this.leadingFullSwipeAction();
          return;
        }

        if (trailingFullSwipe) {
          this.trailingFullSwipeAction();
          return;
        }
      }

      if (this.leadingActionsOpened || this.trailingActionsOpened) {
        if (this.leadingActionsOpened) {
          this.left = this.leadingActionsWidth;
        } else if (this.trailingActionsOpened) {
          this.left = -this.trailingActionsWidth;
        }

        this.playReturnAnimation({
          to: this.left,
        });
      } else {
        this.playReturnAnimation();
        this.resetState();
      }
    }
  };

  dragStartedWithinItem = () => {
    const { x, y } = this.dragStartPoint;

    return x !== -1 && y !== -1;
  };

  setDragDirection = (x, y) => {
    if (this.dragDirection === DragDirection.UNKNOWN) {
      const { x: startX, y: startY } = this.dragStartPoint;
      const horizontalDistance = Math.abs(x - startX);
      const verticalDistance = Math.abs(y - startY);

      if (
        horizontalDistance <= this.dragHorizontalDirectionThreshold &&
        verticalDistance <= this.dragVerticalDirectionThreshold
      ) {
        return;
      }

      const angle = Math.atan2(y - startY, x - startX);
      const octant = Math.round((8 * angle) / (2 * Math.PI) + 8) % 8;

      switch (octant) {
        case 0:
          if (
            this.leadingActionsElement !== null &&
            horizontalDistance > this.dragHorizontalDirectionThreshold
          ) {
            this.dragDirection = DragDirection.RIGHT;
          }
          break;
        case 1:
        case 2:
        case 3:
          if (verticalDistance > this.dragVerticalDirectionThreshold) {
            this.dragDirection = DragDirection.DOWN;
          }
          break;
        case 4:
          if (
            this.trailingActionsElement !== null &&
            horizontalDistance > this.dragHorizontalDirectionThreshold
          ) {
            this.dragDirection = DragDirection.LEFT;
          }
          break;
        case 5:
        case 6:
        case 7:
          if (verticalDistance > this.dragVerticalDirectionThreshold) {
            this.dragDirection = DragDirection.UP;
          }
          break;
        default:
          this.dragDirection = DragDirection.UNKNOWN;
      }

      const { onSwipeStart } = this.props;

      if (onSwipeStart && this.isSwiping()) {
        onSwipeStart(this.dragDirection);
      }
    }
  };

  isSwiping = () => {
    const { blockSwipe } = this.props;
    const horizontalDrag =
      this.dragDirection === DragDirection.LEFT ||
      this.dragDirection === DragDirection.RIGHT;

    return !blockSwipe && this.dragStartedWithinItem() && horizontalDrag;
  };

  scheduleUpdatePosition = () => {
    if (this.requestedAnimationFrame) {
      return;
    }

    this.requestedAnimationFrame = requestAnimationFrame(() => {
      this.requestedAnimationFrame = null;

      this.updatePosition();
    });
  };

  get onlyLeadingActions() {
    return (
      this.leadingActionsElement !== null &&
      this.trailingActionsElement === null
    );
  }

  get onlyTrailingActions() {
    return (
      this.leadingActionsElement === null &&
      this.trailingActionsElement !== null
    );
  }

  updatePosition = () => {
    if (!this.isSwiping()) {
      return;
    }

    const elapsed = Date.now() - this.startTime;

    if (elapsed <= FPS_INTERVAL) {
      return;
    }

    const { threshold: fullSwipeThreshold, listType } = this.props;
    const fullSwipe = this.fullSwipe;

    const isSwipingLeft = this.left < 0;
    const isSwipingRight = this.left > 0;

    if (isSwipingLeft) {
      if (this.onlyLeadingActions) {
        this.left = 0;
      }

      if (this.trailingActionsElement && listType === ListType.IOS) {
        this.trailingActionsOpened =
          Math.abs(this.left) > this.trailingActionsWidth;
        this.leadingActionsOpened = false;
      }
    }

    if (isSwipingRight) {
      if (this.onlyTrailingActions) {
        this.left = 0;
      }

      if (this.leadingActionsElement && listType === ListType.IOS) {
        this.leadingActionsOpened = this.left > this.leadingActionsWidth;
        this.trailingActionsOpened = false;
      }
    }

    if (this.leadingActionsElement) {
      this.leadingActionsElement.style.width = `${
        this.left < 0 ? 0 : this.left
      }px`;
    }

    if (this.trailingActionsElement) {
      this.trailingActionsElement.style.width = `${
        this.left > 0 ? 0 : -this.left
      }px`;
    }

    if (this.listElement) {
      if (fullSwipe) {
        const {
          listElement: { offsetWidth },
        } = this;

        const threshold = offsetWidth * fullSwipeThreshold;

        if (this.left < -threshold) {
          this.setState({
            leadingFullSwipe: false,
            trailingFullSwipe: true,
            triggerAction: true,
            scaleTrailing: true,
          });
        } else if (this.left > threshold) {
          this.setState({
            leadingFullSwipe: true,
            trailingFullSwipe: false,
            triggerAction: true,
            scaleLeading: true,
          });
        } else {
          this.setState({
            scaleLeading: false,
            scaleTrailing: false,
            triggerAction: false,
          });
        }
      }

      this.listElement.style.transform = `translateX(${this.left}px)`;

      if (this.props.onSwipeProgress) {
        const listElementWidth = this.listElement.offsetWidth;
        let swipeDistancePercent = this.previousSwipeDistancePercent;

        if (listElementWidth !== 0) {
          const swipeDistance = Math.max(
            0,
            listElementWidth - Math.abs(this.left)
          );

          swipeDistancePercent =
            100 - Math.round((100 * swipeDistance) / listElementWidth);
        }

        if (this.previousSwipeDistancePercent !== swipeDistancePercent) {
          this.props.onSwipeProgress(swipeDistancePercent, this.dragDirection);
          this.previousSwipeDistancePercent = swipeDistancePercent;
        }
      }
    }

    this.startTime = Date.now();
  };

  onActionTriggered = isDestructive => {
    this.playActionAnimation({
      type: isDestructive ? ActionAnimation.REMOVE : ActionAnimation.RETURN,
    });
  };

  bindListElement = ref => (this.listElement = ref);
  bindWrapperElement = ref => (this.wrapperElement = ref);
  bindLeadingActionsElement = ref => (this.leadingActionsElement = ref);
  bindTrailingActionsElement = ref => (this.trailingActionsElement = ref);

  renderActions = (actions, type, binder) => {
    const { actionDelay, destructiveCallbackDelay, listType } = this.props;
    const { leadingFullSwipe, trailingFullSwipe, scaleLeading, scaleTrailing } =
      this.state;
    const {
      onActionTriggered,
      setLeadingFullSwipeAction,
      setTrailingFullSwipeAction,
    } = this;

    const scaled =
      listType === ListType.MS &&
      ((scaleLeading && type === 'leading') ||
        (scaleTrailing && type === 'trailing'));

    return (
      <div
        className={clsx(`swipeable-list-item__${type}-actions`, {
          [`swipeable-list-item__${type}-actions--scaled`]: scaled,
        })}
        data-testid={`${type}-actions`}
        ref={binder}
      >
        <ItemContext.Provider
          value={{
            actionDelay,
            destructiveCallbackDelay,
            listType,
            leadingFullSwipe,
            onActionTriggered,
            scaleLeading,
            scaleTrailing,
            setLeadingFullSwipeAction,
            setTrailingFullSwipeAction,
            trailingFullSwipe,
          }}
        >
          {actions}
        </ItemContext.Provider>
      </div>
    );
  };

  handleClick = event => {
    if (this.props.onClick) {
      if (
        this.leadingActionsOpened ||
        this.trailingActionsOpened ||
        this.isSwiping()
      ) {
        event.preventDefault();
        return;
      }

      const delta = Math.abs(event.clientX - this.dragStartPoint.x);

      if (delta > 10) {
        // If mouse moved more than threshold, ignore the click event
        event.preventDefault();
        return;
      }

      this.props.onClick();
    }
  };

  render() {
    const { children, className, leadingActions, trailingActions } = this.props;

    return (
      <div
        className={clsx('swipeable-list-item', className)}
        id={this.id}
        ref={this.bindWrapperElement}
        onClick={this.handleClick}
      >
        {leadingActions &&
          this.renderActions(
            leadingActions,
            'leading',
            this.bindLeadingActionsElement
          )}
        <div
          className="swipeable-list-item__content"
          data-testid="content"
          ref={this.bindListElement}
        >
          {children}
        </div>
        {trailingActions &&
          this.renderActions(
            trailingActions,
            'trailing',
            this.bindTrailingActionsElement
          )}
      </div>
    );
  }
}

SwipeableListItem.propTypes = {
  actionDelay: PropTypes.number,
  blockSwipe: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string,
  destructiveCallbackDelay: PropTypes.number,
  fullSwipe: PropTypes.bool,
  leadingActions: PropTypes.node,
  listType: PropTypes.oneOf(Object.values(ListType)),
  maxSwipe: PropTypes.number,
  onClick: PropTypes.func,
  onSwipeEnd: PropTypes.func,
  onSwipeProgress: PropTypes.func,
  onSwipeStart: PropTypes.func,
  optOutMouseEvents: PropTypes.bool,
  scrollStartThreshold: PropTypes.number,
  swipeStartThreshold: PropTypes.number,
  threshold: PropTypes.number,
  trailingActions: PropTypes.node,
  clickedCallback: PropTypes.func,
  id: PropTypes.string,
  resetState: PropTypes.func,
};

export default SwipeableListItem;
