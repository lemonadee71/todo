import { createRovingTabindexFns } from './misc';
import { usePopper } from './popper';

export const createDropdown = (button, dropdown) => {
  // set attributes
  button.setAttribute('aria-haspopup', 'true');
  dropdown.setAttribute('tabindex', '-1');
  dropdown.setAttribute('role', 'menu');
  // it's a dropdown so we assume it is vertical
  dropdown.setAttribute('aria-orientation', 'vertical');
  [...dropdown.children].forEach((item) =>
    item.setAttribute('role', 'menuitem')
  );

  const { dropdownOffset, dropdownPosition, dropdownName } = dropdown.dataset;

  // if no [data-dropdown-name], use text of menu btn
  if (dropdownName || button.innerText) {
    dropdown.setAttribute('aria-label', dropdownName || button.innerText);
  }

  const [, onShow, onHide] = usePopper(button, dropdown, {
    placement: dropdownPosition || 'bottom',
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: dropdownOffset
            ? dropdownOffset.split(',').map((x) => +x)
            : [0, 0],
        },
      },
    ],
    strategy: 'absolute',
  });

  let isOpen = false;
  const { setPreviousIdx, focus, onKeydownForItems } =
    createRovingTabindexFns(dropdown);

  const openMenu = onShow(() => {
    button.setAttribute('aria-expanded', 'true');
    dropdown.style.removeProperty('display');

    // make all children unfocusable at first
    [...dropdown.children].forEach((child) => {
      child.setAttribute('tabindex', '-1');
    });

    // then focus first item
    focus(0);
  });

  const closeMenu = onHide(() => {
    button.removeAttribute('aria-expanded');
    dropdown.style.display = 'none';
    // reset state
    setPreviousIdx(0);
  });

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

  document.body.addEventListener('click', closeIfClickedOutside);

  button.addEventListener('click', toggleMenu);

  button.addEventListener('keydown', (e) => {
    if (e.altKey) return;

    // if already opened just move focus
    switch (e.key) {
      case 'Down':
      case 'ArrowDown': {
        openMenu();
        focus(0);
        break;
      }
      case 'Up':
      case 'ArrowUp': {
        openMenu();
        focus(dropdown.children.length - 1);
        break;
      }
      case 'Enter':
      case ' ':
        toggleMenu(e);
        e.preventDefault();
        break;

      default:
    }
  });

  dropdown.addEventListener('keydown', onKeydownForItems);
  dropdown.addEventListener('keydown', (e) => {
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

      default: // Quit when this doesn't handle the key event.
    }
  });

  dropdown.addEventListener('@destroy', () => {
    document.body.removeEventListener('click', closeIfClickedOutside);
  });
};
