import Core from '../core';

const locationKeywords = ['project', 'list', 'task', 'subtask'];

/**
 * Make target sortable using keyboard.
 * 'Space' handler must be reserved to work.
 * @param {HTMLElement} target
 */
export const makeKeyboardSortable = (target) => {
  let {
    sortableAction: action,
    sortableStyle: style,
    location,
  } = target.dataset;
  location = location.split(',').reduce((obj, curr, i) => {
    obj[locationKeywords[i]] = curr;
    return obj;
  }, {});

  let isSelected = false;

  const toggleSelectedStyle = () => {
    if (!style) return;

    // we assume it's a toggleable class
    if (style.startsWith('.')) {
      target.classList.toggle(style.replace('.', ''));
    } else {
      const [key, value] = style
        .replace(';', '')
        .split(':')
        .map((str) => str.trim());

      if (isSelected) {
        target.style[key] = value;
      } else {
        target.style.removeProperty(key);
      }
    }
  };

  const handleKeydown = (e) => {
    // only act if event originated from target
    // 2 === AT_TARGET
    if (e.altKey || e.eventPhase !== 2) return;

    switch (e.key) {
      /** Handle selection */
      case ' ':
        isSelected = !isSelected;
        toggleSelectedStyle();
        // to prevent scrolling
        e.preventDefault();
        break;
      case 'Esc':
      case 'Escape':
        isSelected = false;
        toggleSelectedStyle();
        break;
      case 'Tab':
        // trap focus to target if selected
        if (isSelected) e.preventDefault();
        break;

      /**
       * Handle sorting
       * For less complexity, we're not wrapping
       * See example here: https://salesforce-ux.github.io/dnd-a11y-patterns/#/sortA?_k=gdn53h
       * */
      case 'Left':
      case 'ArrowLeft':
      case 'Up':
      case 'ArrowUp':
        if (!isSelected) return;

        // BUG: Loses focus after 1 action. Added quick fix for now
        //      See https://github.com/lemonadee71/poor-man-jsx/issues/32
        Core.event.emit(action, {
          ...location,
          data: { position: '-1' },
        });
        break;
      case 'Right':
      case 'ArrowRight':
      case 'Down':
      case 'ArrowDown':
        if (!isSelected) return;

        Core.event.emit(action, {
          ...location,
          data: { position: '+1' },
        });
        break;

      default:
    }
  };

  target.addEventListener('keydown', handleKeydown);
};
