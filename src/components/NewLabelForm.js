import Component from '../helpers/component';
import { defaultLabelColors } from '../modules/defaults';
import { addLabel } from '../modules/labels';
import $, { append } from '../helpers/helpers';
import Label from './Label';

const NewLabelForm = () => {
  let labelColor = defaultLabelColors[0];
  let labelName = '';

  const createNewLabel = (name, color) => {
    try {
      let newLabel = addLabel(name, color);
      append(
        Component.render(
          Label({
            label: newLabel,
            taskLabels: [],
          })
        )
      ).to($('#label-list'));
    } catch (error) {
      console.log(error);
      alert(error.toString());
      $('#new-label form').reset();
    }
  };

  /*
   * DOM functions
   */
  const pickColor = (e) => {
    $(`.color.selected`).classList.remove('selected');
    if (e.target.matches('div.color')) {
      e.target.classList.add('selected');
      labelColor = e.target.getAttribute('data-color');
    }
  };

  const onSubmit = (e) => {
    labelName = e.currentTarget.elements[0].value;
    createNewLabel(labelName, labelColor);

    e.preventDefault();
    e.target.reset();
  };

  return Component.html`
    <form ${{ onSubmit }}>
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
