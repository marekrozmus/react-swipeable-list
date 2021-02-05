import { fireEvent } from '@testing-library/react';

export const DELTA = 20;

export const Direction = {
  North: 1,
  NorthEast: 2,
  East: 3,
  SouthEast: 4,
  South: 5,
  SouthWest: 6,
  West: 7,
  NorthWest: 8,
};

const startPoint = () => ({ clientX: 50, clientY: 25 });

const movePoint = (point, direction) => {
  const { clientX, clientY } = point;

  switch (direction) {
    case Direction.North:
      return { clientX, clientY: clientY - DELTA };
    case Direction.West:
      return { clientX: clientX - DELTA, clientY };
    case Direction.South:
      return { clientX, clientY: clientY + DELTA };
    case Direction.East:
      return { clientX: clientX + DELTA, clientY };
    case Direction.NorthWest:
      return movePoint(movePoint(point, Direction.North), Direction.West);
    case Direction.NorthEast:
      return movePoint(movePoint(point, Direction.North), Direction.East);
    case Direction.SouthWest:
      return movePoint(movePoint(point, Direction.South), Direction.West);
    case Direction.SouthEast:
      return movePoint(movePoint(point, Direction.South), Direction.East);
  }
};

export const makeMouseGesture = (container, directions) => {
  let point = startPoint();

  fireEvent.mouseDown(container, point);

  for (let i = 0; i < directions.length; i++) {
    point = movePoint(point, directions[i]);
    fireEvent.mouseMove(container, point);
  }

  fireEvent.mouseUp(container, point);

  return point;
};

export const makeTouchGesture = (container, directions) => {
  let point = startPoint();

  fireEvent.touchStart(container, {
    targetTouches: [point],
  });

  for (let i = 0; i < directions.length; i++) {
    point = movePoint(point, directions[i]);
    fireEvent.touchMove(container, {
      targetTouches: [point],
    });
  }

  fireEvent.touchEnd(container, {
    targetTouches: [point],
  });

  return point;
};

export const swipeLeftMouse = container => {
  fireEvent.mouseDown(container, { clientX: 250, clientY: 20 });
  fireEvent.mouseMove(container, { clientX: 100, clientY: 20 });
  fireEvent.mouseUp(container, { clientX: 100, clientY: 20 });
};

export const swipeRightMouse = container => {
  fireEvent.mouseDown(container, { clientX: 250, clientY: 20 });
  fireEvent.mouseMove(container, { clientX: 350, clientY: 20 });
  fireEvent.mouseUp(container, { clientX: 350, clientY: 20 });
};

export const swipeLeftTouch = container => {
  fireEvent.touchStart(container, {
    targetTouches: [{ clientX: 250, clientY: 20 }],
  });
  fireEvent.touchMove(container, {
    targetTouches: [{ clientX: 100, clientY: 20 }],
  });
  fireEvent.touchEnd(container, {
    targetTouches: [{ clientX: 100, clientY: 20 }],
  });
};

export const swipeRightTouch = container => {
  fireEvent.touchStart(container, {
    targetTouches: [{ clientX: 250, clientY: 20 }],
  });
  fireEvent.touchMove(container, {
    targetTouches: [{ clientX: 350, clientY: 20 }],
  });
  fireEvent.touchEnd(container, {
    targetTouches: [{ clientX: 350, clientY: 20 }],
  });
};
