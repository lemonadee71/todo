import { html } from 'poor-man-jsx';
import Core from '../core';
import { PATHS } from '../core/constants';

const Landing = () => {
  const loginBtn = html`
    <button
      ${{
        onClick: () => Core.router.navigate(PATHS.login, { title: 'Login' }),
      }}
    >
      Login
    </button>
  `;

  const goBackBtn = html`
    <button
      ${{
        onClick: () => Core.router.navigate(PATHS.app, { title: 'Overview' }),
      }}
    >
      Open app
    </button>
  `;

  return html`
    ${Core.state.currentUser ? goBackBtn : loginBtn}
    <h1>This is my landing page</h1>
  `;
};

export default Landing;
