import IdList from '../core/classes/IdList';

export const memoize = (fn) => {
  const cache = new Map();

  const memoized = (...args) => {
    const key = JSON.stringify(args);
    const result = cache.get(key) ?? fn(...args);
    cache.set(key, result);

    return result;
  };

  memoized.__cache__ = cache;

  return memoized;
};

export const curry = (fn) =>
  function curried(...args) {
    if (args.length >= fn.length) {
      return fn(...args);
    }

    return (...rest) => curried(...args.concat(rest));
  };

export const intersectById = (source, ids) =>
  source.filter((item) => ids.find((id) => item?.id === id));

export const sortById = (source, ids) => {
  const sorted = [];
  const list = new IdList(source);

  ids.forEach((id) => {
    const item = list.extract(id);
    if (item) sorted.push(item);
  });

  return [...sorted, ...list.items];
};

export const intersectAndSortById = (source, ids) =>
  sortById(intersectById(source, ids), ids);

export const copy = (target, toExclude = []) => {
  const clone = { ...target };
  toExclude.forEach((prop) => delete clone[prop]);

  return clone;
};

/**
 * Removes all key-value pair that have null/undefined values
 * @param {Object} o
 * @returns {Object}
 */
export const sieve = (o) => {
  for (const key in o) {
    if (o[key] === null || o[key] === undefined) {
      delete o[key];
    }
  }

  return o;
};

// taken from: https://stackoverflow.com/questions/6234773
export const escapeHTML = (unsafe) =>
  unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

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

export const createRovingTabindexFns = (container) => {
  let previousIdx = 0;

  const setPreviousIdx = (idx) => {
    previousIdx = idx;
    return previousIdx;
  };

  const focusChild = (parent, idx) => {
    parent.children[previousIdx].setAttribute('tabindex', '-1');
    setPreviousIdx(idx);

    const selected = parent.children[previousIdx];
    selected.setAttribute('tabindex', '0');
    // doesn't show focus outline sometimes; more likely to happen when clicked
    selected.focus();
  };

  const focus = (idx) => focusChild(container, idx);

  const onKeydownForTrigger = (e) => {
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

  const onKeydownForItems = (e) => {
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

  return { setPreviousIdx, focus, onKeydownForTrigger, onKeydownForItems };
};
