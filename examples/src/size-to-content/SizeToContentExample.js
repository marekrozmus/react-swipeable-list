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
  ItemColumn,
  ItemContent,
  ItemInfoLine,
  ItemNameLine,
  ItemRow,
} from '../styledComponents';
import { colors } from '../data.js';

import './SizeToContentExample.css';

const data = [
  { id: 1, text: 'First', description: 'first description' },
  { id: 2, text: 'Second', description: 'second description' },
  { id: 3, text: 'Third', description: 'third description' },
  { id: 4, text: 'Fourth', description: 'fourth description' },
  { id: 5, text: 'Fifth', description: 'fifth description' },
  { id: 6, text: 'Sixth', description: 'sixth description' },
  { id: 7, text: 'Seventh', description: 'seventh description' },
  { id: 8, text: 'Eighth', description: 'eighth description' },
  { id: 9, text: 'Ninth', description: 'ninth description' },
  { id: 10, text: 'Tenth', description: 'tenth description' },
  { id: 11, text: 'Eleventh', description: 'eleventh description' },
  { id: 12, text: 'Twelfth', description: 'twelfth description' },
];

const SizeToContent = () => {
  const [items, setItems] = React.useState(data);

  const setStatus = (id, status) => {
    setItems(items.map(item => (item.id === id ? { ...item, status } : item)));
  };

  const handleAccept = id => () => {
    console.log('[Handle ACCEPT]', id);
    setStatus(id, 'accepted');
  };

  const handleDelete = id => () => {
    console.log('[Handle DELETE]', id);
    setStatus(id, 'deleted');
  };

  const leadingActions = ({ id }) => (
    <LeadingActions>
      <SwipeAction onClick={handleAccept(id)}>
        <ActionContent style={{ backgroundColor: colors.accepted }}>
          Yes
        </ActionContent>
      </SwipeAction>
    </LeadingActions>
  );

  const trailingActions = ({ id }) => (
    <TrailingActions>
      <SwipeAction onClick={handleDelete(id)}>
        <ActionContent style={{ backgroundColor: colors.deleted }}>
          No
        </ActionContent>
      </SwipeAction>
    </TrailingActions>
  );

  return (
    <div className="size-to-content-swipeable-list__container">
      <SwipeableList
        style={{ backgroundColor: '#555878' }}
        type={ListType.ANDROID}
      >
        {items.map(({ id, text, description, status }) => (
          <SwipeableListItem
            key={id}
            leadingActions={leadingActions({ id })}
            trailingActions={trailingActions({ id })}
          >
            <ItemContent
              style={{ backgroundColor: colors[status] || '#555878' }}
            >
              <ItemRow>
                <ItemColumn>
                  <ItemNameLine>{text}</ItemNameLine>
                  <ItemInfoLine>{description}</ItemInfoLine>
                </ItemColumn>
              </ItemRow>
            </ItemContent>
          </SwipeableListItem>
        ))}
      </SwipeableList>
    </div>
  );
};

export default SizeToContent;
