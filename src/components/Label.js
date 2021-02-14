import Component from '../helpers/component';
import $, { remove, hide, show } from '../helpers/helpers';
import { chips, chipsWithText, labelElement } from '../helpers/selectors';
import { deleteLabel, editLabel } from '../modules/labels';
import Icons from './Icons';

const Label = ({ label, taskLabels = [] }) => {
  let isSelected = taskLabels.find(
    (taskLabel) => taskLabel.name === label.name
  );

  const _deleteLabel = (id) => deleteLabel(id);

  const _editLabel = (id, newName) => editLabel(id, 'name', newName);

  const updateLabel = (e) => {
    let labelEl = e.currentTarget.parentElement;
    let labelId = labelEl.getAttribute('data-label-id');
    let newLabelName = e.currentTarget.value;

    _editLabel(labelId, newLabelName);
    labelEl.firstElementChild.textContent = newLabelName;

    let labelChipsWithText = $(`${chipsWithText(labelId)}--all`);

    if (labelChipsWithText) {
      [...labelChipsWithText].map((chip) => {
        chip.textContent = newLabelName;
      });
    }

    e.stopPropagation();
  };

  const removeLabel = (e) => {
    _deleteLabel(label.id);

    // idk if this is necessary
    // trust the garbage collector
    $(`${labelElement(label.id)} input`).removeEventListener(
      'change',
      updateLabel
    );
    $(`${labelElement(label.id)} input`).removeEventListener(
      'focusout',
      disableEdit
    );
    $(`${labelElement(label.id)} .actions`).children[0].removeEventListener(
      'click',
      allowEdit
    );

    remove($(`${labelElement(label.id)}`)).from($('#label-list'));

    // remove all chips and chip-w-texts with the same label-id
    [
      ...$(`${chips(label.id)}--all`),
      ...$(`${chipsWithText(label.id)}--all`),
    ].map((chip) => chip.remove());

    e.stopPropagation();
  };

  const allowEdit = (e) => {
    // remove disabled attr on input
    let input = e.currentTarget.parentElement.previousElementSibling;
    let span = input.previousElementSibling;

    input.removeAttribute('disabled');
    input.classList.toggle('hidden');
    span.classList.toggle('hidden');

    // disable and hide actionBtns
    e.currentTarget.setAttribute('disabled', '');
    hide(e.currentTarget);

    e.stopPropagation();
  };

  const disableEdit = (e) => {
    // disable input then show the span
    e.currentTarget.setAttribute('disabled', '');
    e.currentTarget.classList.toggle('hidden');
    e.currentTarget.previousElementSibling.classList.toggle('hidden');

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
      ${{
        type: 'span',
        text: label.name,
      }}
      <input
        class="hidden"
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
