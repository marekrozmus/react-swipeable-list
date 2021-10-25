import React from 'react';
import {
  LeadingActions,
  SwipeableList,
  SwipeableListItem,
  SwipeAction,
  TrailingActions,
  Type as ListType,
} from 'react-swipeable-list';
import 'react-swipeable-list/dist/styles.css';

import {
  ActionContent,
  Avatar,
  ItemColumn,
  ItemColumnCentered,
  ItemContent,
  ItemInfoLine,
  ItemNameLine,
  ItemRow,
} from '../styledComponents';
import { colors } from '../data.js';
import { DeleteIcon } from '../../images/icons';
import { simulate, simulateSwipe } from './mouseEventUtils';

import './WithOneAction.css';

const WithOneAction = ({
  people,
  fullSwipe,
  setStatus,
  setPeople,
  threshold,
  setThreshold,
  setSwipeAction,
  setSwipeProgress,
  setTriggeredItemAction,
}) => {
  React.useEffect(() => {
    setThreshold(0.5);
  }, [setThreshold]);
  const [autoSwipe, setAutoSwipe] = React.useState(false);

  React.useEffect(() => {
    if (autoSwipe) {
      const el = document.querySelector('.swipeable-list-item__content'); // the list item root (it will get the first element from list)
      const pos = el.getBoundingClientRect();
      const center1X = Math.floor((pos.left + pos.right) / 2);
      const center1Y = Math.floor((pos.top + pos.bottom) / 2);

      simulate(el, 'mousedown', { pointerX: center1X, pointerY: center1Y });

      simulateSwipe(el, { x: center1X, y: center1Y }, center1X + 100, 5);
    }
  }, [autoSwipe]);

  const handleSwipeStart = () => {
    setSwipeAction('Swipe started');
    setTriggeredItemAction('None');
  };

  const handleSwipeEnd = () => {
    setSwipeAction('Swipe ended');
    setSwipeProgress();
  };

  const handleAccept = id => () => {
    console.log('[Handle ACCEPT]', id);
    setTriggeredItemAction(`[Handle ACCEPT] - ${id}`);
    setStatus(id, 'accepted');
  };

  const handleDelete = id => () => {
    console.log('[Handle DELETE]', id);
    setTriggeredItemAction(`[Handle DELETE] - ${id}`);
    setPeople(people.filter(person => person.id !== id));
  };

  const leadingActions = ({ id }) => (
    <LeadingActions>
      <SwipeAction onClick={handleAccept(id)}>
        <ActionContent style={{ backgroundColor: colors.accepted }}>
          Accept
        </ActionContent>
      </SwipeAction>
    </LeadingActions>
  );

  const trailingActions = ({ id }) => (
    <TrailingActions>
      <SwipeAction destructive={true} onClick={handleDelete(id)}>
        <ActionContent style={{ backgroundColor: colors.deleted }}>
          <ItemColumnCentered>
            <span className="icon">
              <DeleteIcon />
            </span>
            Delete
          </ItemColumnCentered>
        </ActionContent>
      </SwipeAction>
    </TrailingActions>
  );

  return (
    <div className="basic-swipeable-list__container">
      <button onClick={() => setAutoSwipe(true)}>START</button>
      <SwipeableList
        fullSwipe={fullSwipe}
        style={{ backgroundColor: '#555878' }}
        threshold={threshold}
        type={ListType.IOS}
      >
        {people.map(({ avatar, id, name, info, status }) => (
          <SwipeableListItem
            key={id}
            leadingActions={leadingActions({ id })}
            trailingActions={trailingActions({ id })}
            onSwipeEnd={handleSwipeEnd}
            onSwipeProgress={setSwipeProgress}
            onSwipeStart={handleSwipeStart}
          >
            <ItemContent>
              <ItemRow>
                <Avatar alt="avatar" src={avatar} />
                <ItemColumn>
                  <ItemNameLine>{name}</ItemNameLine>
                  <ItemInfoLine>
                    {info}{' '}
                    <span
                      style={{
                        backgroundColor: colors[status] || 'transparent',
                      }}
                    >
                      ({status})
                    </span>
                  </ItemInfoLine>
                </ItemColumn>
              </ItemRow>
            </ItemContent>
          </SwipeableListItem>
        ))}
      </SwipeableList>
    </div>
  );
};

export default WithOneAction;
