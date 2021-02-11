const Chip = (name, color) =>
  `<div class="chip" data-label-id="${name}-${color}" data-color="${color}"></div>`;

const ChipWithText = (name, color) =>
  `<div class="chip-w-text" data-label-id="${name}-${color}" data-color="${color}">${name}</div>`;

export { Chip, ChipWithText };
