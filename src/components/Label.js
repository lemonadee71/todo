import Component from '../helpers/component';
import $, { remove, append, hide, show } from '../helpers/helpers';
import { chips, chipsWithText } from '../helpers/selectors';
import { deleteLabel, editLabel } from '../modules/labels';
import Icons from './Icons';

const Label = ({ label, taskLabels }) => {
  let isSelected = taskLabels.find(
    (taskLabel) => taskLabel.name === label.name
  );

  const updateLabel = (e) => {
    let labelEl = e.currentTarget.parentElement;
    let labelId = labelEl.getAttribute('data-label-id');
    let newLabelName = e.currentTarget.value;

    editLabel(labelId, 'name', newLabelName);

    let labelChipsWithText = $(`${chipsWithText(labelId)}--all`);

    if (labelChipsWithText) {
      [...labelChipsWithText].map((chip) => {
        chip.textContent = newLabelName;
      });
    }

    e.stopPropagation();
  };

  const removeLabel = (e) => {
    deleteLabel(label.id);

    // idk if this is necessary
    // trust the garbage collector
    let labelId = `[data-label-id="${label.id}"]`;
    $(`.label${labelId} input`).removeEventListener('change', updateLabel);
    $(`.label${labelId} input`).removeEventListener('focusout', disableEdit);
    $(`.label${labelId} .actions`).children[0].removeEventListener(
      'click',
      allowEdit
    );

    remove($(`.label${labelId}`)).from($('#label-list'));

    // remove all chips and chip-w-texts with the same label-id
    [
      ...$(`.chip${labelId}--all`),
      ...$(`.chip-w-text${labelId}--all`),
    ].map((chip) => chip.remove());

    e.stopPropagation();
  };

  const allowEdit = (e) => {
    // remove disabled attr on input
    let input = e.currentTarget.parentElement.previousElementSibling;
    input.removeAttribute('disabled');

    // disable and hide actionBtns
    e.currentTarget.setAttribute('disabled', '');
    hide(e.currentTarget);

    e.stopPropagation();
  };

  const disableEdit = (e) => {
    // disable input
    e.currentTarget.setAttribute('disabled', '');

    // then show and undisable actionBtns
    let actionBtns = e.currentTarget.parentElement.querySelector('.actions');
    let editBtn = actionBtns.children[0];

    editBtn.removeAttribute('disabled');
    show(editBtn);

    e.stopPropagation();
  };

  return Component.parseString`
    <div class="label${isSelected ? ' selected' : ''}" 
    data-label-id="${label.id}" 
    data-color="${label.color}">
      <input
        type="text"
        name="label-name"
        value="${label.name}"
        required
        disabled
        ${{ onChange: updateLabel, onFocusout: disableEdit }}
      />
      <div class="actions"> 
        <button ${{ onClick: allowEdit }}>${Icons('edit')}</button>
        <button ${{ onClick: removeLabel }}>
          ${Icons('delete')}
        </button>
      </div>
    </div>
  `;
};

export default Label;
