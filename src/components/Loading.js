import PoorManJSX, { html } from 'poor-man-jsx';

const Loading = ({ props }) =>
  html`<div class="h-screen flex justify-center items-center ${props.class}">
    <loading-spinner class=${props.spinnerClass} />
  </div>`;

PoorManJSX.customComponents.define('loading-screen', Loading);

export default Loading;
