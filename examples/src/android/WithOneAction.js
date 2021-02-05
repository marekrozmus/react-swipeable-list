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

import './WithOneAction.css';

const WithOneAction = ({
  people,
  setStatus,
  setPeople,
  threshold,
  setThreshold,
  setSwipeProgress,
  setSwipeAction,
  setTriggeredItemAction,
}) => {
  React.useEffect(() => {
    setThreshold(0.3);
  }, [setThreshold]);

  const handleSwipeStart = () => {
    setSwipeAction('Swipe started');
    setTriggeredItemAction('None');
  };

  const handleSwipeEnd = () => {
    setSwipeAction('Swipe ended');
    setSwipeProgress();
  };

  const handleAccept = id => () => {
    console.log('[Hanlde ACCEPT]', id);
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
    <>
      <div className="basic-swipeable-list__container">
        <SwipeableList
          style={{ backgroundColor: '#555878' }}
          threshold={threshold}
          type={ListType.ANDROID}
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
    </>
  );
};

export default WithOneAction;
