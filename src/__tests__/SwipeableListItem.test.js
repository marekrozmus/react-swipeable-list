import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import {
  LeadingActions,
  SwipeableListItem,
  SwipeAction,
  TrailingActions,
} from '../index';

import {
  swipeRightMouse,
  swipeRightTouch,
  swipeLeftMouse,
  swipeLeftTouch,
} from './helpers';

import {
  beforeEachTest,
  afterEachTest,
  renderAndroidType,
  renderIosOneActionType,
  toThreshold,
  beyondThreshold,
  closeLeadingActions,
  closeTrailingActions,
  toOpenActionsThresold,
  beyondOpenActionsThreshold,
} from './helpers';

beforeEach(() => beforeEachTest());

afterEach(() => afterEachTest());

describe('SwipeableListItem - content', () => {
  test('item rendering without swipe actions', () => {
    const { getByText, queryByTestId } = render(
      <SwipeableListItem>
        <span>Item content</span>
      </SwipeableListItem>
    );

    expect(getByText('Item content')).toBeInTheDocument();
    expect(queryByTestId('leading-actions')).not.toBeInTheDocument();
    expect(queryByTestId('trailing-actions')).not.toBeInTheDocument();
  });

  test('item rendering with leading swipe action', () => {
    const { getByText, queryByTestId } = render(
      <SwipeableListItem
        leadingActions={
          <LeadingActions>
            <SwipeAction onClick={jest.fn()}>Action content</SwipeAction>
          </LeadingActions>
        }
      >
        <span>Item content</span>
      </SwipeableListItem>
    );

    expect(getByText('Item content')).toBeInTheDocument();
    expect(queryByTestId('leading-actions')).toBeInTheDocument();
    expect(queryByTestId('trailing-actions')).not.toBeInTheDocument();
    expect(getByText('Action content')).toBeInTheDocument();
  });

  test('item rendering with trailing swipe action', () => {
    const { getByText, queryByTestId } = render(
      <SwipeableListItem
        trailingActions={
          <TrailingActions>
            <SwipeAction onClick={jest.fn()}>Action content</SwipeAction>
          </TrailingActions>
        }
      >
        <span>Item content</span>
      </SwipeableListItem>
    );

    expect(getByText('Item content')).toBeInTheDocument();
    expect(queryByTestId('leading-actions')).not.toBeInTheDocument();
    expect(queryByTestId('trailing-actions')).toBeInTheDocument();
    expect(getByText('Action content')).toBeInTheDocument();
  });

  test('item rendering with leading and trailing swipe action', () => {
    const { getByText, queryByTestId } = render(
      <SwipeableListItem
        leadingActions={
          <LeadingActions>
            <SwipeAction onClick={jest.fn()}>
              Leading action content
            </SwipeAction>
          </LeadingActions>
        }
        trailingActions={
          <TrailingActions>
            <SwipeAction onClick={jest.fn()}>
              Trailing action content
            </SwipeAction>
          </TrailingActions>
        }
      >
        <span>Item content</span>
      </SwipeableListItem>
    );

    expect(getByText('Item content')).toBeInTheDocument();
    expect(queryByTestId('leading-actions')).toBeInTheDocument();
    expect(queryByTestId('trailing-actions')).toBeInTheDocument();
    expect(getByText('Leading action content')).toBeInTheDocument();
    expect(getByText('Trailing action content')).toBeInTheDocument();
  });
});

