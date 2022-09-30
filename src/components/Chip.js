import { html } from 'poor-man-jsx';
import Core from '../core';

const Chip = (data) => {
  const onClick = () => {
    Core.state.expandLabels = !Core.state.expandLabels;
  };

  return html`
    <div
      :key="${data.id}"
      class="text-xs text-white cursor-pointer rounded"
      class:[py-1,px-2|w-7,h-2]=${Core.state.$expandLabels}
      title="${data.name}"
      style="background-color: ${data.color};"
      onClick=${onClick}
    >
      ${Core.state.$expandLabels((val) => (val ? data.name : ''))}
    </div>
  `;
};

export default Chip;
