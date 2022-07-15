import { html, render } from 'poor-man-jsx';

const Toast = ({ text, color = 'white', action = null }) =>
  render(html`
    <div class="font-sans flex flex-1 justify-between items-center mr-1">
      <p role="log" class="text-sm" style="color: ${color};">${text}</p>
      ${action
        ? html`<button
            class="px-2 py-1 rounded font-bold text-sm text-slate-200 bg-neutral-800 hover:bg-neutral-500 focus:ring"
            onClick=${action.callback}
          >
            ${action.text}
          </button>`
        : ''}
    </div>
  `).firstElementChild;

export default Toast;
