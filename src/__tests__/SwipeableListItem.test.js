import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';

import SwipeableListItem, { ActionAnimations } from '../SwipeableListItem';
import {
  swipeRightMouse,
  swipeRightTouch,
  swipeLeftMouse,
  swipeLeftTouch,
} from './helpers';

afterEach(cleanup);

describe.skip('SwipeableListItem', () => {
  test('item rendering without any swipe content', () => {
    const { getByText, queryByTestId } = render(
      <SwipeableListItem>
        <span>Item content</span>
      </SwipeableListItem>
    );

    expect(getByText('Item content')).toBeInTheDocument();
    expect(queryByTestId('swipe-left-content')).not.toBeInTheDocument();
    expect(queryByTestId('swipe-right-content')).not.toBeInTheDocument();
  });

  test('item rendering with left swipe content only', () => {
    const { queryByTestId, getByText } = render(
      <SwipeableListItem
        swipeLeft={{
          content: <span>Left swipe content</span>,
          action: jest.fn(),
        }}
      >
        <span>Item content</span>
      </SwipeableListItem>
    );

    expect(getByText('Item content')).toBeInTheDocument();
    expect(queryByTestId('swipe-left-content')).toBeInTheDocument();
    expect(queryByTestId('swipe-right-content')).not.toBeInTheDocument();
    expect(getByText('Left swipe content')).toBeInTheDocument();
  });

  test('item rendering with right swipe content only', () => {
    const { queryByTestId, getByText } = render(
      <SwipeableListItem
        swipeRight={{
          content: <span>Right swipe content</span>,
          action: jest.fn(),
        }}
      >
        <span>Item content</span>
      </SwipeableListItem>
    );

    expect(getByText('Item content')).toBeInTheDocument();
    expect(queryByTestId('swipe-right-content')).toBeInTheDocument();
    expect(queryByTestId('swipe-left-content')).not.toBeInTheDocument();
    expect(getByText('Right swipe content')).toBeInTheDocument();
  });

  test('item rendering with left and right swipe content', () => {
    const { queryByTestId, getByText } = render(
      <SwipeableListItem
        swipeLeft={{
          content: <span>Left swipe content</span>,
          action: jest.fn(),
        }}
        swipeRight={{
          content: <span>Right swipe content</span>,
          action: jest.fn(),
        }}
      >
        <span>Item content</span>
      </SwipeableListItem>
    );

    expect(getByText('Item content')).toBeInTheDocument();
    expect(queryByTestId('swipe-right-content')).toBeInTheDocument();
    expect(queryByTestId('swipe-left-content')).toBeInTheDocument();
    expect(getByText('Right swipe content')).toBeInTheDocument();
    expect(getByText('Left swipe content')).toBeInTheDocument();
  });

  test('left swipe action triggering', () => {
    const callbackLeft = jest.fn();
    const callbackRight = jest.fn();

    const { getByTestId } = render(
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
        <span>Item content</span>
      </SwipeableListItem>
    );

    const contentContainer = getByTestId('content');

    swipeLeftMouse(contentContainer);
    swipeLeftTouch(contentContainer);

    expect(callbackLeft).toHaveBeenCalledTimes(2);
    expect(callbackRight).toHaveBeenCalledTimes(0);
  });

  test('right swipe action triggering', () => {
    const callbackLeft = jest.fn();
    const callbackRight = jest.fn();

    const { getByTestId } = render(
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
        <span>Item content</span>
      </SwipeableListItem>
    );

    const contentContainer = getByTestId('content');

    swipeRightMouse(contentContainer);
    swipeRightTouch(contentContainer);

    expect(callbackLeft).toHaveBeenCalledTimes(0);
    expect(callbackRight).toHaveBeenCalledTimes(2);
  });

  test('swipe actions blocking on click (mouse/touch down/up)', () => {
    const callbackLeft = jest.fn();

    const { getByTestId } = render(
      <SwipeableListItem
        swipeLeft={{
          content: <span>Left swipe content</span>,
          action: callbackLeft,
        }}
      >
        <span>Item content</span>
      </SwipeableListItem>
    );

    const contentContainer = getByTestId('content');

    fireEvent.mouseDown(contentContainer, { clientX: 250, clientY: 20 });
    fireEvent.mouseUp(contentContainer, { clientX: 100, clientY: 20 });
    fireEvent.mouseMove(contentContainer, { clientX: 100, clientY: 20 });
    fireEvent.mouseDown(contentContainer, { clientX: 100, clientY: 20 });
    fireEvent.mouseUp(contentContainer, { clientX: 100, clientY: 20 });

    expect(callbackLeft).toHaveBeenCalledTimes(0);
  });

  test('left swipe action triggering if no right swipe defined', () => {
    const callbackLeft = jest.fn();

    const { getByTestId } = render(
      <SwipeableListItem
        swipeLeft={{
          content: <span>Left swipe content</span>,
          action: callbackLeft,
        }}
      >
        <span>Item content</span>
      </SwipeableListItem>
    );

    const contentContainer = getByTestId('content');

    swipeLeftMouse(contentContainer);
    swipeLeftTouch(contentContainer);
    swipeRightMouse(contentContainer);
    swipeRightTouch(contentContainer);

    expect(callbackLeft).toHaveBeenCalledTimes(2);
  });

  test('right swipe action triggering if no left swipe defined', () => {
    const callbackRight = jest.fn();

    const { getByTestId } = render(
      <SwipeableListItem
        swipeRight={{
          content: <span>Right swipe content</span>,
          action: callbackRight,
        }}
      >
        <span>Item content</span>
      </SwipeableListItem>
    );

    const contentContainer = getByTestId('content');

    swipeLeftMouse(contentContainer);
    swipeLeftTouch(contentContainer);
    swipeRightMouse(contentContainer);
    swipeRightTouch(contentContainer);

    expect(callbackRight).toHaveBeenCalledTimes(2);
  });

  test('swipe actions triggering if block swipe prop is set', () => {
    const callbackLeft = jest.fn();
    const callbackRight = jest.fn();

    const { getByTestId } = render(
      <SwipeableListItem
        blockSwipe
        swipeLeft={{
          content: <span>Left swipe content</span>,
          action: callbackLeft,
        }}
        swipeRight={{
          content: <span>Right swipe content</span>,
          action: callbackRight,
        }}
      >
        <span>Item content</span>
      </SwipeableListItem>
    );

    const contentContainer = getByTestId('content');

    swipeLeftMouse(contentContainer);
    swipeLeftTouch(contentContainer);
    swipeRightMouse(contentContainer);
    swipeRightTouch(contentContainer);

    expect(callbackLeft).toHaveBeenCalledTimes(0);
    expect(callbackRight).toHaveBeenCalledTimes(0);
  });

  test('start and end callbacks not triggered if swipe content not defined', () => {
    const callbackSwipeStart = jest.fn();
    const callbackSwipeEnd = jest.fn();

    const { getByTestId } = render(
      <SwipeableListItem
        onSwipeEnd={callbackSwipeEnd}
        onSwipeStart={callbackSwipeStart}
      >
        <span>Item content</span>
      </SwipeableListItem>
    );

    const contentContainer = getByTestId('content');
    swipeLeftMouse(contentContainer);
    swipeLeftTouch(contentContainer);
    swipeRightMouse(contentContainer);
    swipeRightTouch(contentContainer);

    expect(callbackSwipeStart).toHaveBeenCalledTimes(0);
    expect(callbackSwipeEnd).toHaveBeenCalledTimes(0);
  });

  test('start and end callbacks not triggered if blockSwipe is set', () => {
    const callbackSwipeStart = jest.fn();
    const callbackSwipeEnd = jest.fn();
    const callbackLeft = jest.fn();

    const { getByTestId } = render(
      <SwipeableListItem
        blockSwipe
        swipeLeft={{
          content: <span>Left swipe content</span>,
          action: callbackLeft,
        }}
        onSwipeEnd={callbackSwipeEnd}
        onSwipeStart={callbackSwipeStart}
      >
        <span>Item content</span>
      </SwipeableListItem>
    );

    const contentContainer = getByTestId('content');
    swipeLeftMouse(contentContainer);
    swipeLeftTouch(contentContainer);
    swipeRightMouse(contentContainer);
    swipeRightTouch(contentContainer);

    expect(callbackSwipeStart).toHaveBeenCalledTimes(0);
    expect(callbackSwipeEnd).toHaveBeenCalledTimes(0);
  });

  test('start and end callbacks triggered if swipe content is defined', () => {
    const callbackSwipeStart = jest.fn();
    const callbackSwipeEnd = jest.fn();
    const callbackLeft = jest.fn();
    const callbackRight = jest.fn();

    const { getByTestId } = render(
      <SwipeableListItem
        swipeLeft={{
          content: <span>Left swipe content</span>,
          action: callbackLeft,
        }}
        swipeRight={{
          content: <span>Right swipe content</span>,
          action: callbackRight,
        }}
        onSwipeEnd={callbackSwipeEnd}
        onSwipeStart={callbackSwipeStart}
      >
        <span>Item content</span>
      </SwipeableListItem>
    );

    const contentContainer = getByTestId('content');
    swipeLeftMouse(contentContainer);
    swipeLeftTouch(contentContainer);
    swipeRightMouse(contentContainer);
    swipeRightTouch(contentContainer);

    expect(callbackSwipeStart).toHaveBeenCalledTimes(4);
    expect(callbackSwipeEnd).toHaveBeenCalledTimes(4);
  });

  test('if remove animation is applied', () => {
    const callbackLeft = jest.fn();
    const callbackRight = jest.fn();

    const { getByTestId } = render(
      <SwipeableListItem
        swipeLeft={{
          content: <span>Left swipe content</span>,
          actionAnimation: ActionAnimations.REMOVE,
          action: callbackLeft,
        }}
        swipeRight={{
          content: <span>Right swipe content</span>,
          actionAnimation: ActionAnimations.REMOVE,
          action: callbackRight,
        }}
      >
        <span>Item content</span>
      </SwipeableListItem>
    );

    const contentContainer = getByTestId('content');

    swipeLeftMouse(contentContainer);
    expect(contentContainer).toHaveClass(
      'swipeable-list-item__content--remove'
    );

    swipeLeftTouch(contentContainer);
    expect(contentContainer).toHaveClass(
      'swipeable-list-item__content--remove'
    );

    swipeRightMouse(contentContainer);
    expect(contentContainer).toHaveClass(
      'swipeable-list-item__content--remove'
    );

    swipeRightTouch(contentContainer);
    expect(contentContainer).toHaveClass(
      'swipeable-list-item__content--remove'
    );

    expect(callbackLeft).toBeCalledTimes(2);
    expect(callbackRight).toBeCalledTimes(2);
  });

  test('if return animation is applied', () => {
    const callbackLeft = jest.fn();
    const callbackRight = jest.fn();

    const { getByTestId } = render(
      <SwipeableListItem
        swipeLeft={{
          content: <span>Left swipe content</span>,
          actionAnimation: ActionAnimations.RETURN,
          action: callbackLeft,
        }}
        swipeRight={{
          content: <span>Right swipe content</span>,
          action: callbackRight,
        }}
      >
        <span>Item content</span>
      </SwipeableListItem>
    );

    const contentContainer = getByTestId('content');

    swipeLeftMouse(contentContainer);
    expect(contentContainer).toHaveClass(
      'swipeable-list-item__content--return'
    );

    swipeLeftTouch(contentContainer);
    expect(contentContainer).toHaveClass(
      'swipeable-list-item__content--return'
    );

    swipeRightMouse(contentContainer);
    expect(contentContainer).toHaveClass(
      'swipeable-list-item__content--return'
    );

    swipeRightTouch(contentContainer);
    expect(contentContainer).toHaveClass(
      'swipeable-list-item__content--return'
    );

    expect(callbackLeft).toBeCalledTimes(2);
    expect(callbackRight).toBeCalledTimes(2);
  });

  test('if none animation is applied', () => {
    const callbackLeft = jest.fn();
    const callbackRight = jest.fn();

    const { getByTestId } = render(
      <SwipeableListItem
        swipeLeft={{
          content: <span>Left swipe content</span>,
          actionAnimation: ActionAnimations.NONE,
          action: callbackLeft,
        }}
        swipeRight={{
          content: <span>Right swipe content</span>,
          actionAnimation: ActionAnimations.NONE,
          action: callbackRight,
        }}
      >
        <span>Item content</span>
      </SwipeableListItem>
    );

    const contentContainer = getByTestId('content');

    swipeLeftMouse(contentContainer);
    expect(contentContainer).toHaveClass('swipeable-list-item__content');
    expect(contentContainer).not.toHaveClass(
      'swipeable-list-item__content--return'
    );
    expect(contentContainer).not.toHaveClass(
      'swipeable-list-item__content--remove'
    );

    swipeLeftTouch(contentContainer);
    expect(contentContainer).toHaveClass('swipeable-list-item__content');
    expect(contentContainer).not.toHaveClass(
      'swipeable-list-item__content--return'
    );
    expect(contentContainer).not.toHaveClass(
      'swipeable-list-item__content--remove'
    );

    swipeRightMouse(contentContainer);
    expect(contentContainer).toHaveClass('swipeable-list-item__content');
    expect(contentContainer).not.toHaveClass(
      'swipeable-list-item__content--return'
    );
    expect(contentContainer).not.toHaveClass(
      'swipeable-list-item__content--remove'
    );

    swipeRightTouch(contentContainer);
    expect(contentContainer).toHaveClass('swipeable-list-item__content');
    expect(contentContainer).not.toHaveClass(
      'swipeable-list-item__content--return'
    );
    expect(contentContainer).not.toHaveClass(
      'swipeable-list-item__content--remove'
    );

    expect(callbackLeft).toBeCalledTimes(2);
    expect(callbackRight).toBeCalledTimes(2);
  });
});
