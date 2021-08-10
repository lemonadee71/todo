import Component from '../helpers/component';
import $ from '../helpers/helpers';
import { defaultLabelColors } from '../modules/defaults';
import event from '../modules/event';

const NewLabelForm = () => {
  let labelColor = defaultLabelColors[0];
  let labelName = '';

  const createNewLabel = (name, color) => {
    try {
      event.emit('label.add', { name, color });
    } catch (error) {
      console.log(error);
      alert(error.toString());
      $('#new-label form').reset();
    }
  };

  const pickColor = (e) => {
    $(`.color.selected`).classList.remove('selected');
    if (e.target.matches('div.color')) {
      e.target.classList.add('selected');
      labelColor = e.target.getAttribute('data-color');
    }
  };

  const createLabel = (e) => {
    labelName = e.currentTarget.elements[0].value;
    createNewLabel(labelName, labelColor);

    e.preventDefault();
    e.target.reset();
  };

  return Component.html`
    <form ${{ onSubmit: createLabel }}>
      <input
        type="text"
        name="new-label-name"
        class="light"
        placeholder="Label Name"
        required
      />
      <button class="submit" type="submit">Create</button>
    </form>
    <div id="color-picker" ${{ onClick: pickColor }}>
      ${defaultLabelColors.map(
        (color) =>
          `<div data-color="${color}" class="color${
            labelColor === color ? ' selected' : ''
          }"></div>`
      )}
    </div>  
  `;
};

export default NewLabelForm;
