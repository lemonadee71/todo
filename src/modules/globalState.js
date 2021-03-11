import Component from '../helpers/component';

const isChipExpanded = Component.createState(true);

const currentLocation = Component.createState(
  window.location.hash.replace('#/', '') || 'all'
);

export { isChipExpanded, currentLocation };
