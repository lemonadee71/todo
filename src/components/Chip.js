const Chip = (id, color, name = '') =>
   `<div class="chip${
      name ? '-w-text' : ''
   }" data-label-id="${id}" data-color="${color}">${name}</div>`;

export default Chip;
