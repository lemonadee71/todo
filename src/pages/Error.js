import { html } from 'poor-man-jsx';
// import App from '../core';

const Error = () =>
  html`
    <div class="error">
      <h1 class="error__message">Page not found</h1>
      <button class="error__btn" ${{ onClick: () => window.history.back() }}>
        Go back
      </button>
    </div>
  `;

export default Error;
