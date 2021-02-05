import Component from '../helpers/component';
import { defaultLabelColors } from '../helpers/defaults';
import $ from '../helpers/helpers';

const NewLabelForm = ({ createNewLabel }) => {
  let labelColor = defaultLabelColors[0];
  let labelName = '';

  const pickColor = (e) => {
    $(`--data-color=${labelColor}`).classList.remove('selected');
    e.currentTarget.classList.add('selected');
    labelColor = e.currentTarget.getAttribute('data-color');
  };

  const onSubmit = (e) => {
    labelName = e.currentTarget.elements[0].value;

    createNewLabel(labelName, labelColor);
  };

  return Component.parseString`
    <form ${{ onSubmit }}>
      <input
        type="text"
        name="new-label-name"
        class="light"
        placeholder="Label Name"
        required
      />
      <button type="submit">Create Label</button>
    </form>
    <div id="color-picker">
      ${defaultLabelColors.map(
        (color) =>
          `<div data-color="${color}" class="color${
            labelColor === color ? ' selected' : ''
          }"
          ${{ onClick: pickColor }}>
          </div>`
      )}
    </div>  
  `;
};

export default NewLabelForm;
