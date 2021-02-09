import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Type as ListType } from './SwipeableList';
import './SwipeableListItem.css';

export const ItemContext = React.createContext();

const ActionAnimation = {
  RETURN: Symbol('Return'),
  REMOVE: Symbol('Remove'),
  NONE: Symbol('None'),
};

const DragDirection = {
  UP: 1,
  DOWN: 2,
  LEFT: 3,
  RIGHT: 4,
  UNKNOWN: 5,
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
    this.listElement.addEventListener('mousedown', this.handleDragStartMouse);

    this.listElement.addEventListener('touchstart', this.handleDragStartTouch);
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
  }

  componentWillUnmount() {
    if (this.requestedAnimationFrame) {
      cancelAnimationFrame(this.requestedAnimationFrame);

      this.requestedAnimationFrame = null;
    }

    this.listElement.removeEventListener(
      'mousedown',
      this.handleDragStartMouse
    );

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

        this.left = clientX - this.dragStartPoint.x;
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

        this.left = clientX - this.dragStartPoint.x;
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

  playReturnAnimation = ({ to = 0 } = {}) => {
    const { leadingActionsElement, listElement, trailingActionsElement } = this;
    const { listType } = this.props;

    const isIosType = listType === ListType.IOS;

    if (listElement) {
      listElement.className =
        'swipeable-list-item__content swipeable-list-item__content--return';
      listElement.style.transform = `translateX(${isIosType ? to : 0}px)`;
    }

    if (leadingActionsElement) {
      leadingActionsElement.className =
        'swipeable-list-item__leading-actions swipeable-list-item__leading-actions--return';
      leadingActionsElement.style.width = `${
        to === 0 || !isIosType
          ? 0
          : this.leadingActionsOpened && isIosType
          ? this.leadingActionsWidth
          : 0
      }px`;
    }

    if (trailingActionsElement) {
      trailingActionsElement.className =
        'swipeable-list-item__trailing-actions swipeable-list-item__trailing-actions--return';
      trailingActionsElement.style.width = `${
        to === 0 || !isIosType
          ? 0
          : this.trailingActionsOpened && isIosType
          ? this.trailingActionsWidth
          : 0
      }px`;
    }

    if (to === 0) {
      this.leadingActionsOpened = false;
      this.trailingActionsOpened = false;
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
    if (this.isSwiping()) {
      const { leadingFullSwipe, trailingFullSwipe, triggerAction } = this.state;

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
        this.resetState();
        this.playReturnAnimation();
      }

      if (this.props.onSwipeEnd) {
        this.props.onSwipeEnd();
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
        onSwipeStart();
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
        });
      } else if (this.left > threshold) {
        this.setState({
          leadingFullSwipe: true,
          trailingFullSwipe: false,
          triggerAction: true,
        });
      } else {
        this.setState({
          triggerAction: false,
        });
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
          this.props.onSwipeProgress(swipeDistancePercent);
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
    const { destructiveCallbackDelay, listType } = this.props;
    const { leadingFullSwipe, trailingFullSwipe } = this.state;
    const {
      onActionTriggered,
      setLeadingFullSwipeAction,
      setTrailingFullSwipeAction,
    } = this;

    return (
      <div className={`swipeable-list-item__${type}-actions`} ref={binder}>
        <ItemContext.Provider
          value={{
            destructiveCallbackDelay,
            listType,
            leadingFullSwipe,
            onActionTriggered,
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

  render() {
    const { children, leadingActions, trailingActions } = this.props;

    return (
      <div className="swipeable-list-item" ref={this.bindWrapperElement}>
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
  children: PropTypes.node,
  fullSwipe: PropTypes.bool,
  listType: PropTypes.oneOf(Object.values(ListType)),
  onSwipeEnd: PropTypes.func,
  onSwipeStart: PropTypes.func,
  scrollStartThreshold: PropTypes.number,
  swipeStartThreshold: PropTypes.number,
  blockSwipe: PropTypes.bool,
  threshold: PropTypes.number,
  onSwipeProgress: PropTypes.func,
  destructiveCallbackDelay: PropTypes.number,
  leadingActions: PropTypes.node,
  trailingActions: PropTypes.node,
};

export default SwipeableListItem;
