import React from 'react';

import IosWithOneActionExample from './ios/WithOneAction';
import IosWithTwoActionsExample from './ios/WithTwoActions';
import AndroidExample from './android/WithOneAction';
import MsExample from './ms/WithOneAction';
import SizeToContentExample from './size-to-content/SizeToContentExample';
import ProgrammaticallyExample from './programmatically/WithOneAction';
import { people as data } from './data';

const Example = {
  IOS1ACTION: 'IOS1ACTION',
  IOS2ACTIONS: 'IOS2ACTIONS',
  ANDROID: 'ANDROID',
  MS: 'MS',
  SIZE_TO_CONTENT: 'SIZE_TO_CONTENT',
  PROGRAMMATICALLY: 'PROGRAMMATICALLY',
};

const Examples = [
  { id: Example.IOS1ACTION, text: 'iOS style with one action' },
  { id: Example.IOS2ACTIONS, text: 'iOS style with two actions' },
  { id: Example.ANDROID, text: 'Android style' },
  { id: Example.MS, text: 'Outlook style' },
  {
    id: Example.SIZE_TO_CONTENT,
    text: 'List in size to content container',
  },
  {
    id: Example.PROGRAMMATICALLY,
    text: 'Programmatically swipe',
  },
];

const App = () => {
  const [people, setPeople] = React.useState(data);
  const [fullSwipe, setFullSwipe] = React.useState(false);
  const [threshold, setThreshold] = React.useState(0.5);
  const [swipeProgress, setSwipeProgress] = React.useState(0);
  const [swipeAction, setSwipeAction] = React.useState();
  const [triggeredItemAction, setTriggeredItemAction] = React.useState('None');
  const [selectedExample, setSelectedExample] = React.useState(
    Example.IOS1ACTION
  );

  const setStatus = (id, status) => {
    setPeople(
      people.map(person => (person.id === id ? { ...person, status } : person))
    );
  };

  const renderExample = () => {
    const props = {
      fullSwipe,
      people,
      setPeople,
      setStatus,
      threshold,
      setThreshold,
      setSwipeProgress,
      setSwipeAction,
      setTriggeredItemAction,
    };

    switch (selectedExample) {
      case Example.IOS1ACTION:
        return <IosWithOneActionExample {...props} />;
      case Example.IOS2ACTIONS:
        return <IosWithTwoActionsExample {...props} />;
      case Example.ANDROID:
        return <AndroidExample {...props} />;
      case Example.MS:
        return <MsExample {...props} />;
      case Example.SIZE_TO_CONTENT:
        return <SizeToContentExample />;
      case Example.PROGRAMMATICALLY:
        return <ProgrammaticallyExample {...props} />;
      default:
        return null;
    }
  };

  const updateFullSwipe = event => {
    setFullSwipe(event.target.checked);
  };

  const resetPeople = () => {
    setPeople(data);
  };

  const handleSelectionChanged = event => {
    resetPeople();
    setSwipeProgress();
    setSwipeAction();
    setTriggeredItemAction('None');
    setSelectedExample(event.target.value);
  };

  return (
    <div className="page-content">
      <h1 className="page-content__title">react-swipeable-list example</h1>
      <h2 className="page-content__subtitle">
        (try also mobile view in dev tools for touch events)
      </h2>
      <select
        className="page__select"
        value={selectedExample}
        onChange={handleSelectionChanged}
      >
        {Examples.map(item => (
          <option key={item.id} value={item.id}>
            {item.text}
          </option>
        ))}
      </select>
      <span className="page__action--title">
        (trigger threshold: {threshold})
      </span>
      {(selectedExample === Example.IOS1ACTION ||
        selectedExample === Example.IOS2ACTIONS) && (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <input
            defaultChecked={fullSwipe}
            id="fullSwipeCheck"
            type="checkbox"
            onChange={updateFullSwipe}
          />
          <label htmlFor="fullSwipeCheck">Enable full swipe</label>
        </div>
      )}
      {renderExample()}
      {selectedExample !== Example.SIZE_TO_CONTENT && (
        <>
          <div className="page__summary">
            <span className="page__action--title">Triggered action:</span>
            <span className="page__action--value">{triggeredItemAction}</span>
            <span className="page__action--title">Callback swipe action:</span>
            <span className="page__action--value">{swipeAction}</span>
            <span className="page__action--title">
              Callback swipe progress:
            </span>
            <span className="page__action--value">{swipeProgress ?? '-'}%</span>
          </div>
          <button onClick={resetPeople}>Reset list</button>
        </>
      )}
    </div>
  );
};

export default App;
