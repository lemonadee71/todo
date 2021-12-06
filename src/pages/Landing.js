import { html } from 'poor-man-jsx';
import Core from '../core';
import { PATHS } from '../core/constants';

const Landing = () => html`
  <button ${{ onClick: () => Core.router.navigate(PATHS.login) }}>Login</button>
  <h1>This is my landing page</h1>
`;

export default Landing;
