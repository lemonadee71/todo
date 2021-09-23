import defineCustomElements from './components/custom';
import App from './core';

defineCustomElements();
App.event.emit('init');
