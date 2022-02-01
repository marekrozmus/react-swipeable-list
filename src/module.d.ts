import {
  CSSProperties,
  FunctionComponent,
  PureComponent,
  ReactNode,
} from 'react';

/**
 * Type of list - changes behavior of swipeable items.
 */
export enum Type {
  /**
   * Android like behavior - no buttons in swipe content. Swipe triggers action.
   */
  ANDROID,
  /**
   * iOS like behavior - buttons in swipe content. Full swipe triggers action edge action.
   */
  IOS,
  /**
   * MS Outlook like behavior - no buttons in swipe content. Swipe triggers action but with different animation.
   */
  MS,
}

interface SwipeActionProps {
  children: ReactNode;
  /**
   * default: `false`
   *
   * If set to `true` then remove animation is played and callback is called after `destructiveCallbackDelay`.
   */
  destructive?: boolean;
  /**
   * Callback function that should be call after swipe action is triggered.
   */
  onClick: () => void;
  /**
   * default: `span`
   *
   * HTML tag that is used to create this component.
   */
  Tag?: string;
}

export const SwipeAction: FunctionComponent<SwipeActionProps>;

interface LeadingActionsProps {
  children: ReactNode;
}

export const LeadingActions: FunctionComponent<LeadingActionsProps>;

interface TrailingActionsProps {
  children: ReactNode;
}

export const TrailingActions: FunctionComponent<TrailingActionsProps>;

interface SwipeableListProps {
  children: ReactNode;
  /**
   * default: `false`
   *
   * Changes behavior of `IOS` list type.
   * When `true` and swipe is done beyond `threshold` and released the action is triggered.
   */
  fullSwipe?: boolean;
  /**
   * default: `1000`
   *
   * Time in milliseconds after which swipe action should be called for `destructive` swipe action (item deletion)
   *
   * It can be set for the whole list or for every item. See `destructiveCallbackDelay` for `SwipeableListItem`. Value from the `SwipeableListItem` takes precedence.
   */
  destructiveCallbackDelay?: number;
  /**
   * default: `undefined`
   *
   * Additional styles for list tag.
   */
  style?: CSSProperties;
  /**
   * default: `ANDROID`
   *
   * Changes behavior of swipeable items.
   */
  type?: Type;
  /**
   * default: `div`
   *
   * HTML tag that is used to create this component.
   */
  Tag?: string;
  /**
   * default: `10`
   *
   * How far in pixels scroll needs to be done to block swiping. After scrolling is started and goes beyond the threshold, swiping is blocked.
   *
   * It can be set for the whole list or for every item. See `scrollStartThreshold` for `SwipeableListItem`. Value from the `SwipeableListItem` takes precedence.
   */
  scrollStartThreshold?: number;
  /**
   * default: `10`
   *
   * How far in pixels swipe needs to be done to start swiping on list item. After a swipe is started and goes beyond the threshold, scrolling is blocked.
   *
   * It can be set for the whole list or for every item. See `swipeStartThreshold` for `SwipeableListItem`. Value from the `SwipeableListItem` takes precedence.
   */
  swipeStartThreshold?: number;
  /**
   * default: `0.5`
   *
   * How far swipe needs to be done to trigger attached action. `0.5` means that item needs to be swiped to half of its width, `0.25` - one-quarter of width.
   *
   * It can be set for the whole list or for every item. See `threshold` for `SwipeableListItem`. Value from the `SwipeableListItem` takes precedence.
   */
  threshold?: number;
}

export const SwipeableList: FunctionComponent<SwipeableListProps>;

interface SwipeableListItemProps {
  /**
   * default: `false`
   *
   * If set to `true` all defined swipe actions are blocked.
   */
  blockSwipe?: boolean;
  children?: ReactNode;
  /**
   * default: `1000`
   *
   * Time in milliseconds after which swipe action should be called for `destructive` swipe action (item deletion).
   *
   * It can be set for the whole list or for single item. See `destructiveCallbackDelay` for `SwipeableList`. Value from the `SwipeableListItem` takes precedence.
   */
  destructiveCallbackDelay?: number;
  /**
   * default: `false`
   *
   * Changes behavior of `IOS` list type.
   * When `true` and swipe is done beyond `threshold` and released the action is triggered.
   * When set to `false` actions are only opened and they need to be clicked to trigger action.
   *
   * It can be set for the whole list or for single item. See `fullSwipe` for `SwipeableList`. Value from the `SwipeableListItem` takes precedence.
   */
  fullSwipe?: boolean;
  /**
   * default: `undefined`
   *
   * `LeadingActions` component. See `LeadingActions`.
   */
  leadingActions?: ReactNode;
  /**
   * default: `ANDROID`
   *
   * Changes behavior of swipeable items.
   *
   * It can be set for the whole list or for single item. See `type` for `SwipeableList`. Value from the `SwipeableListItem` takes precedence.
   */
  listType?: Type;
  /**
   * Fired when item is clicked.
   */
  onClick?: () => void;
  /**
   * Fired after swipe has ended.
   */
  onSwipeEnd?: () => void;
  /**
   * Fired every time swipe progress changes. The reported `progress` value is always an integer in range 0 to 100 inclusive.
   */
  onSwipeProgress?: (progress:number) => void;
  /**
   * Fired after swipe has started (after drag gesture passes the `swipeStartThreshold` distance in pixels).
   */
  onSwipeStart?: () => void;
  /**
   * default: `10`
   *
   * How far in pixels scroll needs to be done to block swiping. After scrolling is started and goes beyond the threshold, swiping is blocked.
   *
   * It can be set for the whole list or for every item. See `scrollStartThreshold` for `SwipeableListItem`. Value from the `SwipeableListItem` takes precedence.
   */
  scrollStartThreshold?: number;
  /**
   * default: `10`
   *
   * How far in pixels swipe needs to be done to start swiping on list item. After a swipe is started and goes beyond the threshold, scrolling is blocked.
   *
   * It can be set for the whole list or for every item. See `swipeStartThreshold` for `SwipeableListItem`. Value from the `SwipeableListItem` takes precedence.
   */
  swipeStartThreshold?: number;
  /**
   * default: `0.5`
   *
   * How far swipe needs to be done to trigger action. `0.5` means that item needs to be swiped to half of its width, `0.25` - one-quarter of width.
   *
   * It can be set for the whole list or for every item. See `threshold` for `SwipeableListItem`. Value from the `SwipeableListItem` takes precedence.
   */
  threshold?: number;
  /**
   * default: `undefined`
   *
   * `TrailingActions` component. See `TrailingActions`.
   */
  trailingActions?: ReactNode;
  className?: string;
}

export class SwipeableListItem extends PureComponent<SwipeableListItemProps> {}
