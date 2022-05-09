import { html } from 'poor-man-jsx';
import { Spinner } from '../assets/icons';

const Loading = () => html`<div>${Spinner()}</div>`;

export default Loading;
