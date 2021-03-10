import Component from '../helpers/component';
// import { isChipExpanded } from '../modules/globalState';

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

// const Chip = (id, color, name = '') => {
//   return Component.html`
//   <div
//     data-label-id="${id}"
//     data-label-name="${name}"
//     data-color="${color}"
//     ${{
//       $class: isChipExpanded.bind('value', (val) =>
//         val ? 'chip-w-text' : 'chip'
//       ),
//       $textContent: isChipExpanded.bind('value', (val) => (val ? name : '')),
//     }}
//   >
//   </div>`;
// };

export default Chip;
