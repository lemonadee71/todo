import { html } from 'poor-man-jsx';
import App from '../core';

const Error = () =>
  html`
    <div class="error">
      <h1 class="error__message">Page not found</h1>
      <p class="link error__link" ${{ onClick: () => App.history.back() }}>
        Go back
      </p>
    </div>
  `;

export default Error;
