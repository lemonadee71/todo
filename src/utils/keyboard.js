import { curry } from './misc';

/**
 * Make a function run only for valid "click" events.
 * Does not run if altKey is held down
 * @param {Function} fn - the callback to be wrapped
 * @returns {Function}
 */
export const runOnlyIfClick = (fn) => (e) => {
  if (e.altKey) return;
  if (e.type === 'click' || e.key === ' ' || e.key === 'Enter') {
    fn(e);
    e.preventDefault();
  }
};

/**
 * Create utilities to implement roving tab index
 * @param {HTMLElement} container
 * @returns
 */
export const createRovingTabFns = (container) => {
  let previousIdx = 0;

  const focusChild = (parent, newIdx) => {
    parent.children[previousIdx].setAttribute('tabindex', '-1');
    previousIdx = newIdx;

    const selected = parent.children[newIdx];
    selected.setAttribute('tabindex', '0');
    // doesn't show focus outline sometimes; more likely to happen when clicked
    selected.focus();
  };

  const focus = curry(focusChild)(container);

  const init = () => {
    container.forEach((child) => child.setAttribute('tabindex', '-1'));
  };

  const reset = () => {
    init();
    previousIdx = 0;
  };

  const interact = (e) => {
    if (e.altKey) return;

    switch (e.key) {
      case 'Down':
      case 'ArrowDown':
        focus(0);
        break;
      case 'Up':
      case 'ArrowUp':
        focus(container.children.length - 1);
        break;

      default:
    }
  };

  const moveWithin = (e) => {
    if (e.altKey) return;

    switch (e.key) {
      case 'Home':
        focus(0);
        break;
      case 'End':
        focus(container.children.length - 1);
        break;
      case 'Down':
      case 'ArrowDown': {
        const i = previousIdx + 1;
        if (i > container.children.length - 1) {
          focus(0);
        } else {
          focus(i);
        }

        break;
      }
      case 'Up':
      case 'ArrowUp': {
        const i = previousIdx - 1;
        if (i < 0) {
          focus(container.children.length - 1);
        } else {
          focus(i);
        }

        break;
      }

      default: // Quit when this doesn't handle the key event.
    }
  };

  init();

  return { reset, focus, interact, moveWithin };
};
