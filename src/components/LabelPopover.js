import Component from '../helpers/component';
import { addLabel, deleteLabel, editLabel, getLabels } from '../modules/labels';
import $, { append, remove, hide, show } from '../helpers/helpers';
import Icons from './Icons';
import NewLabelForm from './NewLabelForm';

const Label = ({
  label,
  taskLabels,
  onClick,
  updateLabel,
  allowEdit,
  disableEdit,
  removeLabel,
}) => {
  let isSelected = taskLabels.find(
    (taskLabel) => taskLabel.name === label.name
  );

  return Component.parseString`
    <div class="label${isSelected ? ' selected' : ''}" 
    data-label-name="${label.name}" 
    data-color="${label.color}" 
    ${{ onClick }}>
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
        <button ${{
          onClick: (e) => {
            removeLabel(label.name);
            e.stopPropagation();
          },
        }}>
          ${Icons('delete')}
        </button>
      </div>
    </div>
  `;
};

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
    let labelName = e.currentTarget.parentElement.getAttribute(
      'data-label-name'
    );
    editLabel(labelName, 'name', e.currentTarget.value);
  };

  const removeLabel = (labelName) => {
    deleteLabel(labelName);

    // idk if this is necessary
    // trust the garbage collector
    let label = `[data-label-name="${labelName}"]`;
    $(`${label} input`).removeEventListener('change', updateLabel);
    $(`${label} input`).removeEventListener('focusout', disableEdit);
    $(`${label} .actions`).children[0].removeEventListener('click', allowEdit);

    remove($(label)).from($('#label-list'));
  };

  const allowEdit = (e) => {
    // remove disabled attr on input
    let input = e.currentTarget.parentElement.previousElementSibling;
    input.removeAttribute('disabled');

    // disable and hide actionBtns
    e.currentTarget.setAttribute('disabled', '');
    e.currentTarget.classList.toggle('hidden');

    e.stopPropagation();
  };

  const disableEdit = (e) => {
    // disable input
    e.currentTarget.setAttribute('disabled', '');

    // then show and undisable actionBtns
    let actionBtns = e.currentTarget.parentElement.querySelector('.actions');
    let editBtn = actionBtns.children[0];

    editBtn.removeAttribute('disabled');
    editBtn.classList.toggle('hidden');

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
