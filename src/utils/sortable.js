import Core from '../core';

export const makeKeyboardSortable = (target, data) => {
  let isSelected = false;

  const toggleSelectedStyle = () => {
    if (data.class) {
      target.classList.toggle(data.class);
    } else if (data.style) {
      for (const [key, value] of Object.entries(data.style)) {
        if (isSelected) {
          target.style[key] = value;
        } else {
          target.style.removeProperty(key);
        }
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

        Core.event.emit(data.action, {
          ...data.getData(),
          data: { position: '-1' },
        });
        break;
      case 'Right':
      case 'ArrowRight':
      case 'Down':
      case 'ArrowDown':
        if (!isSelected) return;

        Core.event.emit(data.action, {
          ...data.getData(),
          data: { position: '+1' },
        });
        break;

      default:
    }
  };

  target.addEventListener('keydown', handleKeydown);
};
