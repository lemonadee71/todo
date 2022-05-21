import { html } from 'poor-man-jsx';
import { Spinner } from '../assets/icons';

const Loading = (cls = '', spinnerCls = '') =>
  html`<div class="h-screen flex justify-center items-center ${cls}">
    ${Spinner(spinnerCls)}
  </div>`;

export default Loading;
