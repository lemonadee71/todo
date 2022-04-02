import { html, render } from 'poor-man-jsx';

const Toast = (text, action = null) =>
  render(html`
    <div class="toast__body">
      <p class="toast__text">${text}</p>
      ${action
        ? html`<button class="toast__btn" onClick=${action.callback}>
            ${action.text}
          </button>`
        : ''}
    </div>
  `).firstElementChild;

export default Toast;
