import { html } from 'poor-man-jsx';

const Badge = ({
  tagName = 'div',
  content,
  bgColor,
  additionalCls = 'text-xs text-white',
  props = {},
}) =>
  html`<${tagName}
    is-text
    class="py-1 px-2 cursor-pointer rounded ${additionalCls}"
    style="background-color: ${bgColor}"
    ${props}
  >
    ${content}
  </${tagName}>`;

export default Badge;
