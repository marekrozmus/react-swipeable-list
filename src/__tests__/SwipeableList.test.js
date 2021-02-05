import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render, cleanup } from '@testing-library/react';

import SwipeableList from '../SwipeableList';
import SwipeableListItem from '../SwipeableListItem';
import {
  DELTA,
  Direction,
  makeMouseGesture,
  makeTouchGesture,
} from './helpers';

afterEach(cleanup);

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

test('list rendering with items when child as function', () => {
  const { container, getByText } = render(
    <SwipeableList>
      {props => (
        <>
          <SwipeableListItem {...props}>
            <span>Item content 1</span>
          </SwipeableListItem>
          <SwipeableListItem {...props}>
            <span>Item content 2</span>
          </SwipeableListItem>
        </>
      )}
    </SwipeableList>
  );

  expect(getByText('Item content 1')).toBeInTheDocument();
  expect(getByText('Item content 2')).toBeInTheDocument();
  expect(container.firstChild).not.toHaveClass('swipeable-list');
});

test('passing className to child function', () => {
  const { container, getByTestId } = render(
    <SwipeableList>
      {({ className }) => (
        <div>
          <div className={className} data-testid="tested-div" />
        </div>
      )}
    </SwipeableList>
  );

  expect(container.firstChild).not.toHaveClass('swipeable-list');
  expect(getByTestId('tested-div')).toHaveClass('swipeable-list');
});

test('blocking swipe on scroll', () => {
  const callbackLeft = jest.fn();
  const callbackRight = jest.fn();

  const { queryAllByTestId } = render(
    <SwipeableList>
      <SwipeableListItem
        swipeLeft={{
          content: <span>Left swipe content</span>,
          action: callbackLeft,
        }}
        swipeRight={{
          content: <span>Right swipe content</span>,
          action: callbackRight,
        }}
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
  expect(callbackLeft).toHaveBeenCalledTimes(0);
  expect(callbackRight).toHaveBeenCalledTimes(0);

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
  expect(callbackLeft).toHaveBeenCalledTimes(0);
  expect(callbackRight).toHaveBeenCalledTimes(0);

  makeMouseGesture(listItem, [Direction.East]);
  expect(callbackRight).toHaveBeenCalledTimes(1);

  makeTouchGesture(listItem, [Direction.East]);
  expect(callbackRight).toHaveBeenCalledTimes(2);

  makeMouseGesture(listItem, [Direction.West]);
  expect(callbackLeft).toHaveBeenCalledTimes(1);

  makeTouchGesture(listItem, [Direction.West]);
  expect(callbackLeft).toHaveBeenCalledTimes(2);
});

test('swipe start threshold', () => {
  const callbackLeft = jest.fn();
  const callbackRight = jest.fn();

  const { queryAllByTestId } = render(
    <SwipeableList swipeStartThreshold={DELTA + 1}>
      <SwipeableListItem
        swipeLeft={{
          content: <span>Left swipe content</span>,
          action: callbackLeft,
        }}
        swipeRight={{
          content: <span>Right swipe content</span>,
          action: callbackRight,
        }}
      >
        <span>Item content 1</span>
      </SwipeableListItem>
    </SwipeableList>
  );

  const listItem = queryAllByTestId('content')[0];

  makeMouseGesture(listItem, [Direction.East]);
  expect(callbackRight).toHaveBeenCalledTimes(0);

  makeMouseGesture(listItem, [Direction.West]);
  expect(callbackLeft).toHaveBeenCalledTimes(0);

  makeTouchGesture(listItem, [Direction.East]);
  expect(callbackRight).toHaveBeenCalledTimes(0);

  makeTouchGesture(listItem, [Direction.West]);
  expect(callbackLeft).toHaveBeenCalledTimes(0);
});

test('blocking scroll on swipe', () => {
  const callbackLeft = jest.fn();
  const callbackRight = jest.fn();

  const { queryAllByTestId } = render(
    <SwipeableList scrollStartThreshold={DELTA + 1}>
      <SwipeableListItem
        swipeLeft={{
          content: <span>Left swipe content</span>,
          action: callbackLeft,
        }}
        swipeRight={{
          content: <span>Right swipe content</span>,
          action: callbackRight,
        }}
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

  expect(callbackLeft).toHaveBeenCalledTimes(2);
  expect(callbackRight).toHaveBeenCalledTimes(2);

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

  expect(callbackLeft).toHaveBeenCalledTimes(4);
  expect(callbackRight).toHaveBeenCalledTimes(4);
});
