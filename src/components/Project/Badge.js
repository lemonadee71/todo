import { html } from 'poor-man-jsx';

const Badge = (text, color, props = {}) =>
  html`<div
    is-text
    class="inline-block font-sans text-xs text-white py-1 px-2 cursor-pointer rounded"
    style="background-color: ${color}"
    ${props}
  >
    ${text}
  </div>`;

export default Badge;
