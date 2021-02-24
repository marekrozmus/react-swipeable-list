import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import {
  LeadingActions,
  SwipeableListItem,
  SwipeAction,
  TrailingActions,
  Type as ListType,
} from '../index';

const TEST_ACTIONS_WIDTH = 123;
const TEST_LIST_ITEM_WIDTH = 360;

Object.defineProperties(window.HTMLElement.prototype, {
  offsetWidth: {
    get: function () {
      const attribute = this.attributes.getNamedItem('data-testid');

      switch (attribute.value) {
        case 'leading-actions':
        case 'trailing-actions':
          return TEST_ACTIONS_WIDTH;
        case 'content':
          return TEST_LIST_ITEM_WIDTH;
      }

      return 0;
    },
  },
});

export const DELTA = 20;

export const Direction = {
  North: 1,
  NorthEast: 2,
  East: 3,
  SouthEast: 4,
  South: 5,
  SouthWest: 6,
  West: 7,
  NorthWest: 8,
};

const startPoint = () => ({ clientX: 50, clientY: 25 });

const movePoint = (point, direction, delta = DELTA) => {
  const { clientX, clientY } = point;

  switch (direction) {
    case Direction.North:
      return { clientX, clientY: clientY - delta };
    case Direction.West:
      return { clientX: clientX - delta, clientY };
    case Direction.South:
      return { clientX, clientY: clientY + delta };
    case Direction.East:
      return { clientX: clientX + delta, clientY };
    case Direction.NorthWest:
      return movePoint(
        movePoint(point, Direction.North, delta),
        Direction.West,
        delta
      );
    case Direction.NorthEast:
      return movePoint(
        movePoint(point, Direction.North, delta),
        Direction.East,
        delta
      );
    case Direction.SouthWest:
      return movePoint(
        movePoint(point, Direction.South, delta),
        Direction.West,
        delta
      );
    case Direction.SouthEast:
      return movePoint(
        movePoint(point, Direction.South, delta),
        Direction.East,
        delta
      );
  }
};

export const makeMouseGesture = (container, directions) => {
  let point = startPoint();

  fireEvent.mouseDown(container, point);

  for (let i = 0; i < directions.length; i++) {
    const { direction, distance } = directions[i];

    point = movePoint(point, direction, distance);
    fireEvent.mouseMove(container, point);
  }

  fireEvent.mouseUp(container, point);

  return point;
};

export const makeTouchGesture = (container, directions) => {
  let point = startPoint();

  fireEvent.touchStart(container, {
    targetTouches: [point],
  });

  for (let i = 0; i < directions.length; i++) {
    const { direction, distance } = directions[i];

    point = movePoint(point, direction, distance);
    fireEvent.touchMove(container, {
      targetTouches: [point],
    });
  }

  fireEvent.touchEnd(container, {
    targetTouches: [point],
  });

  return point;
};

export const swipeLeftMouse = (container, by) => {
  const startPoint = { clientX: 250, clientY: 20 };
  const endPoint = { ...startPoint, clientX: startPoint.clientX - by };

  fireEvent.mouseDown(container, startPoint);
  fireEvent.mouseMove(container, endPoint);
  fireEvent.mouseUp(container, endPoint);
};

export const swipeRightMouse = (container, by = 100) => {
  const startPoint = { clientX: 250, clientY: 20 };
  const endPoint = { ...startPoint, clientX: startPoint.clientX + by };

  fireEvent.mouseDown(container, startPoint);
  fireEvent.mouseMove(container, endPoint);
  fireEvent.mouseUp(container, endPoint);
};

export const swipeLeftTouch = (container, by = 100) => {
  const startPoint = { clientX: 250, clientY: 20 };
  const endPoint = { ...startPoint, clientX: startPoint.clientX - by };

  fireEvent.touchStart(container, {
    targetTouches: [startPoint],
  });
  fireEvent.touchMove(container, {
    targetTouches: [endPoint],
  });
  fireEvent.touchEnd(container, {
    targetTouches: [endPoint],
  });
};

export const swipeRightTouch = (container, by = 100) => {
  const startPoint = { clientX: 250, clientY: 20 };
  const endPoint = { ...startPoint, clientX: startPoint.clientX + by };

  fireEvent.touchStart(container, {
    targetTouches: [startPoint],
  });
  fireEvent.touchMove(container, {
    targetTouches: [endPoint],
  });
  fireEvent.touchEnd(container, {
    targetTouches: [endPoint],
  });
};

const RealDate = Date.now;

export const beforeEachTest = () => {
  jest.spyOn(window, 'requestAnimationFrame').mockImplementation(cb => cb());

  let tick = 0;

  global.Date.now = jest.fn(() => {
    tick += 1000;
    return RealDate() + tick;
  });
};

export const afterEachTest = () => {
  window.requestAnimationFrame.mockRestore();

  global.Date.now = RealDate;
};

const DEFAULT_THRESHOLD = 0.5;

