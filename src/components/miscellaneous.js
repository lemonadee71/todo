const Chip = (color) => `<div class="chip" data-color="${color}"></div>`;

const ChipWithText = (text, color) =>
  `<div class="chip-w-text" data-color="${color}">${text}</div>`;

export { Chip, ChipWithText };
