import { html } from 'poor-man-jsx';

const Badge = ({
  content,
  bgColor,
  additionalCls = 'text-xs text-white',
  props = {},
}) =>
  html`<div
    is-text
    class="inline-block font-sans py-1 px-2 cursor-pointer rounded ${additionalCls}"
    style="background-color: ${bgColor}"
    ${props}
  >
    ${content}
  </div>`;

export default Badge;
