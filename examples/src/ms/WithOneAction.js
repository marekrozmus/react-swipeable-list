import React from 'react';
import PropTypes from 'prop-types';
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
  ItemContent,
  ItemInfoLine,
  ItemNameLine,
  ItemRow,
} from '../styledComponents';
import { colors } from '../data.js';

import './WithOneAction.css';

const WithOneAction = ({
  people,
  setStatus,
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

  const handleReject = id => () => {
    console.log('[Handle REJECT]', id);
    setTriggeredItemAction(`[Handle REJECT] - ${id}`);
    setStatus(id, 'rejected');
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
      <SwipeAction onClick={handleReject(id)}>
        <ActionContent style={{ backgroundColor: colors.rejected }}>
          Reject
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
          type={ListType.MS}
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

WithOneAction.propTypes = {
  people: PropTypes.array.isRequired,
  setStatus: PropTypes.func.isRequired,
  threshold: PropTypes.number.isRequired,
  setThreshold: PropTypes.func.isRequired,
  setSwipeProgress: PropTypes.func.isRequired,
  setSwipeAction: PropTypes.func.isRequired,
  setTriggeredItemAction: PropTypes.func.isRequired,
};

export default WithOneAction;
