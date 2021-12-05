import { html } from 'poor-man-jsx';

const Landing = () => html`
  <ul>
    <li>
      <a is="navigo-link" href="/" title="To Do List" store="false">Home</a>
    </li>
    <li>
      <a is="navigo-link" href="/app" title="Overview" store="false">App</a>
    </li>
    <li>
      <a is="navigo-link" href="/login" title="Login" store="false">Login</a>
    </li>
  </ul>
  <h1>This is my landing page</h1>
`;

export default Landing;
