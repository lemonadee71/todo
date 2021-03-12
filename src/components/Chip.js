import Component from '../helpers/component';
import { isChipExpanded } from '../modules/globalState';

const Chip = ({ label, expanded = false, clickable = false }) => {
  const toggleChip = () => {
    isChipExpanded.value = !isChipExpanded.value;
  };

  return Component.html`
    <label-chip
      data-label-id="${label.id}"
      data-color="${label.color}"
      text="${label.name}"    
      ${
        clickable
          ? { $expanded: isChipExpanded.bind() }
          : `expanded=${expanded}`
      }
      ${clickable ? { onClick: toggleChip } : ''}
    >
    </label-chip>
  `;
};

export default Chip;
