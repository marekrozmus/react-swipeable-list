import 'regenerator-runtime/runtime';
import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';

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
  toOpenActionsThreshold,
  beyondOpenActionsThreshold,
  renderIosTwoActionsType,
} from './helpers';

beforeEach(() => beforeEachTest());

afterEach(() => afterEachTest());

describe('SwipeableListItem - content', () => {
  test('item rendering without swipe actions', () => {
    render(
      <SwipeableListItem>
        <span>Item content</span>
      </SwipeableListItem>
    );

    expect(screen.getByText('Item content')).toBeInTheDocument();
    expect(screen.queryByTestId('leading-actions')).not.toBeInTheDocument();
    expect(screen.queryByTestId('trailing-actions')).not.toBeInTheDocument();
  });

  test('item rendering with leading swipe action', () => {
    render(
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

    expect(screen.getByText('Item content')).toBeInTheDocument();
    expect(screen.getByTestId('leading-actions')).toBeInTheDocument();
    expect(screen.queryByTestId('trailing-actions')).not.toBeInTheDocument();
    expect(screen.getByText('Action content')).toBeInTheDocument();
  });

  test('item rendering with trailing swipe action', () => {
    render(
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

    expect(screen.getByText('Item content')).toBeInTheDocument();
    expect(screen.queryByTestId('leading-actions')).not.toBeInTheDocument();
    expect(screen.getByTestId('trailing-actions')).toBeInTheDocument();
    expect(screen.getByText('Action content')).toBeInTheDocument();
  });

  test('item rendering with leading and trailing swipe action', () => {
    render(
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

    expect(screen.getByText('Item content')).toBeInTheDocument();
    expect(screen.getByTestId('leading-actions')).toBeInTheDocument();
    expect(screen.getByTestId('trailing-actions')).toBeInTheDocument();
    expect(screen.getByText('Leading action content')).toBeInTheDocument();
    expect(screen.getByText('Trailing action content')).toBeInTheDocument();
  });
});

describe('SwipeableListItem (type ANDROID) - behavior ', () => {
  test('leading swipe action triggering', () => {
    const leadingActionCallback = jest.fn();
    const trailingActionCallback = jest.fn();

    renderAndroidType({
      leadingActionCallback,
      trailingActionCallback,
    });

    const listItem = screen.getByTestId('content');

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

    renderAndroidType({
      leadingActionCallback,
      trailingActionCallback,
    });

    const listItem = screen.getByTestId('content');

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

    renderAndroidType({
      blockSwipe: true,
      leadingActionCallback,
      trailingActionCallback,
    });

    const listItem = screen.getByTestId('content');

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

    renderAndroidType({
      leadingActionCallback,
      trailingActionCallback,
      onSwipeStartCallback,
      onSwipeEndCallback,
    });

    const listItem = screen.getByTestId('content');

    swipeLeftMouse(listItem, toThreshold());
    swipeLeftTouch(listItem, toThreshold());

    expect(onSwipeStartCallback).toHaveBeenLastCalledWith("left");
    expect(onSwipeEndCallback).toHaveBeenLastCalledWith("left");

    swipeRightMouse(listItem, toThreshold());
    swipeRightTouch(listItem, toThreshold());
    
    expect(onSwipeStartCallback).toHaveBeenLastCalledWith("right");
    expect(onSwipeEndCallback).toHaveBeenLastCalledWith("right");

    swipeLeftMouse(listItem, beyondThreshold());
    swipeLeftTouch(listItem, beyondThreshold());
    
    expect(onSwipeStartCallback).toHaveBeenLastCalledWith("left");
    expect(onSwipeEndCallback).toHaveBeenLastCalledWith("left");

    swipeRightMouse(listItem, beyondThreshold());
    swipeRightTouch(listItem, beyondThreshold());

    expect(onSwipeStartCallback).toHaveBeenLastCalledWith("right");
    expect(onSwipeEndCallback).toHaveBeenLastCalledWith("right");

    expect(onSwipeStartCallback).toHaveBeenCalledTimes(8);
    expect(onSwipeEndCallback).toHaveBeenCalledTimes(8);
  });

  test('start and end swipe callbacks not triggered if block swipe prop is set to true', () => {
    const onSwipeStartCallback = jest.fn();
    const onSwipeEndCallback = jest.fn();

    const leadingActionCallback = jest.fn();
    const trailingActionCallback = jest.fn();

    renderAndroidType({
      blockSwipe: true,
      leadingActionCallback,
      trailingActionCallback,
      onSwipeStartCallback,
      onSwipeEndCallback,
    });

    const listItem = screen.getByTestId('content');

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

    renderAndroidType({
      leadingActionCallback,
      trailingActionCallback,
      swipeStartThreshold,
      onSwipeStartCallback,
    });

    const listItem = screen.getByTestId('content');

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

    renderAndroidType({
      leadingActionCallback,
      trailingActionCallback,
      onSwipeProgressCallback,
    });

    const listItem = screen.getByTestId('content');

    swipeLeftMouse(listItem, toThreshold());
    swipeLeftTouch(listItem, toThreshold());

    expect(onSwipeProgressCallback).toHaveBeenLastCalledWith(expect.anything(), "left");

    swipeRightMouse(listItem, toThreshold());
    swipeRightTouch(listItem, toThreshold());

    expect(onSwipeProgressCallback).toHaveBeenLastCalledWith(expect.anything(), "right");
    
    swipeLeftMouse(listItem, beyondThreshold());
    swipeLeftTouch(listItem, beyondThreshold());

    expect(onSwipeProgressCallback).toHaveBeenLastCalledWith(expect.anything(), "left");
    
    swipeRightMouse(listItem, beyondThreshold());
    swipeRightTouch(listItem, beyondThreshold());

    expect(onSwipeProgressCallback).toHaveBeenLastCalledWith(expect.anything(), "right");

    expect(onSwipeProgressCallback).toHaveBeenCalledTimes(8);
  });

  test('triggering destructive full swipe action after specified time', () => {
    const leadingActionCallback = jest.fn();
    const trailingActionCallback = jest.fn();

    renderAndroidType({
      leadingActionCallback,
      trailingActionCallback,
      trailingDestructive: true,
      destructiveCallbackDelay: 1000,
    });

    const listItem = screen.getByTestId('content');

    swipeLeftMouse(listItem, toThreshold());
    swipeLeftTouch(listItem, toThreshold());
    expect(leadingActionCallback).toHaveBeenCalledTimes(0);
    expect(trailingActionCallback).toHaveBeenCalledTimes(0);

    swipeLeftMouse(listItem, beyondThreshold());
    swipeLeftTouch(listItem, beyondThreshold());

    setTimeout(() => {
      expect(leadingActionCallback).toHaveBeenCalledTimes(0);
      expect(trailingActionCallback).toHaveBeenCalledTimes(0);
    }, 500);

    setTimeout(() => {
      expect(leadingActionCallback).toHaveBeenCalledTimes(0);
      expect(trailingActionCallback).toHaveBeenCalledTimes(2);
    }, 1000);
  });

  test('only one return animation should run', () => {
    const leadingActionCallback = jest.fn();
    const trailingActionCallback = jest.fn();

    renderAndroidType({
      leadingActionCallback,
      trailingActionCallback,
    });

    const listItem = screen.getByTestId('content');
    const leadingActions = screen.getByTestId('leading-actions');
    const trailingActions = screen.getByTestId('trailing-actions');

    swipeLeftMouse(listItem, toThreshold());
    swipeLeftTouch(listItem, toThreshold());
    swipeLeftMouse(listItem, beyondThreshold());
    swipeLeftTouch(listItem, beyondThreshold());

    expect(leadingActions).not.toHaveClass(
      'swipeable-list-item__leading-actions--return'
    );
    expect(trailingActions).toHaveClass(
      'swipeable-list-item__trailing-actions--return'
    );

    swipeRightMouse(listItem, toThreshold());
    swipeRightTouch(listItem, toThreshold());
    swipeRightMouse(listItem, beyondThreshold());
    swipeRightTouch(listItem, beyondThreshold());

    expect(leadingActions).toHaveClass(
      'swipeable-list-item__leading-actions--return'
    );
    expect(trailingActions).not.toHaveClass(
      'swipeable-list-item__trailing-actions--return'
    );
  });

  it('should trigger onClick action if defined', () => {
    const leadingActionCallback = jest.fn();
    const trailingActionCallback = jest.fn();
    const onClickCallback = jest.fn();

    renderAndroidType({
      leadingActionCallback,
      trailingActionCallback,
      onClick: onClickCallback,
    });

    const listItem = screen.getByTestId('content');
    fireEvent.click(listItem);

    expect(onClickCallback).toHaveBeenCalledTimes(1);
  });
});

describe('SwipeableListItem (type IOS) - behavior', () => {
  test('leading actions opening with mouse', () => {
    renderIosOneActionType();

    const listItem = screen.getByTestId('content');
    const leadingActions = screen.getByTestId('leading-actions');
    const trailingActions = screen.getByTestId('trailing-actions');

    swipeRightMouse(listItem, toOpenActionsThreshold());
    swipeRightMouse(listItem, toOpenActionsThreshold());
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
    renderIosOneActionType();

    const listItem = screen.getByTestId('content');
    const leadingActions = screen.getByTestId('leading-actions');
    const trailingActions = screen.getByTestId('trailing-actions');

    swipeRightTouch(listItem, toOpenActionsThreshold());
    swipeRightTouch(listItem, toOpenActionsThreshold());

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
    renderIosOneActionType();

    const listItem = screen.getByTestId('content');
    const leadingActions = screen.getByTestId('leading-actions');
    const trailingActions = screen.getByTestId('trailing-actions');

    swipeLeftMouse(listItem, toOpenActionsThreshold());
    swipeLeftMouse(listItem, toOpenActionsThreshold());
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
    renderIosOneActionType();

    const listItem = screen.getByTestId('content');
    const leadingActions = screen.getByTestId('leading-actions');
    const trailingActions = screen.getByTestId('trailing-actions');

    swipeLeftTouch(listItem, toOpenActionsThreshold());
    swipeLeftTouch(listItem, toOpenActionsThreshold());

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

    renderIosOneActionType({
      leadingActionCallback,
      trailingActionCallback,
    });

    const listItem = screen.getByTestId('content');
    const leadingActions = screen.getByTestId('leading-actions');

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

    renderIosOneActionType({
      leadingActionCallback,
      trailingActionCallback,
    });

    const listItem = screen.getByTestId('content');
    const trailingActions = screen.getByTestId('trailing-actions');

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

    renderIosOneActionType({
      fullSwipe: false,
      leadingActionCallback,
      trailingActionCallback,
    });

    const listItem = screen.getByTestId('content');
    const leadingActions = screen.getByTestId('leading-actions');

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

    renderIosOneActionType({
      fullSwipe: false,
      leadingActionCallback,
    });

    const listItem = screen.getByTestId('content');
    const leadingActions = screen.getByTestId('leading-actions');

    const {
      children: [swipeAction],
    } = leadingActions;

    swipeRightMouse(listItem, beyondOpenActionsThreshold());

    expect(leadingActions).toHaveClass('test-actions-opened');

    fireEvent.click(swipeAction);

    // TODO: this should be working like below to simulate real client clicks
    // fireEvent.mouseDown(leadingActions, { clientX: 20, clientY: 20 });
    // fireEvent.mouseUp(leadingActions, { clientX: 20, clientY: 20 });

    expect(leadingActionCallback).toHaveBeenCalledTimes(1);
    expect(listItem).toHaveClass('swipeable-list-item__content--return');
  });

  test('trailing swipe action triggering with opening actions and click', () => {
    const trailingActionCallback = jest.fn();

    renderIosOneActionType({
      fullSwipe: false,
      trailingActionCallback,
    });

    const listItem = screen.getByTestId('content');
    const trailingActions = screen.getByTestId('trailing-actions');

    const {
      children: [swipeAction],
    } = trailingActions;

    swipeLeftMouse(listItem, beyondOpenActionsThreshold());

    expect(trailingActions).toHaveClass('test-actions-opened');

    fireEvent.click(swipeAction);

    expect(trailingActionCallback).toHaveBeenCalledTimes(1);
    expect(listItem).toHaveClass('swipeable-list-item__content--return');
  });

  test('leading swipe action triggering with full swipe (two leading actions)', () => {
    const leadingActionCallback1 = jest.fn();
    const leadingActionCallback2 = jest.fn();
    const trailingActionCallback1 = jest.fn();
    const trailingActionCallback2 = jest.fn();

    renderIosTwoActionsType({
      leadingActionCallbacks: [leadingActionCallback1, leadingActionCallback2],
      trailingActionCallback: [
        trailingActionCallback1,
        trailingActionCallback2,
      ],
    });

    const listItem = screen.getByTestId('content');
    const leadingActions = screen.getByTestId('leading-actions');

    swipeRightMouse(listItem, toThreshold());
    closeLeadingActions(listItem, leadingActions);
    swipeRightTouch(listItem, toThreshold());
    expect(leadingActionCallback1).toHaveBeenCalledTimes(0);
    expect(leadingActionCallback2).toHaveBeenCalledTimes(0);
    expect(trailingActionCallback1).toHaveBeenCalledTimes(0);
    expect(trailingActionCallback2).toHaveBeenCalledTimes(0);

    swipeRightMouse(listItem, beyondThreshold());
    closeLeadingActions(listItem, leadingActions);
    swipeRightTouch(listItem, beyondThreshold());
    expect(leadingActionCallback1).toHaveBeenCalledTimes(2);
    expect(leadingActionCallback2).toHaveBeenCalledTimes(0);
    expect(trailingActionCallback1).toHaveBeenCalledTimes(0);
    expect(trailingActionCallback2).toHaveBeenCalledTimes(0);
  });

  test('trailing swipe action triggering with full swipe (two trailing actions)', () => {
    const leadingActionCallback1 = jest.fn();
    const leadingActionCallback2 = jest.fn();
    const trailingActionCallback1 = jest.fn();
    const trailingActionCallback2 = jest.fn();

    renderIosTwoActionsType({
      leadingActionCallbacks: [leadingActionCallback1, leadingActionCallback2],
      trailingActionCallbacks: [
        trailingActionCallback1,
        trailingActionCallback2,
      ],
    });

    const listItem = screen.getByTestId('content');
    const trailingActions = screen.getByTestId('trailing-actions');

    swipeLeftMouse(listItem, toThreshold());
    closeTrailingActions(listItem, trailingActions);
    swipeLeftTouch(listItem, toThreshold());
    expect(leadingActionCallback1).toHaveBeenCalledTimes(0);
    expect(leadingActionCallback2).toHaveBeenCalledTimes(0);
    expect(trailingActionCallback1).toHaveBeenCalledTimes(0);
    expect(trailingActionCallback2).toHaveBeenCalledTimes(0);

    swipeLeftMouse(listItem, beyondThreshold());
    closeTrailingActions(listItem, trailingActions);
    swipeLeftTouch(listItem, beyondThreshold());
    expect(leadingActionCallback1).toHaveBeenCalledTimes(0);
    expect(leadingActionCallback2).toHaveBeenCalledTimes(0);
    expect(trailingActionCallback1).toHaveBeenCalledTimes(0);
    expect(trailingActionCallback2).toHaveBeenCalledTimes(2);
  });

  it('should trigger onClick action if defined and no leading nor trailing actions are opened', async () => {
    const onClickCallback = jest.fn();
    renderIosOneActionType({ onClick: onClickCallback });

    const listItem = screen.getByTestId('content');
    const leadingActions = screen.getByTestId('leading-actions');
    const trailingActions = screen.getByTestId('trailing-actions');

    swipeLeftTouch(listItem, beyondThreshold());
    await waitFor(() =>
      expect(trailingActions).toHaveClass('test-actions-opened')
    );
    fireEvent.click(listItem);
    expect(onClickCallback).toHaveBeenCalledTimes(0);

    closeTrailingActions(listItem, trailingActions);
    fireEvent.click(listItem);
    expect(onClickCallback).toHaveBeenCalledTimes(1);

    swipeRightMouse(listItem, beyondThreshold());
    await waitFor(() =>
      expect(leadingActions).toHaveClass('test-actions-opened')
    );
    fireEvent.click(listItem);
    expect(onClickCallback).toHaveBeenCalledTimes(1);
  });
});
