import { apply } from 'poor-man-jsx';
import { useFloating } from './floating';
import { createRovingTabFns } from './keyboard';

export const createDropdown = (button, dropdown, data) => {
  // set attributes
  button.setAttribute('aria-haspopup', 'true');
  dropdown.style.display = 'none';
  dropdown.setAttribute('tabindex', '-1');
  dropdown.setAttribute('role', 'menu');
  dropdown.setAttribute('aria-orientation', 'vertical');

  for (const item of [...dropdown.children]) {
    item.setAttribute('role', 'menuitem');
  }

  // if no name, use text of menu btn
  if (data.name || button.innerText) {
    dropdown.setAttribute('aria-label', data.name || button.innerText);
  }

  let isOpen = false;
  const { interact, moveWithin, reset } = createRovingTabFns(dropdown);
  const update = useFloating(button, dropdown, null, {
    placement: data.placement || 'bottom',
    offset: data.offset,
  });

  const openMenu = () => {
    update(() => {
      button.setAttribute('aria-expanded', 'true');
      dropdown.style.removeProperty('display');
    });
  };

  const closeMenu = () => {
    button.removeAttribute('aria-expanded');
    dropdown.style.display = 'none';
    reset();
  };

  const toggleMenu = (e) => {
    isOpen = !isOpen;

    if (isOpen) openMenu();
    else closeMenu();

    e.stopPropagation();
  };

  // close dropdown when clicked outside
  const closeIfClickedOutside = (e) => {
    if (!dropdown.contains(e.target)) {
      closeMenu();
      isOpen = false;
    }
  };

  apply(document.body, { onClick: closeIfClickedOutside });

  apply(button, {
    onClick: toggleMenu,
    onKeydown: [
      (e) => {
        if (e.altKey) return;

        // if already opened just move focus
        switch (e.key) {
          case 'Up':
          case 'ArrowUp':
          case 'Down':
          case 'ArrowDown':
            openMenu();
            break;
          case 'Enter':
          case ' ':
            toggleMenu(e);
            e.preventDefault();
            break;

          default:
        }
      },
      interact,
    ],
  });

  apply(dropdown, {
    onDestroy: () => {
      document.body.removeEventListener('click', closeIfClickedOutside);
    },
    onKeydown: [
      moveWithin,
      (e) => {
        if (e.altKey) return;

        switch (e.key) {
          case 'Esc':
          case 'Escape':
            closeMenu();
            button.focus();
            isOpen = false;
            break;
          case 'Tab':
            closeMenu();
            isOpen = false;
            break;

          default:
        }
      },
    ],
  });
};
