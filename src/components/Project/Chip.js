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
      class="text-xs text-white cursor-pointer rounded ${Core.state.$expandLabels(
        (val) => (val ? 'py-1 px-2 ' : 'w-7 h-2')
      )}"
      style="background-color: ${data.color};"
      data-name="${data.name}"
      onClick=${onClick}
    >
      ${Core.state.$expandLabels((val) => (val ? data.name : ''))}
    </div>
  `;
};

export default Chip;
