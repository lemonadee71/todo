import Component from '../helpers/component';
import style from './Chip.module.css';

const isChipExpanded = Component.createState(false);

const Chip = ({ label, expanded = false, clickable = false }) => {
  const toggleChip = () => {
    isChipExpanded.value = !isChipExpanded.value;
  };

  return Component.html`
    <label-chip
      class=${style.chip}
      data-label-id="${label.id}"
      color="${label.color}"
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