describe('SwipeableListItem (type ANDROID) - behaviour ', () => {
  test('leading swipe action triggering', () => {
    const leadingActionCallback = jest.fn();
    const trailingActionCallback = jest.fn();

    const { getByTestId } = renderAndroidType({
      leadingActionCallback,
      trailingActionCallback,
    });

    const listItem = getByTestId('content');

    swipeRightMouse(listItem, toThreshold());
    swipeRightTouch(listItem, toThreshold());
    expect(leadingActionCallback).toHaveBeenCalledTimes(0);
    expect(trailingActionCallback).toHaveBeenCalledTimes(0);

    swipeRightMouse(listItem, beyondThreshold());
    swipeRightTouch(listItem, beyondThreshold());

    expect(leadingActionCallback).toHaveBeenCalledTimes(2);
    expect(trailingActionCallback).toHaveBeenCalledTimes(0);
  });

  test('trailing swipe action triggering', () => {
    const leadingActionCallback = jest.fn();
    const trailingActionCallback = jest.fn();

    const { getByTestId } = renderAndroidType({
      leadingActionCallback,
      trailingActionCallback,
    });

    const listItem = getByTestId('content');

    swipeLeftMouse(listItem, toThreshold());
    swipeLeftTouch(listItem, toThreshold());
    expect(leadingActionCallback).toHaveBeenCalledTimes(0);
    expect(trailingActionCallback).toHaveBeenCalledTimes(0);

    swipeLeftMouse(listItem, beyondThreshold());
    swipeLeftTouch(listItem, beyondThreshold());

    expect(leadingActionCallback).toHaveBeenCalledTimes(0);
    expect(trailingActionCallback).toHaveBeenCalledTimes(2);
  });

  test('swipe actions triggering if block swipe prop is set to true', () => {
    const leadingActionCallback = jest.fn();
    const trailingActionCallback = jest.fn();

    const { getByTestId } = renderAndroidType({
      blockSwipe: true,
      leadingActionCallback,
      trailingActionCallback,
    });

    const listItem = getByTestId('content');

    swipeLeftMouse(listItem, beyondThreshold());
    swipeLeftTouch(listItem, beyondThreshold());
    swipeRightMouse(listItem, beyondThreshold());
    swipeRightTouch(listItem, beyondThreshold());

    expect(leadingActionCallback).toHaveBeenCalledTimes(0);
    expect(trailingActionCallback).toHaveBeenCalledTimes(0);
  });

  test('start and end swipe callbacks triggered when swiping', () => {
    const onSwipeStartCallback = jest.fn();
    const onSwipeEndCallback = jest.fn();

    const leadingActionCallback = jest.fn();
    const trailingActionCallback = jest.fn();

    const { getByTestId } = renderAndroidType({
      leadingActionCallback,
      trailingActionCallback,
      onSwipeStartCallback,
      onSwipeEndCallback,
    });

    const listItem = getByTestId('content');

    swipeLeftMouse(listItem, toThreshold());
    swipeLeftTouch(listItem, toThreshold());
    swipeRightMouse(listItem, toThreshold());
    swipeRightTouch(listItem, toThreshold());
    swipeLeftMouse(listItem, beyondThreshold());
    swipeLeftTouch(listItem, beyondThreshold());
    swipeRightMouse(listItem, beyondThreshold());
    swipeRightTouch(listItem, beyondThreshold());

    expect(onSwipeStartCallback).toHaveBeenCalledTimes(8);
    expect(onSwipeEndCallback).toHaveBeenCalledTimes(8);
  });

  test('start and end swipe callbacks not triggered if block swipe prop is set to true', () => {
    const onSwipeStartCallback = jest.fn();
    const onSwipeEndCallback = jest.fn();

    const leadingActionCallback = jest.fn();
    const trailingActionCallback = jest.fn();

    const { getByTestId } = renderAndroidType({
      blockSwipe: true,
      leadingActionCallback,
      trailingActionCallback,
      onSwipeStartCallback,
      onSwipeEndCallback,
    });

    const listItem = getByTestId('content');

    swipeLeftMouse(listItem, beyondThreshold());
    swipeLeftTouch(listItem, beyondThreshold());
    swipeRightMouse(listItem, beyondThreshold());
    swipeRightTouch(listItem, beyondThreshold());

    expect(onSwipeStartCallback).toHaveBeenCalledTimes(0);
    expect(onSwipeEndCallback).toHaveBeenCalledTimes(0);
  });

  test('if swipeStartThreshold is working', () => {
    const onSwipeStartCallback = jest.fn();
    const leadingActionCallback = jest.fn();
    const trailingActionCallback = jest.fn();

    const swipeStartThreshold = 50;

    const { getByTestId } = renderAndroidType({
      leadingActionCallback,
      trailingActionCallback,
      swipeStartThreshold,
      onSwipeStartCallback,
    });

    const listItem = getByTestId('content');

    swipeLeftMouse(listItem, swipeStartThreshold);
    swipeLeftTouch(listItem, swipeStartThreshold);
    swipeRightMouse(listItem, swipeStartThreshold);
    swipeRightTouch(listItem, swipeStartThreshold);

    expect(onSwipeStartCallback).toHaveBeenCalledTimes(0);

    swipeLeftMouse(listItem, swipeStartThreshold + 1);
    swipeLeftTouch(listItem, swipeStartThreshold + 1);
    swipeRightMouse(listItem, swipeStartThreshold + 1);
    swipeRightTouch(listItem, swipeStartThreshold + 1);

    expect(onSwipeStartCallback).toHaveBeenCalledTimes(4);
  });

  test('if onSwipeProgress is working', () => {
    const onSwipeProgressCallback = jest.fn();
    const leadingActionCallback = jest.fn();
    const trailingActionCallback = jest.fn();

    const { getByTestId } = renderAndroidType({
      leadingActionCallback,
      trailingActionCallback,
      onSwipeProgressCallback,
    });

    const listItem = getByTestId('content');

    swipeLeftMouse(listItem, toThreshold());
    swipeLeftTouch(listItem, toThreshold());
    swipeRightMouse(listItem, toThreshold());
    swipeRightTouch(listItem, toThreshold());
    swipeLeftMouse(listItem, beyondThreshold());
    swipeLeftTouch(listItem, beyondThreshold());
    swipeRightMouse(listItem, beyondThreshold());
    swipeRightTouch(listItem, beyondThreshold());

    expect(onSwipeProgressCallback).toHaveBeenCalledTimes(8);
  });
});

