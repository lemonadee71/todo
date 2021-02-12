import Component from '../helpers/component';
import { addLabel, deleteLabel, editLabel, getLabels } from '../modules/labels';
import $, { append, remove, hide, show } from '../helpers/helpers';
import NewLabelForm from './NewLabelForm';
import Label from './Label';
import { chips, chipsWithText } from '../helpers/selectors';

const LabelPopover = ({ taskLabels, toggleLabel }) => {
  let labels = getLabels();
  let isCreating = false;

  const createLabelElement = (label) =>
    Label({
      label,
      taskLabels,
      updateLabel,
      removeLabel,
      allowEdit,
      disableEdit,
      onClick: toggleLabel,
    });

  const closePopover = () => {
    $('#popover').classList.remove('visible');
  };

  /*
   *  NewLabelForm element listeners
   */

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
   *  Label element listeners
   */

  // Should dispatch an edit event
  const updateLabel = (e) => {
    let labelEl = e.currentTarget.parentElement;
    let labelId = labelEl.getAttribute('data-label-id');
    let newLabelName = e.currentTarget.value;

    editLabel(labelId, 'name', newLabelName);

    let labelChipsWithText = $(`${chipsWithText(labelId)}--g`);

    if (labelChipsWithText) {
      [...labelChipsWithText].map((chip) => {
        chip.textContent = newLabelName;
      });
    }
  };

  const removeLabel = (labelId) => {
    deleteLabel(labelId);

    // idk if this is necessary
    // trust the garbage collector
    let label = `[data-label-id="${labelId}"]`;
    // $(`${label} input`).removeEventListener('change', updateLabel);
    // $(`${label} input`).removeEventListener('focusout', disableEdit);
    // $(`${label} .actions`).children[0].removeEventListener('click', allowEdit);

    remove($(`.label${label}`)).from($('#label-list'));

    // remove all chips and chip-w-texts with the same label name and color
    [
      ...$(`.chip${label}--all`),
      ...$(`.chip-w-text${label}--all`),
    ].map((chip) => chip.remove());
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

  // <button class="submit" ${{
  //   onClick: toggleCreating,
  // }}>Create new label</button>

  return Component.parseString`
    <div id="popover">
      <span class="close" ${{ onClick: closePopover }}>&times;</span>       
      <span class="section-header">Labels</span>
      <div id='label-list'>
        ${labels.length ? labels.map((label) => createLabelElement(label)) : ''}
      </div>
      <div id="new-label">        
      </div>
    </div>
  `;
};

export default LabelPopover;
