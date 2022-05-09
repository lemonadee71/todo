import { usePopper } from './popper';

// BUG: the dropdown is being covered by elements
export const createDropdown = (target, dropdown) => {
  let isOpen = false;
  const { dropdownOffset, dropdownPosition } = dropdown.dataset;

  const [, onShow, onHide] = usePopper(target, dropdown, {
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

  const openMenu = onShow(() => {
    dropdown.style.removeProperty('display');
  });

  const closeMenu = onHide(() => {
    dropdown.style.display = 'none';
  });

  target.addEventListener('click', (evt) => {
    isOpen = !isOpen;

    if (isOpen) openMenu();
    else closeMenu();

    evt.stopPropagation();
  });

  // close dropdown when clicked outside
  const cb = (evt) => {
    if (!dropdown.contains(evt.target)) {
      closeMenu();
      isOpen = false;
    }
  };

  document.body.addEventListener('click', cb);
  dropdown.addEventListener('@destroy', () =>
    document.body.removeEventListener('click', cb)
  );
};
