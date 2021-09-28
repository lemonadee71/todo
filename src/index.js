import { createHook, html, render } from 'poor-man-jsx';
import Core from './core';
import { PATHS } from './core/constants';
import defineCustomElements from './components/custom';
// import Router from './components/Router';
import * as pages from './pages';

const Website = () => {
  const [current] = createHook({ page: PATHS.home });
  const routes = [
    {
      path: PATHS.home,
      name: 'Todo List',
      handler: () => {
        current.page = pages.Landing();
      },
    },
    {
      path: PATHS.app,
      name: 'Home',
      handler: () => {
        current.page = pages.App();
      },
    },
    {
      path: PATHS.login,
      name: 'Login',
      handler: () => {
        current.page = pages.Login();
      },
    },
  ];

  return html`
    <ul>
      <li><a is="navigo-link" href="/">Home</a></li>
      <li><a is="navigo-link" href="/app">App</a></li>
      <li><a is="navigo-link" href="/login">Login</a></li>
    </ul>
    <div
      id="app"
      ${{
        '@mount': () => {
          Core.router.register(routes);
          Core.router.resolve('/');
        },
        $children: current.$page,
      }}
    ></div>
  `;
};

defineCustomElements();
render(Website(), document.body);
