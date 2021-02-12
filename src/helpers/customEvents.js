const newCustomEvent = (eventName, bubbles = false, cancelable = false) =>
  new CustomEvent(eventName, {
    bubbles,
    cancelable,
  });

const childAddedEvent = newCustomEvent('childadded', true, true);
const childRemovedEvent = newCustomEvent('childremoved', true, true);

export { childAddedEvent, childRemovedEvent };
