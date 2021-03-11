import Component from '../helpers/component';
import { isChipExpanded } from '../modules/globalState';

const Chip = ({ label, expanded = false, clickable = false }) => {
  const toggleChip = () => {
    isChipExpanded.value = !isChipExpanded.value;
  };

  return Component.html`
    <chip-el
      data-label-id="${label.id}"
      data-color="${label.color}"
      text="${label.name}"    
      ${
        clickable
          ? { $expanded: isChipExpanded.bind() }
          : expanded
          ? 'expanded="true"'
          : ''
      }
      ${clickable ? { onClick: toggleChip } : ''}
    >
    </chip-el>
  `;
};

export default Chip;
