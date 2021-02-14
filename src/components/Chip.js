import Component from '../helpers/component';

const Chip = (id, color, name = '') =>
  Component.objectToString({
    type: 'div',
    className: `chip${name ? '-w-text' : ''}`,
    text: name,
    attr: {
      'data-label-id': id,
      'data-color': color,
    },
  });

export default Chip;
