import { html } from 'poor-man-jsx';
import $, { append, remove } from '../helpers/helpers';
import {
  newTaskFormNotes,
  newTaskFormDueDate,
  newTaskFormTitle,
  newTaskFormLocation,
  newTaskFormLabels,
  chipsWithText,
  modal,
} from '../helpers/selectors';
import { getLabel } from '../modules/labels';
import ProjectOptions from './ProjectOptions';
import LabelPopover from './LabelPopover';
import Chip from './Chip';
import { AppEvent } from '../emitters';

const CreateTaskForm = () => {
  const openLabelPopover = () => {
    $('#popover').classList.add('visible');
  };

  const addLabel = (label) => {
    if (label.selected) {
      append(Chip({ label, expanded: true })).to($(newTaskFormLabels));
    } else {
      remove($(chipsWithText(label.id))).from($(newTaskFormLabels));
    }
  };

  const createNewTask = () => {
    const title = $(newTaskFormTitle).value;
    const notes = $(newTaskFormNotes).value;
    const dueDate = $(newTaskFormDueDate).value;
    const location = $(newTaskFormLocation).value;
    const labels = [...$(newTaskFormLabels).children].map((chip) =>
      getLabel(chip.getAttribute('data-label-id'))
    );

    if (!title) {
      alert('Task name must not be empty');
      return;
    }

    AppEvent.emit('task.add', { title, notes, dueDate, location, labels });
    $(modal).close();
  };

  return html`
    <div id="create-task">
      <input
        type="text"
        name="task-title"
        data-id="new-task-title"
        placeholder="New Task"
        required
      />

      <label for="task-location" class="section-header">Project</label>
      <select name="task-location" data-id="new-task-location">
        ${ProjectOptions(
          window.location.hash.replace('#/', '').replace('/', '-')
        )}
      </select>

      <span class="section-header">Labels</span>
      <div id="form-labels">
        <button ${{ onClick: openLabelPopover }}>+</button>
        <div data-id="new-task-labels"></div>
        ${LabelPopover({ toggleLabel: addLabel })}
      </div>

      <label for="task-notes" class="section-header">Notes</label>
      <textarea name="task-notes" data-id="new-task-notes"></textarea>

      <label for="task-due" class="section-header">Due Date</label>
      <input name="task-due" type="date" data-id="new-task-date" />
      <br />
      <button class="submit" ${{ onClick: createNewTask }}>Submit</button>
    </div>
  `;
};

export default CreateTaskForm;
