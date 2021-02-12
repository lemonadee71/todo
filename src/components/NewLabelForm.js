import Component from '../helpers/component';
import { defaultLabelColors } from '../helpers/defaults';
import { addLabel } from '../modules/labels';
import $ from '../helpers/helpers';

const NewLabelForm = () => {
  let labelColor = defaultLabelColors[0];
  let labelName = '';
  let isCreating = false;

  const toggleCreating = () => {
    isCreating = !isCreating;

    if (isCreating) {
      hide($('#new-label button'));
      $('#new-label').appendChild(NewLabelForm({ createNewLabel }));
    } else {
      show($('#new-label button'));
      $('#new-label form').remove();
      $('#color-picker').remove();
    }
  };

  const createNewLabel = (name, color) => {
    try {
      addLabel(name, color);
      append(Component.render(createLabelElement({ name, color }))).to(
        $('#label-list')
      );

      toggleCreating();
    } catch (error) {
      alert(error.toString());
      $('#new-label form').reset();
    }
  };
  /*
   * DOM functions
   */
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
