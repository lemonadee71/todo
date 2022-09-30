import autosize from 'autosize';
import { html } from 'poor-man-jsx';
import { copy } from '../utils/misc';

const AutoTextarea = ({ props }) =>
  // prettier-ignore
  html`<textarea
      class=${['p-1 rounded resize-none break-words focus:ring', props.class]}
      rows="1"
      onLoad=${(e) => autosize(e.target)}
      ${copy(props, ['class', 'value'])}
    >${props.value.trim()}</textarea>`;

export default AutoTextarea;
