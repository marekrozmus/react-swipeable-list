import 'regenerator-runtime/runtime';
import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render, screen } from '@testing-library/react';
import LeadingActions from '../LeadingActions';
import SwipeAction from '../SwipeAction';
import SwipeableListItem from '../SwipeableListItem';

describe('LeadingActions', () => {
  test('should render the action', () => {
    render(
      <SwipeableListItem
        leadingActions={
          <LeadingActions>
            <SwipeAction onClick={jest.fn()}>
              <span>Left swipe content</span>
            </SwipeAction>
          </LeadingActions>
        }
      />
    );

    expect(screen.getByText('Left swipe content')).toBeInTheDocument();
  });

  test.each([0, 1, 2])('should render %i number of items', itemsCount => {
    render(
      <SwipeableListItem
        leadingActions={
          <LeadingActions>
            {itemsCount >= 1 && (
              <SwipeAction onClick={jest.fn()}>
                <span>Left swipe content</span>
              </SwipeAction>
            )}
            {itemsCount === 2 && (
              <SwipeAction onClick={jest.fn()}>
                <span>Left swipe content</span>
              </SwipeAction>
            )}
          </LeadingActions>
        }
      />
    );

    expect(screen.queryAllByText('Left swipe content')).toHaveLength(
      itemsCount
    );
  });
});
