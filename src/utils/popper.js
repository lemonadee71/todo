import { createPopper } from '@popperjs/core';

export const usePopper = (ref, el, options) => {
  const popperInstance = createPopper(ref, el, options);

  const showPopper = (callback) => (e) => {
    callback?.(e);

    // Enable the event listeners
    popperInstance.setOptions((opts) => ({
      ...opts,
      modifiers: [...opts.modifiers, { name: 'eventListeners', enabled: true }],
    }));

    // Update its position
    popperInstance.update();
  };

  const hidePopper = (callback) => (e) => {
    callback?.(e);

    // Disable the event listeners
    popperInstance.setOptions((opts) => ({
      ...opts,
      modifiers: [
        ...opts.modifiers,
        { name: 'eventListeners', enabled: false },
      ],
    }));
  };

  return [popperInstance, showPopper, hidePopper];
};
