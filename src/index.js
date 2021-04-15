import defineCustomElements from './components/custom';
import initializeEvents from './modules';
import event from './modules/event';
import App from './App';

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
event.emit('content.rendered');
