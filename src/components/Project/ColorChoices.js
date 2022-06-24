import { html } from 'poor-man-jsx';
import { DEFAULT_COLORS } from '../../constants';

const ColorChoices = (label, labelClass = '', initialChoice = null) =>
  html`
    <fieldset>
      <legend class="mb-2 ${labelClass}">${label}</legend>
      <div class="flex flex-row flex-wrap justify-between gap-1">
        ${Object.entries(DEFAULT_COLORS).map(
          ([name, color], i) =>
            html`
              <label
                class="relative cursor-pointer select-none hover:opacity-80"
              >
                <span class="sr-only">${name.replace('-', '')}</span>
                <input
                  class="absolute opacity-0 h-0 w-0 cursor-pointer peer"
                  type="radio"
                  name="label-color"
                  value="${color}"
                  ${initialChoice === color || (!initialChoice && !i)
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
    </fieldset>
  `;

export default ColorChoices;