export const toThreshold = ({
  distance = TEST_LIST_ITEM_WIDTH,
  threshold = DEFAULT_THRESHOLD,
} = {}) => threshold * distance;

export const beyondThreshold = ({
  distance = TEST_LIST_ITEM_WIDTH,
  threshold = DEFAULT_THRESHOLD,
} = {}) => toThreshold({ threshold, distance }) + 1;

export const toOpenActionsThresold = () => TEST_ACTIONS_WIDTH;
export const beyondOpenActionsThreshold = () => TEST_ACTIONS_WIDTH + 1;

export const renderAndroidType = ({
  blockSwipe = false,
  destructiveCallbackDelay = 1000,
  fullSwipe = true,
  leadingActionCallback,
  onSwipeStartCallback,
  onSwipeEndCallback,
  onSwipeProgressCallback,
  swipeStartThreshold,
  trailingActionCallback,
  threshold = DEFAULT_THRESHOLD,
  trailingDestructive = false,
} = {}) =>
  render(
    <SwipeableListItem
      blockSwipe={blockSwipe}
      destructiveCallbackDelay={destructiveCallbackDelay}
      fullSwipe={fullSwipe}
      leadingActions={
        <LeadingActions>
          <SwipeAction onClick={leadingActionCallback}>Test</SwipeAction>
        </LeadingActions>
      }
      listType={ListType.ANDROID}
      swipeStartThreshold={swipeStartThreshold}
      threshold={threshold}
      trailingActions={
        <TrailingActions>
          <SwipeAction
            destructive={trailingDestructive}
            onClick={trailingActionCallback}
          >
            Test
          </SwipeAction>
        </TrailingActions>
      }
      onSwipeEnd={onSwipeEndCallback}
      onSwipeProgress={onSwipeProgressCallback}
      onSwipeStart={onSwipeStartCallback}
    >
      <span>Item content</span>
    </SwipeableListItem>
  );

export const renderIosOneActionType = ({
  blockSwipe = false,
  fullSwipe = true,
  leadingActionCallback = jest.fn(),
  onSwipeStartCallback,
  onSwipeEndCallback,
  onSwipeProgressCallback,
  swipeStartThreshold,
  trailingActionCallback = jest.fn(),
  threshold = DEFAULT_THRESHOLD,
} = {}) =>
  render(
    <SwipeableListItem
      blockSwipe={blockSwipe}
      fullSwipe={fullSwipe}
      leadingActions={
        <LeadingActions>
          <SwipeAction onClick={leadingActionCallback}>Test</SwipeAction>
        </LeadingActions>
      }
      listType={ListType.IOS}
      swipeStartThreshold={swipeStartThreshold}
      threshold={threshold}
      trailingActions={
        <TrailingActions>
          <SwipeAction onClick={trailingActionCallback}>Test</SwipeAction>
        </TrailingActions>
      }
      onSwipeEnd={onSwipeEndCallback}
      onSwipeProgress={onSwipeProgressCallback}
      onSwipeStart={onSwipeStartCallback}
    >
      <span>Item content</span>
    </SwipeableListItem>
  );

export const renderIosTwoActionsType = ({
  blockSwipe = false,
  fullSwipe = true,
  leadingActionCallbacks = [jest.fn(), jest.fn()],
  onSwipeStartCallback,
  onSwipeEndCallback,
  onSwipeProgressCallback,
  swipeStartThreshold,
  trailingActionCallbacks = [jest.fn(), jest.fn()],
  threshold = DEFAULT_THRESHOLD,
} = {}) =>
  render(
    <SwipeableListItem
      blockSwipe={blockSwipe}
      fullSwipe={fullSwipe}
      leadingActions={
        <LeadingActions>
          <SwipeAction onClick={leadingActionCallbacks[0]}>Test 1</SwipeAction>
          <SwipeAction onClick={leadingActionCallbacks[1]}>Test 2</SwipeAction>
        </LeadingActions>
      }
      listType={ListType.IOS}
      swipeStartThreshold={swipeStartThreshold}
      threshold={threshold}
      trailingActions={
        <TrailingActions>
          <SwipeAction onClick={trailingActionCallbacks[0]}>Test 1</SwipeAction>
          <SwipeAction onClick={trailingActionCallbacks[1]}>Test 2</SwipeAction>
        </TrailingActions>
      }
      onSwipeEnd={onSwipeEndCallback}
      onSwipeProgress={onSwipeProgressCallback}
      onSwipeStart={onSwipeStartCallback}
    >
      <span>Item content</span>
    </SwipeableListItem>
  );

export const closeLeadingActions = (listItem, leadingActions) => {
  if (leadingActions.className.includes('test-actions-opened')) {
    swipeLeftMouse(listItem, TEST_ACTIONS_WIDTH); // close actions
  }
};

export const closeTrailingActions = (listItem, trailingActions) => {
  if (trailingActions.className.includes('test-actions-opened')) {
    swipeRightMouse(listItem, TEST_ACTIONS_WIDTH); // close actions
  }
};
