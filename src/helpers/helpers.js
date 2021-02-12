import { childAddedEvent, childRemovedEvent } from './customEvents';
import { currentTasks, completedTasks, modal, modalContent } from './selectors';

const $ = (query) => {
  let isId = query.includes('#');
  let isAll = query.includes('--all');
  let isDataAttr = query.includes('--data');
  let isDescendantSelector = query.includes(' ');

  if (isId && !isDescendantSelector) {
    return document.getElementById(query.replace('#', ''));
  } else if (isAll) {
    return document.querySelectorAll(query.replace('--all', ''));
  } else if (isDataAttr) {
    let [type, value] = query.replace('--data-', '').split('=');
    return document.querySelector(`[data-${type}="${value}"]`);
  }

  return document.querySelector(query);
};

const clear = (element) => {
  [...element.children].map((child) => child.remove());
};

const hide = (element) => {
  element.style.display = '';
};

const show = (element) => {
  element.style.display = 'block';
};

const closeModal = () => {
  hide($(modal));
  clear($(modalContent));
};

const changeModalContent = (newContent) => {
  let content = $(modalContent);
  clear(content);
  content.appendChild(newContent);
};

const clearTasks = () => {
  clear($(currentTasks));
  clear($(completedTasks));
};

const rerender = (el, newContent) => {
  clear(el);
  el.appendChild(newContent);
};

const append = (child) => {
  return {
    to: (parent) => {
      parent.appendChild(child);
      parent.dispatchEvent(childAddedEvent);
    },
  };
};

const prepend = (child) => {
  return {
    to: (parent) => {
      parent.prepend(child);
      parent.dispatchEvent(childAddedEvent);
    },
  };
};

const remove = (child, self = false) => {
  if (self) {
    // not working
    child.parentElement.dispatchEvent(childRemovedEvent);
    child.remove();
  } else {
    return {
      from: (parent) => {
        parent.removeChild(child);
        parent.dispatchEvent(childRemovedEvent);
      },
    };
  }
};

export {
  clear,
  hide,
  show,
  closeModal,
  changeModalContent,
  clearTasks,
  rerender,
  append,
  prepend,
  remove,
};
export default $;
