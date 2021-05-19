import { html, createState } from '../helpers/component';
import $, { remove } from '../helpers/helpers';
import { chips, chipsWithText, labelElement } from '../helpers/selectors';
import event from '../modules/event';

const Label = ({ label, taskLabels = [] }) => {
  const isEditing = createState(false);

  const isSelected = taskLabels.find(
    (taskLabel) => taskLabel.name === label.name
  );

  const updateLabel = (e) => {
    try {
      const labelEl = e.currentTarget.parentElement;
      const id = labelEl.getAttribute('data-label-id');
      const newLabelName = e.currentTarget.value;

      event.emit('label.edit', { id, prop: 'name', value: newLabelName });

      labelEl.firstElementChild.textContent = newLabelName;

      const labelChipsWithText = $(`${chipsWithText(id)}--all`);
      const labelChips = $(`${chips(id)}--all`);

      if (labelChipsWithText || labelChips) {
        [...labelChipsWithText, ...labelChips].forEach((chip) => {
          chip.setAttribute('text', newLabelName);
        });
      }

      e.stopPropagation();
    } catch (error) {
      console.log(error);
      alert(error.toString());
    }
  };

  const removeLabel = (e) => {
    event.emit('label.delete', { id: label.id });

    remove($(`${labelElement(label.id)}`)).from($('#label-list'));

    // remove all chips and chip-w-texts with the same label-id
    [
      ...$(`${chips(label.id)}--all`),
      ...$(`${chipsWithText(label.id)}--all`),
    ].forEach((chip) => chip.remove());

    e.stopPropagation();
  };

  const toggleEdit = () => {
    isEditing.value = !isEditing.value;
  };

  return html`
    <div
      class="label${isSelected ? ' selected' : ''}"
      data-label-id="${label.id}"
      data-color="${label.color}"
    >
      <span
        ${{
          $class: isEditing.bind('value', (val) => (val ? 'hidden' : '')),
        }}
        >${label.name}</span
      >
      <input
        type="text"
        name="label-name"
        value="${label.name}"
        required
        ${{
          $class: isEditing.bind('value', (val) => (!val ? 'hidden' : '')),
          $disabled: isEditing.bind('value', (val) => !val),
        }}
        ${{ onChange: updateLabel, onFocusout: toggleEdit }}
      />
      <div
        class="actions"
        ${{
          '$style:display': isEditing.bind('value', (val) =>
            val ? 'none' : 'block'
          ),
        }}
      >
        <button is="edit-btn" ${{ onClick: toggleEdit }}></button>
        <button is="delete-btn" ${{ onClick: removeLabel }}></button>
      </div>
    </div>
  `;
};

export default Label;
