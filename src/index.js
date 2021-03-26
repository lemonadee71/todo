import defineCustomElements from './components/custom';
import initializeEvents from './modules';
import event from './modules/event';
import App from './App';
import 'github-markdown-css';
import './css/styles.css';
import './css/hamburgers.css';
import './css/labelcolors.css';

defineCustomElements();
initializeEvents();

window.addEventListener(
  'hashchange',
  () => {
    event.emit('hashchange', window.location.hash.replace('#/', ''));
  },
  false
);

document.body.prepend(App());
