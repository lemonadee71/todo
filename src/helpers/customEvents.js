const childAddedEvent = new CustomEvent('childadded', {
  bubbles: true,
  cancelable: true,
});

const childRemovedEvent = new CustomEvent('childremoved', {
  bubbles: true,
  cancelable: true,
});

export { childAddedEvent, childRemovedEvent };
