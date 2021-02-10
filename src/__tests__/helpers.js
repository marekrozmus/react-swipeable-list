import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';

import {
  LeadingActions,
  SwipeableListItem,
  SwipeAction,
  TrailingActions,
  Type as ListType,
} from '../index';

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

const movePoint = (point, direction) => {
  const { clientX, clientY } = point;

  switch (direction) {
    case Direction.North:
      return { clientX, clientY: clientY - DELTA };
    case Direction.West:
      return { clientX: clientX - DELTA, clientY };
    case Direction.South:
      return { clientX, clientY: clientY + DELTA };
    case Direction.East:
      return { clientX: clientX + DELTA, clientY };
    case Direction.NorthWest:
      return movePoint(movePoint(point, Direction.North), Direction.West);
    case Direction.NorthEast:
      return movePoint(movePoint(point, Direction.North), Direction.East);
    case Direction.SouthWest:
      return movePoint(movePoint(point, Direction.South), Direction.West);
    case Direction.SouthEast:
      return movePoint(movePoint(point, Direction.South), Direction.East);
  }
};

export const makeMouseGesture = (container, directions) => {
  let point = startPoint();

  fireEvent.mouseDown(container, point);

  for (let i = 0; i < directions.length; i++) {
    point = movePoint(point, directions[i]);
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
    point = movePoint(point, directions[i]);
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
  cleanup();

  window.requestAnimationFrame.mockRestore();

  global.Date.now = RealDate;
};

const DEFAULT_THRESHOLD = 0.5;
const DEFAULT_LIST_ITEM_WIDTH = 360;

export const setListItemWidth = (item, width = DEFAULT_LIST_ITEM_WIDTH) => {
  jest.spyOn(item, 'offsetWidth', 'get').mockImplementation(() => width);
};

export const toThreshold = ({
  distance = DEFAULT_LIST_ITEM_WIDTH,
  threshold = DEFAULT_THRESHOLD,
} = {}) => threshold * distance;

export const beyondThreshold = ({
  distance = DEFAULT_LIST_ITEM_WIDTH,
  threshold = DEFAULT_THRESHOLD,
} = {}) => toThreshold({ threshold, distance }) + 1;

export const renderAndroidType = ({
  blockSwipe = false,
  fullSwipe = true,
  leadingActionCallback,
  onSwipeStartCallback,
  onSwipeEndCallback,
  trailingActionCallback,
  threshold = DEFAULT_THRESHOLD,
}) =>
  render(
    <SwipeableListItem
      blockSwipe={blockSwipe}
      fullSwipe={fullSwipe}
      leadingActions={
        <LeadingActions>
          <SwipeAction onClick={leadingActionCallback}>Test</SwipeAction>
        </LeadingActions>
      }
      listType={ListType.ANDROID}
      threshold={threshold}
      trailingActions={
        <TrailingActions>
          <SwipeAction onClick={trailingActionCallback}>Test</SwipeAction>
        </TrailingActions>
      }
      onSwipeEnd={onSwipeEndCallback}
      onSwipeStart={onSwipeStartCallback}
    >
      <span>Item content</span>
    </SwipeableListItem>
  );
