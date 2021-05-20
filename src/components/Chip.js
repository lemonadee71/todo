import { html } from '../helpers/component';
import style from './Chip.module.css';

const Chip = ({ label, showText = false, expandable = false }) =>
  html`
    <label-chip
      class=${style.chip}
      data-label-id="${label.id}"
      color="${label.color}"
      text="${label.name}"
      show-text="${showText}"
      expandable="${expandable}"
    >
    </label-chip>
  `;
export default Chip;
