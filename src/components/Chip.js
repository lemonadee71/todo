import { html, createState } from '../helpers/component';
import style from './Chip.module.css';

const isChipExpanded = createState(false);

const Chip = ({ label, expanded = false, clickable = false }) => {
  const toggleChip = () => {
    isChipExpanded.value = !isChipExpanded.value;
  };

  return html`
    <label-chip
      class=${style.chip}
      data-label-id="${label.id}"
      color="${label.color}"
      text="${label.name}"
      ${clickable
        ? { $expanded: isChipExpanded.bind() }
        : `expanded=${expanded}`}
      ${clickable ? { onClick: toggleChip } : ''}
    >
    </label-chip>
  `;
};

export default Chip;