describe('SwipeableListItem (type IOS) - behaviour', () => {
  test('leading actions opening with mouse', () => {
    const { getByTestId } = renderIosOneActionType();

    const listItem = getByTestId('content');
    const leadingActions = getByTestId('leading-actions');
    const trailingActions = getByTestId('trailing-actions');

    swipeRightMouse(listItem, toOpenActionsThresold());
    swipeRightMouse(listItem, toOpenActionsThresold());
    expect(leadingActions).not.toHaveClass('test-actions-opened');
    expect(trailingActions).not.toHaveClass('test-actions-opened');

    swipeRightMouse(listItem, beyondOpenActionsThreshold());
    expect(leadingActions).toHaveClass('test-actions-opened');
    expect(trailingActions).not.toHaveClass('test-actions-opened');

    swipeRightMouse(listItem, beyondOpenActionsThreshold());
    expect(leadingActions).toHaveClass('test-actions-opened');
    expect(trailingActions).not.toHaveClass('test-actions-opened');
  });

  test('leading actions opening with touch', () => {
    const { getByTestId } = renderIosOneActionType();

    const listItem = getByTestId('content');
    const leadingActions = getByTestId('leading-actions');
    const trailingActions = getByTestId('trailing-actions');

    swipeRightTouch(listItem, toOpenActionsThresold());
    swipeRightTouch(listItem, toOpenActionsThresold());
    expect(leadingActions).not.toHaveClass('test-actions-opened');
    expect(trailingActions).not.toHaveClass('test-actions-opened');

    swipeRightTouch(listItem, beyondOpenActionsThreshold());
    expect(leadingActions).toHaveClass('test-actions-opened');
    expect(trailingActions).not.toHaveClass('test-actions-opened');

    swipeRightTouch(listItem, beyondOpenActionsThreshold());
    expect(leadingActions).toHaveClass('test-actions-opened');
    expect(trailingActions).not.toHaveClass('test-actions-opened');
  });

  test('trailing actions opening with mouse', () => {
    const { getByTestId } = renderIosOneActionType();

    const listItem = getByTestId('content');
    const leadingActions = getByTestId('leading-actions');
    const trailingActions = getByTestId('trailing-actions');

    swipeLeftMouse(listItem, toOpenActionsThresold());
    swipeLeftMouse(listItem, toOpenActionsThresold());
    expect(leadingActions).not.toHaveClass('test-actions-opened');
    expect(trailingActions).not.toHaveClass('test-actions-opened');

    swipeLeftMouse(listItem, beyondOpenActionsThreshold());
    expect(leadingActions).not.toHaveClass('test-actions-opened');
    expect(trailingActions).toHaveClass('test-actions-opened');

    swipeLeftMouse(listItem, beyondOpenActionsThreshold());
    expect(leadingActions).not.toHaveClass('test-actions-opened');
    expect(trailingActions).toHaveClass('test-actions-opened');
  });

  test('trailing actions opening with touch', () => {
    const { getByTestId } = renderIosOneActionType();

    const listItem = getByTestId('content');
    const leadingActions = getByTestId('leading-actions');
    const trailingActions = getByTestId('trailing-actions');

    swipeLeftTouch(listItem, toOpenActionsThresold());
    swipeLeftTouch(listItem, toOpenActionsThresold());
    expect(leadingActions).not.toHaveClass('test-actions-opened');
    expect(trailingActions).not.toHaveClass('test-actions-opened');

    swipeLeftTouch(listItem, beyondOpenActionsThreshold());
    expect(leadingActions).not.toHaveClass('test-actions-opened');
    expect(trailingActions).toHaveClass('test-actions-opened');

    swipeLeftTouch(listItem, beyondOpenActionsThreshold());
    expect(leadingActions).not.toHaveClass('test-actions-opened');
    expect(trailingActions).toHaveClass('test-actions-opened');
  });

  test('leading swipe action triggering with full swipe', () => {
    const leadingActionCallback = jest.fn();
    const trailingActionCallback = jest.fn();

    const { getByTestId } = renderIosOneActionType({
      leadingActionCallback,
      trailingActionCallback,
    });

    const listItem = getByTestId('content');
    const leadingActions = getByTestId('leading-actions');

    swipeRightMouse(listItem, toThreshold());
    closeLeadingActions(listItem, leadingActions);
    swipeRightTouch(listItem, toThreshold());
    expect(leadingActionCallback).toHaveBeenCalledTimes(0);
    expect(trailingActionCallback).toHaveBeenCalledTimes(0);

    swipeRightMouse(listItem, beyondThreshold());
    closeLeadingActions(listItem, leadingActions);
    swipeRightTouch(listItem, beyondThreshold());
    expect(leadingActionCallback).toHaveBeenCalledTimes(2);
    expect(trailingActionCallback).toHaveBeenCalledTimes(0);
  });

  test('trailing swipe action triggering with full swipe', () => {
    const leadingActionCallback = jest.fn();
    const trailingActionCallback = jest.fn();

    const { getByTestId } = renderIosOneActionType({
      leadingActionCallback,
      trailingActionCallback,
    });

    const listItem = getByTestId('content');
    const trailingActions = getByTestId('trailing-actions');

    swipeLeftMouse(listItem, toThreshold());
    closeTrailingActions(listItem, trailingActions);
    swipeLeftTouch(listItem, toThreshold());
    expect(leadingActionCallback).toHaveBeenCalledTimes(0);
    expect(trailingActionCallback).toHaveBeenCalledTimes(0);

    swipeLeftMouse(listItem, beyondThreshold());
    closeTrailingActions(listItem, trailingActions);
    swipeLeftTouch(listItem, beyondThreshold());
    expect(leadingActionCallback).toHaveBeenCalledTimes(0);
    expect(trailingActionCallback).toHaveBeenCalledTimes(2);
  });

  test('leading swipe action triggering with opening actions and click', () => {
    const leadingActionCallback = jest.fn();
    const trailingActionCallback = jest.fn();

    const { getByTestId } = renderIosOneActionType({
      fullSwipe: false,
      leadingActionCallback,
      trailingActionCallback,
    });

    const listItem = getByTestId('content');

    const leadingActions = getByTestId('leading-actions');

    const {
      children: [swipeAction],
    } = leadingActions;

    swipeRightMouse(listItem, beyondOpenActionsThreshold());

    expect(leadingActions).toHaveClass('test-actions-opened');

    fireEvent.click(swipeAction);

    expect(leadingActionCallback).toHaveBeenCalledTimes(1);
  });

  test('leading swipe action triggering with opening actions and click', () => {
    const leadingActionCallback = jest.fn();

    const { getByTestId } = renderIosOneActionType({
      fullSwipe: false,
      leadingActionCallback,
    });

    const listItem = getByTestId('content');

    const leadingActions = getByTestId('leading-actions');

    const {
      children: [swipeAction],
    } = leadingActions;

    swipeRightMouse(listItem, beyondOpenActionsThreshold());

    expect(leadingActions).toHaveClass('test-actions-opened');

    fireEvent.click(swipeAction);

    // TODO: this should be working like below to simulate real client cliks
    // fireEvent.mouseDown(leadingActions, { clientX: 20, clientY: 20 });
    // fireEvent.mouseUp(leadingActions, { clientX: 20, clientY: 20 });

    expect(leadingActionCallback).toHaveBeenCalledTimes(1);
    expect(listItem).toHaveClass('swipeable-list-item__content--return');
  });

  test('trailing swipe action triggering with opening actions and click', () => {
    const trailingActionCallback = jest.fn();

    const { getByTestId } = renderIosOneActionType({
      fullSwipe: false,
      trailingActionCallback,
    });

    const listItem = getByTestId('content');

    const trailingActions = getByTestId('trailing-actions');

    const {
      children: [swipeAction],
    } = trailingActions;

    swipeLeftMouse(listItem, beyondOpenActionsThreshold());

    expect(trailingActions).toHaveClass('test-actions-opened');

    fireEvent.click(swipeAction);

    expect(trailingActionCallback).toHaveBeenCalledTimes(1);
    expect(listItem).toHaveClass('swipeable-list-item__content--return');
  });
});

