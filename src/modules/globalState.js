import Component from '../helpers/component';

const isChipExpanded = Component.createState(true);

const currentLocation = Component.createState('all');

export { isChipExpanded, currentLocation };
