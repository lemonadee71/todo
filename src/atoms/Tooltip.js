import PoorManJSX, { html } from 'poor-man-jsx';

PoorManJSX.customComponents.define(
  'my-tooltip',
  () => html`<div id="tooltip" role="tooltip">
    <span id="tooltip_text"></span>
    <div id="tooltip_arrow" data-popper-arrow></div>
  </div>`
);
