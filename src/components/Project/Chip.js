import { html } from 'poor-man-jsx';
import Core from '../../core';

const Chip = (data) => {
  const onClick = () => {
    Core.state.expandLabels = !Core.state.expandLabels;
  };

  return html`
    <div
      is-text
      key="${data.id}"
      class=${Core.state.$expandLabels((val) => (val ? 'task-label' : 'chip'))}
      style="background-color: ${data.color};"
      onClick=${onClick}
    >
      ${Core.state.$expandLabels((val) => (val ? data.name : ''))}
    </div>
  `;
};

export default Chip;
