import { html } from 'poor-man-jsx';

const Tooltip = () => html`<div id="tooltip" role="tooltip">
  <span id="tooltip_text"></span>
  <div id="tooltip_arrow" data-popper-arrow></div>
</div>`;

export default Tooltip;