describe.skip('SwipeableListItem', () => {
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

  // test('if remove animation is applied', () => {
  //   const callbackLeft = jest.fn();
  //   const callbackRight = jest.fn();

  //   const { getByTestId } = render(
  //     <SwipeableListItem
  //       swipeLeft={{
  //         content: <span>Left swipe content</span>,
  //         actionAnimation: ActionAnimations.REMOVE,
  //         action: callbackLeft,
  //       }}
  //       swipeRight={{
  //         content: <span>Right swipe content</span>,
  //         actionAnimation: ActionAnimations.REMOVE,
  //         action: callbackRight,
  //       }}
  //     >
  //       <span>Item content</span>
  //     </SwipeableListItem>
  //   );

  //   const contentContainer = getByTestId('content');

  //   swipeLeftMouse(contentContainer);
  //   expect(contentContainer).toHaveClass(
  //     'swipeable-list-item__content--remove'
  //   );

  //   swipeLeftTouch(contentContainer);
  //   expect(contentContainer).toHaveClass(
  //     'swipeable-list-item__content--remove'
  //   );

  //   swipeRightMouse(contentContainer);
  //   expect(contentContainer).toHaveClass(
  //     'swipeable-list-item__content--remove'
  //   );

  //   swipeRightTouch(contentContainer);
  //   expect(contentContainer).toHaveClass(
  //     'swipeable-list-item__content--remove'
  //   );

  //   expect(callbackLeft).toBeCalledTimes(2);
  //   expect(callbackRight).toBeCalledTimes(2);
  // });

  // test('if return animation is applied', () => {
  //   const callbackLeft = jest.fn();
  //   const callbackRight = jest.fn();

  //   const { getByTestId } = render(
  //     <SwipeableListItem
  //       swipeLeft={{
  //         content: <span>Left swipe content</span>,
  //         actionAnimation: ActionAnimations.RETURN,
  //         action: callbackLeft,
  //       }}
  //       swipeRight={{
  //         content: <span>Right swipe content</span>,
  //         action: callbackRight,
  //       }}
  //     >
  //       <span>Item content</span>
  //     </SwipeableListItem>
  //   );

  //   const contentContainer = getByTestId('content');

  //   swipeLeftMouse(contentContainer);
  //   expect(contentContainer).toHaveClass(
  //     'swipeable-list-item__content--return'
  //   );

  //   swipeLeftTouch(contentContainer);
  //   expect(contentContainer).toHaveClass(
  //     'swipeable-list-item__content--return'
  //   );

  //   swipeRightMouse(contentContainer);
  //   expect(contentContainer).toHaveClass(
  //     'swipeable-list-item__content--return'
  //   );

  //   swipeRightTouch(contentContainer);
  //   expect(contentContainer).toHaveClass(
  //     'swipeable-list-item__content--return'
  //   );

  //   expect(callbackLeft).toBeCalledTimes(2);
  //   expect(callbackRight).toBeCalledTimes(2);
  // });

  // test('if none animation is applied', () => {
  //   const callbackLeft = jest.fn();
  //   const callbackRight = jest.fn();

  //   const { getByTestId } = render(
  //     <SwipeableListItem
  //       swipeLeft={{
  //         content: <span>Left swipe content</span>,
  //         actionAnimation: ActionAnimations.NONE,
  //         action: callbackLeft,
  //       }}
  //       swipeRight={{
  //         content: <span>Right swipe content</span>,
  //         actionAnimation: ActionAnimations.NONE,
  //         action: callbackRight,
  //       }}
  //     >
  //       <span>Item content</span>
  //     </SwipeableListItem>
  //   );

  //   const contentContainer = getByTestId('content');

  //   swipeLeftMouse(contentContainer);
  //   expect(contentContainer).toHaveClass('swipeable-list-item__content');
  //   expect(contentContainer).not.toHaveClass(
  //     'swipeable-list-item__content--return'
  //   );
  //   expect(contentContainer).not.toHaveClass(
  //     'swipeable-list-item__content--remove'
  //   );

  //   swipeLeftTouch(contentContainer);
  //   expect(contentContainer).toHaveClass('swipeable-list-item__content');
  //   expect(contentContainer).not.toHaveClass(
  //     'swipeable-list-item__content--return'
  //   );
  //   expect(contentContainer).not.toHaveClass(
  //     'swipeable-list-item__content--remove'
  //   );

  //   swipeRightMouse(contentContainer);
  //   expect(contentContainer).toHaveClass('swipeable-list-item__content');
  //   expect(contentContainer).not.toHaveClass(
  //     'swipeable-list-item__content--return'
  //   );
  //   expect(contentContainer).not.toHaveClass(
  //     'swipeable-list-item__content--remove'
  //   );

  //   swipeRightTouch(contentContainer);
  //   expect(contentContainer).toHaveClass('swipeable-list-item__content');
  //   expect(contentContainer).not.toHaveClass(
  //     'swipeable-list-item__content--return'
  //   );
  //   expect(contentContainer).not.toHaveClass(
  //     'swipeable-list-item__content--remove'
  //   );

  //   expect(callbackLeft).toBeCalledTimes(2);
  //   expect(callbackRight).toBeCalledTimes(2);
  // });
});
