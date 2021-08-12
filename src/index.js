import defineCustomElements from './components/custom';
import initializeEvents from './modules';
import { AppEvent } from './emitters';
import App from './App';

defineCustomElements();
initializeEvents();

window.addEventListener(
  'hashchange',
  () => {
    AppEvent.emit('hashchange', window.location.hash.replace('#/', ''));
  },
  false
);

document.body.prepend(App());
AppEvent.emit('content.rendered');
