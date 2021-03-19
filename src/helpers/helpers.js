import { childAddedEvent, childRemovedEvent } from './customEvents';

const $ = (query) => {
  const isId = query.includes('#');
  const isAll = query.includes('--all');
  const isDataAttr = query.includes('--data');
  const isDescendantSelector = query.includes(' ');

  if (isId && !isDescendantSelector) {
    return document.getElementById(query.replace('#', ''));
  }
  if (isAll) {
    return document.querySelectorAll(query.replace('--all', ''));
  }
  if (isDataAttr) {
    const [type, value] = query.replace('--data-', '').split('=');
    return document.querySelector(`[data-${type}="${value}"]`);
  }

  return document.querySelector(query);
};

const clear = (element) => {
  [...element.children].map((child) => child.remove());
};

const hide = (element) => {
  element.style.display = 'none';
};

const show = (element) => {
  element.style.display = 'block';
};

const rerender = (el, newContent) => {
  clear(el);
  el.appendChild(newContent);
};

const append = (child) => ({
  to: (parent) => {
    parent.appendChild(child);
    parent.dispatchEvent(childAddedEvent);
  },
});

const remove = (child) => ({
  from: (parent) => {
    parent.removeChild(child);
    parent.dispatchEvent(childRemovedEvent);
  },
});

export { clear, hide, show, rerender, append, remove };
export default $;
