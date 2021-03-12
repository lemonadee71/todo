import Component from '../helpers/component';
import $, { remove } from '../helpers/helpers';
import { chips, chipsWithText, labelElement } from '../helpers/selectors';
import { deleteLabel, editLabel } from '../modules/labels';

const Label = ({ label, taskLabels = [] }) => {
  const isEditing = Component.createState(false);

  const isSelected = taskLabels.find(
    (taskLabel) => taskLabel.name === label.name
  );

  /*
   *  Wrapper functions
   */
  const _deleteLabel = (id) => deleteLabel(id);

  const _editLabel = (id, newName) => editLabel(id, 'name', newName);

  /*
   *  Event listeners
   */
  const updateLabel = (e) => {
    let labelEl = e.currentTarget.parentElement;
    let id = labelEl.getAttribute('data-label-id');
    let newLabelName = e.currentTarget.value;

    _editLabel(id, newLabelName);
    labelEl.firstElementChild.textContent = newLabelName;

    const labelChipsWithText = $(`${chipsWithText(id)}--all`);
    const labelChips = $(`${chips(id)}--all`);

    if (labelChipsWithText || labelChips) {
      [...labelChipsWithText, ...labelChips].map((chip) => {
        chip.setAttribute('text', newLabelName);
      });
    }

    e.stopPropagation();
  };

  const removeLabel = (e) => {
    _deleteLabel(label.id);

    remove($(`${labelElement(label.id)}`)).from($('#label-list'));

    // remove all chips and chip-w-texts with the same label-id
    [
      ...$(`${chips(label.id)}--all`),
      ...$(`${chipsWithText(label.id)}--all`),
    ].map((chip) => chip.remove());

    e.stopPropagation();
  };

  const toggleEdit = () => {
    isEditing.value = !isEditing.value;
  };

  return Component.html`
    <div class="label${isSelected ? ' selected' : ''}" 
      data-label-id="${label.id}" 
      data-color="${label.color}"
    >
      <span ${{
        $class: isEditing.bind('value', (val) => (val ? 'hidden' : '')),
      }}>${label.name}</span>
      <input
        type="text"
        name="label-name"
        value="${label.name}"
        required
        ${{
          $class: isEditing.bind('value', (val) => (!val ? 'hidden' : '')),
          $disabled: isEditing.bind('value', (val) => (!val ? 'true' : '')),
        }}
        ${{ onChange: updateLabel, onFocusout: toggleEdit }}
      />
      <div class="actions" ${{
        '$style:display': isEditing.bind('value', (val) =>
          val ? 'none' : 'block'
        ),
      }}> 
        <button is="edit-btn" ${{ onClick: toggleEdit }}></button>
        <button is="delete-btn" ${{ onClick: removeLabel }}></button>
      </div>
    </div>
  `;
};

export default Label;
