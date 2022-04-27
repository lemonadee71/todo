import { html } from 'poor-man-jsx';
import { DEFAULT_COLORS } from '../../core/constants';

const ColorChoices = (current = null) =>
  html`
    <div class="flex flex-row flex-wrap justify-between gap-1 w-full">
      ${DEFAULT_COLORS.map(
        (color, i) =>
          // TODO: Provide color names for accessibility
          html`
            <label class="relative cursor-pointer select-none hover:opacity-80">
              <input
                class="absolute opacity-0 h-0 w-0 cursor-pointer peer"
                type="radio"
                name="label-color"
                value="${color}"
                ${current === color || (!current && !i)
                  ? 'checked="checked"'
                  : ''}
              />
              <span
                class="inline-block border-box h-8 w-8 border-2 border-solid border-transparent rounded-md peer-checked:border-white"
                style_background-color="${color}"
              ></span>
            </label>
          `
      )}
    </div>
  `;

export default ColorChoices;
