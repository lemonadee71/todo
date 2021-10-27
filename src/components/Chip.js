import { html } from 'poor-man-jsx';
import Core from '../core';

const Chip = (data) => {
  const onClick = () => {
    Core.state.expandLabels = !Core.state.expandLabels;
  };

  return html`
    <div
      key="${data.id}"
      style="background-color: ${data.color};"
      ${{
        onClick,
        $class: Core.state.$expandLabels((val) =>
          val ? 'task-label' : 'chip'
        ),
      }}
    >
      <span
        ${{
          $textContent: Core.state.$expandLabels((val) =>
            val ? data.name : ''
          ),
        }}
      ></span>
    </div>
  `;
};

export default Chip;
