import Component from './component';
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

const hide = (selector) => {
  $(selector).style.display = 'none';
};

const show = (selector) => {
  $(selector).style.display = 'block';
};

const rerender = (el, newContent) => {
  clear(el);
  el.appendChild(newContent);
};

const append = (child) => ({
  to: (parent) => {
    const isTemplate = (val) => val._type && val._type === 'template';

    if (isTemplate(child)) {
      parent.appendChild(Component.render(child));
    } else {
      parent.appendChild(child);
    }

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
