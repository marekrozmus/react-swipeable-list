/**
 * It triggers touch events. Also supports multiple touch events.
 * @param {Element} element target DOM element
 * @param {string} type type of event
 * @param {Array} touches {x, y, id} position and identifier of the event
 */
export function simulateTouchEvent(element, type, touches) {
  const touchEvents = [];

  touches.forEach(touch => {
    touchEvents.push(
      new Touch({
        screenX: touch.x,
        screenY: touch.y,
        pageX: touch.x,
        pageY: touch.y,
        clientX: touch.x,
        clientY: touch.y,
        identifier: touch.id,
        target: element,
        force: 10,
      })
    );
  });

  element.dispatchEvent(
    new TouchEvent(type, {
      touches: touchEvents,
      view: window,
      cancelable: true,
      bubbles: true,
    })
  );
}

/**
 * It triggers mouse event.
 * @param {string} type type of event
 * @param {Element} element target DOM element
 * @param {number} x clientX of event
 * @param {number} y clientY of event
 */
export function simulateMouseEvent(type, element, x, y) {
  const evt = document.createEvent('MouseEvents');
  evt.initMouseEvent(
    type,
    true,
    true,
    window,
    1,
    x,
    y,
    x,
    y,
    false,
    false,
    false,
    false,
    0,
    element
  );
  element.dispatchEvent(evt);
}

export function simulate(element, eventName) {
  var options = extend(defaultOptions, arguments[2] || {});
  var oEvent,
    eventType = null;

  for (var name in eventMatchers) {
    if (eventMatchers[name].test(eventName)) {
      eventType = name;
      break;
    }
  }

  if (!eventType)
    throw new SyntaxError(
      'Only HTMLEvents and MouseEvents interfaces are supported'
    );

  if (document.createEvent) {
    oEvent = document.createEvent(eventType);
    if (eventType == 'HTMLEvents') {
      oEvent.initEvent(eventName, options.bubbles, options.cancelable);
    } else {
      console.log({ options, eventName });
      oEvent.initMouseEvent(
        eventName,
        options.bubbles,
        options.cancelable,
        document.defaultView,
        options.button,
        options.pointerX,
        options.pointerY,
        options.pointerX,
        options.pointerY,
        options.ctrlKey,
        options.altKey,
        options.shiftKey,
        options.metaKey,
        options.button,
        element
      );
    }
    element.dispatchEvent(oEvent);
  } else {
    options.clientX = options.pointerX;
    options.clientY = options.pointerY;
    var evt = document.createEventObject();
    oEvent = extend(evt, options);
    element.fireEvent('on' + eventName, oEvent);
  }
  return element;
}

export const simulateSwipe = (el, fromPoint, to, step) => {
  if (fromPoint.x >= to) {
    simulateMouseEvent('mouseup', el, fromPoint.x, fromPoint.y);
  } else {
    setTimeout(() => {
      simulateMouseEvent('mousemove', el, fromPoint.x + step, fromPoint.y);

      simulateSwipe(el, { ...fromPoint, x: fromPoint.x + step }, to, step);
    }, 100);
  }
};

function extend(destination, source) {
  for (var property in source) destination[property] = source[property];
  return destination;
}

var eventMatchers = {
  HTMLEvents: /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,
  MouseEvents: /^(?:click|dblclick|mouse(?:down|up|over|move|out))$/,
};
var defaultOptions = {
  pointerX: 0,
  pointerY: 0,
  button: 0,
  ctrlKey: false,
  altKey: false,
  shiftKey: false,
  metaKey: false,
  bubbles: true,
  cancelable: true,
};
