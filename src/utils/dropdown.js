import { usePopper } from './popper';

export const createDropdown = (button, dropdown) => {
  // set attributes
  button.setAttribute('aria-haspopup', 'true');
  dropdown.setAttribute('tabindex', '-1');
  dropdown.setAttribute('role', 'menu');
  // it's a dropdown so we assume it is vertical
  dropdown.setAttribute('aria-orientation', 'vertical');

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
  let previousIdx = 0;

  const focusChild = (parent, idx) => {
    parent.children[previousIdx].setAttribute('tabindex', '-1');
    previousIdx = idx;

    const selected = parent.children[previousIdx];
    selected.setAttribute('tabindex', '0');
    // doesn't show focus outline sometimes; more likely to happen when clicked
    selected.focus();
  };

  const openMenu = onShow(() => {
    button.setAttribute('aria-expanded', 'true');
    dropdown.style.removeProperty('display');

    // make all children unfocusable at first
    [...dropdown.children].forEach((child) => {
      child.setAttribute('tabindex', '-1');
    });

    // then focus first item
    focusChild(dropdown, previousIdx);
  });

  const closeMenu = onHide(() => {
    button.removeAttribute('aria-expanded');
    dropdown.style.display = 'none';
    // reset state
    previousIdx = 0;
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
    // if already opened just move focus
    switch (e.key) {
      case 'Down':
      case 'ArrowDown': {
        if (isOpen) focusChild(dropdown, 0);
        else openMenu();
        break;
      }
      case 'Up':
      case 'ArrowUp': {
        previousIdx = dropdown.children.length - 1;
        if (isOpen) focusChild(dropdown, previousIdx);
        else openMenu();
        break;
      }
      // BUG: Pressing enter also presses the first focus item
      case 'Enter':
      case ' ':
        toggleMenu(e);
        break;

      default:
    }

    isOpen = true;
  });

  dropdown.addEventListener('keydown', (e) => {
    switch (e.key) {
      case 'Home':
        focusChild(dropdown, 0);
        break;
      case 'End':
        focusChild(dropdown, dropdown.children.length - 1);
        break;
      case 'Down':
      case 'ArrowDown': {
        const i = previousIdx + 1;
        if (i > dropdown.children.length - 1) {
          focusChild(dropdown, 0);
        } else {
          focusChild(dropdown, i);
        }

        break;
      }
      case 'Up':
      case 'ArrowUp': {
        const i = previousIdx - 1;
        if (i < 0) {
          focusChild(dropdown, dropdown.children.length - 1);
        } else {
          focusChild(dropdown, i);
        }

        break;
      }
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
