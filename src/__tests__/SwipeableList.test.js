import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render } from '@testing-library/react';

import {
  LeadingActions,
  SwipeableList,
  SwipeableListItem,
  SwipeAction,
  TrailingActions,
  Type as ListType,
} from '../index';

import {
  DELTA,
  Direction,
  makeMouseGesture,
  makeTouchGesture,
  beyondThreshold,
} from './helpers';

const RealDate = Date.now;

beforeEach(() => {
  jest.spyOn(window, 'requestAnimationFrame').mockImplementation(cb => cb());

  let tick = 0;

  global.Date.now = jest.fn(() => {
    tick += 1000;
    return RealDate() + tick;
  });
});

afterEach(() => {
  window.requestAnimationFrame.mockRestore();

  global.Date.now = RealDate;
});

describe('SwipeableList', () => {
  test('list rendering with items', () => {
    const { container, getByText } = render(
      <SwipeableList>
        <SwipeableListItem>
          <span>Item content 1</span>
        </SwipeableListItem>
        <SwipeableListItem>
          <span>Item content 2</span>
        </SwipeableListItem>
      </SwipeableList>
    );
    expect(getByText('Item content 1')).toBeInTheDocument();
    expect(getByText('Item content 2')).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('swipeable-list');
  });

  test('blocking swipe on scroll', () => {
    const callbackLeading = jest.fn();
    const callbackTrailing = jest.fn();

    const { queryAllByTestId } = render(
      <SwipeableList type={ListType.ANDROID}>
        <SwipeableListItem
          leadingActions={
            <LeadingActions>
              <SwipeAction onClick={callbackLeading}>
                <span>Left swipe content</span>
              </SwipeAction>
            </LeadingActions>
          }
          trailingActions={
            <TrailingActions>
              <SwipeAction onClick={callbackTrailing}>
                <span>Right swipe content</span>
              </SwipeAction>
            </TrailingActions>
          }
        >
          <span>Item content 1</span>
        </SwipeableListItem>
      </SwipeableList>
    );

    const listItem = queryAllByTestId('content')[0];
    makeMouseGesture(listItem, [
      { direction: Direction.North, distance: beyondThreshold() },
    ]);
    makeMouseGesture(listItem, [
      { direction: Direction.NorthEast, distance: beyondThreshold() },
    ]);
    makeMouseGesture(listItem, [
      { direction: Direction.NorthWest, distance: beyondThreshold() },
    ]);
    makeMouseGesture(listItem, [
      { direction: Direction.South, distance: beyondThreshold() },
    ]);
    makeMouseGesture(listItem, [
      { direction: Direction.SouthEast, distance: beyondThreshold() },
    ]);
    makeMouseGesture(listItem, [
      { direction: Direction.SouthWest, distance: beyondThreshold() },
    ]);
    makeMouseGesture(listItem, [
      { direction: Direction.North, distance: DELTA },
      { direction: Direction.East, distance: beyondThreshold() },
    ]);
    makeMouseGesture(listItem, [
      { direction: Direction.North, distance: DELTA },
      { direction: Direction.West, distance: beyondThreshold() },
    ]);
    makeMouseGesture(listItem, [
      { direction: Direction.NorthEast, distance: DELTA },
      { direction: Direction.East, distance: beyondThreshold() },
    ]);
    makeMouseGesture(listItem, [
      { direction: Direction.NorthEast, distance: DELTA },
      { direction: Direction.West, distance: beyondThreshold() },
    ]);
    makeMouseGesture(listItem, [
      { direction: Direction.NorthWest, distance: DELTA },
      { direction: Direction.East, distance: beyondThreshold() },
    ]);
    makeMouseGesture(listItem, [
      { direction: Direction.NorthWest, distance: DELTA },
      { direction: Direction.West, distance: beyondThreshold() },
    ]);
    makeMouseGesture(listItem, [
      { direction: Direction.South, distance: DELTA },
      { direction: Direction.East, distance: beyondThreshold() },
    ]);
    makeMouseGesture(listItem, [
      { direction: Direction.South, distance: DELTA },
      { direction: Direction.West, distance: beyondThreshold() },
    ]);
    makeMouseGesture(listItem, [
      { direction: Direction.SouthEast, distance: DELTA },
      { direction: Direction.East, distance: beyondThreshold() },
    ]);
    makeMouseGesture(listItem, [
      { direction: Direction.SouthEast, distance: DELTA },
      { direction: Direction.West, distance: beyondThreshold() },
    ]);
    makeMouseGesture(listItem, [
      { direction: Direction.SouthWest, distance: DELTA },
      { direction: Direction.East, distance: beyondThreshold() },
    ]);
    makeMouseGesture(listItem, [
      { direction: Direction.SouthWest, distance: DELTA },
      { direction: Direction.West, distance: beyondThreshold() },
    ]);
    expect(callbackLeading).toHaveBeenCalledTimes(0);
    expect(callbackTrailing).toHaveBeenCalledTimes(0);
    makeTouchGesture(listItem, [
      { direction: Direction.North, distance: beyondThreshold() },
    ]);
    makeTouchGesture(listItem, [
      { direction: Direction.NorthEast, distance: beyondThreshold() },
    ]);
    makeTouchGesture(listItem, [
      { direction: Direction.NorthWest, distance: beyondThreshold() },
    ]);
    makeTouchGesture(listItem, [
      { direction: Direction.South, distance: beyondThreshold() },
    ]);
    makeTouchGesture(listItem, [
      { direction: Direction.SouthEast, distance: beyondThreshold() },
    ]);
    makeTouchGesture(listItem, [
      { direction: Direction.SouthWest, distance: beyondThreshold() },
    ]);
    makeTouchGesture(listItem, [
      { direction: Direction.North, distance: DELTA },
      { direction: Direction.East, distance: beyondThreshold() },
    ]);
    makeTouchGesture(listItem, [
      { direction: Direction.North, distance: DELTA },
      { direction: Direction.West, distance: beyondThreshold() },
    ]);
    makeTouchGesture(listItem, [
      { direction: Direction.NorthEast, distance: DELTA },
      { direction: Direction.East, distance: beyondThreshold() },
    ]);
    makeTouchGesture(listItem, [
      { direction: Direction.NorthEast, distance: DELTA },
      { direction: Direction.West, distance: beyondThreshold() },
    ]);
    makeTouchGesture(listItem, [
      { direction: Direction.NorthWest, distance: DELTA },
      { direction: Direction.East, distance: beyondThreshold() },
    ]);
    makeTouchGesture(listItem, [
      { direction: Direction.NorthWest, distance: DELTA },
      { direction: Direction.West, distance: beyondThreshold() },
    ]);
    makeTouchGesture(listItem, [
      { direction: Direction.South, distance: DELTA },
      { direction: Direction.East, distance: beyondThreshold() },
    ]);
    makeTouchGesture(listItem, [
      { direction: Direction.South, distance: DELTA },
      { direction: Direction.West, distance: beyondThreshold() },
    ]);
    makeTouchGesture(listItem, [
      { direction: Direction.SouthEast, distance: DELTA },
      { direction: Direction.East, distance: beyondThreshold() },
    ]);
    makeTouchGesture(listItem, [
      { direction: Direction.SouthEast, distance: DELTA },
      { direction: Direction.West, distance: beyondThreshold() },
    ]);
    makeTouchGesture(listItem, [
      { direction: Direction.SouthWest, distance: DELTA },
      { direction: Direction.East, distance: beyondThreshold() },
    ]);
    makeTouchGesture(listItem, [
      { direction: Direction.SouthWest, distance: DELTA },
      { direction: Direction.West, distance: beyondThreshold() },
    ]);
    expect(callbackLeading).toHaveBeenCalledTimes(0);
    expect(callbackTrailing).toHaveBeenCalledTimes(0);
    makeMouseGesture(listItem, [
      { direction: Direction.East, distance: beyondThreshold() },
    ]);
    expect(callbackLeading).toHaveBeenCalledTimes(1);
    makeTouchGesture(listItem, [
      { direction: Direction.East, distance: beyondThreshold() },
    ]);
    expect(callbackLeading).toHaveBeenCalledTimes(2);
    makeMouseGesture(listItem, [
      { direction: Direction.West, distance: beyondThreshold() },
    ]);
    expect(callbackTrailing).toHaveBeenCalledTimes(1);
    makeTouchGesture(listItem, [
      { direction: Direction.West, distance: beyondThreshold() },
    ]);
    expect(callbackTrailing).toHaveBeenCalledTimes(2);
  });

  test('swipe start threshold', () => {
    const callbackLeading = jest.fn();
    const callbackTrailing = jest.fn();

    const { queryAllByTestId } = render(
      <SwipeableList swipeStartThreshold={DELTA + 1} type={ListType.ANDROID}>
        <SwipeableListItem
          leadingActions={
            <LeadingActions>
              <SwipeAction onClick={callbackLeading}>
                <span>Leading swipe content</span>
              </SwipeAction>
            </LeadingActions>
          }
          trailingActions={
            <TrailingActions>
              <SwipeAction onClick={callbackTrailing}>
                <span>Trailing swipe content</span>
              </SwipeAction>
            </TrailingActions>
          }
        >
          <span>Item content 1</span>
        </SwipeableListItem>
      </SwipeableList>
    );

    const listItem = queryAllByTestId('content')[0];
    makeMouseGesture(listItem, [
      { direction: Direction.East, distance: DELTA },
    ]);
    expect(callbackLeading).toHaveBeenCalledTimes(0);
    makeMouseGesture(listItem, [
      { direction: Direction.West, distance: DELTA },
    ]);
    expect(callbackTrailing).toHaveBeenCalledTimes(0);
    makeTouchGesture(listItem, [
      { direction: Direction.East, distance: DELTA },
    ]);
    expect(callbackLeading).toHaveBeenCalledTimes(0);
    makeTouchGesture(listItem, [
      { direction: Direction.West, distance: DELTA },
    ]);
    expect(callbackTrailing).toHaveBeenCalledTimes(0);
  });

  test('blocking scroll on swipe', () => {
    const callbackLeading = jest.fn();
    const callbackTrailing = jest.fn();

    const { queryAllByTestId } = render(
      <SwipeableList scrollStartThreshold={DELTA + 1} type={ListType.ANDROID}>
        <SwipeableListItem
          leadingActions={
            <LeadingActions>
              <SwipeAction onClick={callbackLeading}>
                <span>Leading swipe content</span>
              </SwipeAction>
            </LeadingActions>
          }
          trailingActions={
            <TrailingActions>
              <SwipeAction onClick={callbackTrailing}>
                <span>Trailing swipe content</span>
              </SwipeAction>
            </TrailingActions>
          }
        >
          <span>Item content 1</span>
        </SwipeableListItem>
      </SwipeableList>
    );

    const listItem = queryAllByTestId('content')[0];
    makeMouseGesture(listItem, [
      { direction: Direction.North, distance: DELTA },
      { direction: Direction.East, distance: DELTA },
      { direction: Direction.East, distance: DELTA },
      { direction: Direction.East, distance: beyondThreshold() },
    ]);
    makeMouseGesture(listItem, [
      { direction: Direction.South, distance: DELTA },
      { direction: Direction.East, distance: DELTA },
      { direction: Direction.East, distance: DELTA },
      { direction: Direction.East, distance: beyondThreshold() },
    ]);
    expect(callbackLeading).toHaveBeenCalledTimes(2);

    makeMouseGesture(listItem, [
      { direction: Direction.North, distance: DELTA },
      { direction: Direction.West, distance: DELTA },
      { direction: Direction.West, distance: DELTA },
      { direction: Direction.West, distance: beyondThreshold() },
    ]);
    makeMouseGesture(listItem, [
      { direction: Direction.South, distance: DELTA },
      { direction: Direction.West, distance: DELTA },
      { direction: Direction.West, distance: DELTA },
      { direction: Direction.West, distance: beyondThreshold() },
    ]);
    expect(callbackTrailing).toHaveBeenCalledTimes(2);

    makeTouchGesture(listItem, [
      { direction: Direction.North, distance: DELTA },
      { direction: Direction.East, distance: DELTA },
      { direction: Direction.East, distance: DELTA },
      { direction: Direction.East, distance: beyondThreshold() },
    ]);
    makeTouchGesture(listItem, [
      { direction: Direction.South, distance: DELTA },
      { direction: Direction.East, distance: DELTA },
      { direction: Direction.East, distance: DELTA },
      { direction: Direction.East, distance: beyondThreshold() },
    ]);
    expect(callbackLeading).toHaveBeenCalledTimes(4);

    makeTouchGesture(listItem, [
      { direction: Direction.North, distance: DELTA },
      { direction: Direction.West, distance: DELTA },
      { direction: Direction.West, distance: DELTA },
      { direction: Direction.West, distance: beyondThreshold() },
    ]);
    makeTouchGesture(listItem, [
      { direction: Direction.South, distance: DELTA },
      { direction: Direction.West, distance: DELTA },
      { direction: Direction.West, distance: DELTA },
      { direction: Direction.West, distance: beyondThreshold() },
    ]);
    expect(callbackTrailing).toHaveBeenCalledTimes(4);
  });
});
