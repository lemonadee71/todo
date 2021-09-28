import { html } from 'poor-man-jsx';
import Core from '../core';

const Link = (path, text, opts = {}) =>
  html`
    <a class="link" ${{ onClick: () => Core.router.navigate(path, opts) }}>
      ${text}
    </a>
  `;

export default Link;
