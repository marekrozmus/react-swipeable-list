import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render, cleanup } from '@testing-library/react';

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
} from './helpers';

const RealDate = Date.now;

afterEach(cleanup);

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
    makeMouseGesture(listItem, [Direction.North]);
    makeMouseGesture(listItem, [Direction.NorthEast]);
    makeMouseGesture(listItem, [Direction.NorthWest]);
    makeMouseGesture(listItem, [Direction.South]);
    makeMouseGesture(listItem, [Direction.SouthEast]);
    makeMouseGesture(listItem, [Direction.SouthWest]);
    makeMouseGesture(listItem, [Direction.North, Direction.East]);
    makeMouseGesture(listItem, [Direction.North, Direction.West]);
    makeMouseGesture(listItem, [Direction.NorthEast, Direction.East]);
    makeMouseGesture(listItem, [Direction.NorthEast, Direction.West]);
    makeMouseGesture(listItem, [Direction.NorthWest, Direction.East]);
    makeMouseGesture(listItem, [Direction.NorthWest, Direction.West]);
    makeMouseGesture(listItem, [Direction.South, Direction.East]);
    makeMouseGesture(listItem, [Direction.South, Direction.West]);
    makeMouseGesture(listItem, [Direction.SouthEast, Direction.East]);
    makeMouseGesture(listItem, [Direction.SouthEast, Direction.West]);
    makeMouseGesture(listItem, [Direction.SouthWest, Direction.East]);
    makeMouseGesture(listItem, [Direction.SouthWest, Direction.West]);
    expect(callbackLeading).toHaveBeenCalledTimes(0);
    expect(callbackTrailing).toHaveBeenCalledTimes(0);
    makeTouchGesture(listItem, [Direction.North]);
    makeTouchGesture(listItem, [Direction.NorthEast]);
    makeTouchGesture(listItem, [Direction.NorthWest]);
    makeTouchGesture(listItem, [Direction.South]);
    makeTouchGesture(listItem, [Direction.SouthEast]);
    makeTouchGesture(listItem, [Direction.SouthWest]);
    makeTouchGesture(listItem, [Direction.North, Direction.East]);
    makeTouchGesture(listItem, [Direction.North, Direction.West]);
    makeTouchGesture(listItem, [Direction.NorthEast, Direction.East]);
    makeTouchGesture(listItem, [Direction.NorthEast, Direction.West]);
    makeTouchGesture(listItem, [Direction.NorthWest, Direction.East]);
    makeTouchGesture(listItem, [Direction.NorthWest, Direction.West]);
    makeTouchGesture(listItem, [Direction.South, Direction.East]);
    makeTouchGesture(listItem, [Direction.South, Direction.West]);
    makeTouchGesture(listItem, [Direction.SouthEast, Direction.East]);
    makeTouchGesture(listItem, [Direction.SouthEast, Direction.West]);
    makeTouchGesture(listItem, [Direction.SouthWest, Direction.East]);
    makeTouchGesture(listItem, [Direction.SouthWest, Direction.West]);
    expect(callbackLeading).toHaveBeenCalledTimes(0);
    expect(callbackTrailing).toHaveBeenCalledTimes(0);
    makeMouseGesture(listItem, [Direction.East]);
    expect(callbackLeading).toHaveBeenCalledTimes(1);
    makeTouchGesture(listItem, [Direction.East]);
    expect(callbackLeading).toHaveBeenCalledTimes(2);
    makeMouseGesture(listItem, [Direction.West]);
    expect(callbackTrailing).toHaveBeenCalledTimes(1);
    makeTouchGesture(listItem, [Direction.West]);
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
    makeMouseGesture(listItem, [Direction.East]);
    expect(callbackLeading).toHaveBeenCalledTimes(0);
    makeMouseGesture(listItem, [Direction.West]);
    expect(callbackTrailing).toHaveBeenCalledTimes(0);
    makeTouchGesture(listItem, [Direction.East]);
    expect(callbackLeading).toHaveBeenCalledTimes(0);
    makeTouchGesture(listItem, [Direction.West]);
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
      Direction.North,
      Direction.East,
      Direction.East,
      Direction.East,
    ]);
    makeMouseGesture(listItem, [
      Direction.South,
      Direction.East,
      Direction.East,
      Direction.East,
    ]);
    makeMouseGesture(listItem, [
      Direction.North,
      Direction.West,
      Direction.West,
      Direction.West,
    ]);
    makeMouseGesture(listItem, [
      Direction.South,
      Direction.West,
      Direction.West,
      Direction.West,
    ]);
    expect(callbackLeading).toHaveBeenCalledTimes(2);
    expect(callbackTrailing).toHaveBeenCalledTimes(2);
    makeTouchGesture(listItem, [
      Direction.North,
      Direction.East,
      Direction.East,
      Direction.East,
    ]);
    makeTouchGesture(listItem, [
      Direction.South,
      Direction.East,
      Direction.East,
      Direction.East,
    ]);
    makeTouchGesture(listItem, [
      Direction.North,
      Direction.West,
      Direction.West,
      Direction.West,
    ]);
    makeTouchGesture(listItem, [
      Direction.South,
      Direction.West,
      Direction.West,
      Direction.West,
    ]);
    expect(callbackLeading).toHaveBeenCalledTimes(4);
    expect(callbackTrailing).toHaveBeenCalledTimes(4);
  });
});
