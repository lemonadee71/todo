import { html } from 'poor-man-jsx';

const Badge = ({
  content,
  bgColor,
  fontSize = 'text-xs',
  textColor = 'text-white',
  additionalCls = '',
  props = {},
}) =>
  html`<div
    is-text
    class="inline-block font-sans py-1 px-2 cursor-pointer rounded ${fontSize} ${textColor} ${additionalCls}"
    style="background-color: ${bgColor}"
    ${props}
  >
    ${content}
  </div>`;

export default Badge;
