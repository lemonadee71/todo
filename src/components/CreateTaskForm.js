import Task from '../classes/Task';
import Component from '../helpers/component';
import $, { append, remove, closeModal } from '../helpers/helpers';
import { isDueToday, isDueThisWeek, isUpcoming, parse } from '../helpers/date';
import {
  currentTasks,
  newTaskForm,
  newTaskFormNotes,
  newTaskFormDueDate,
  newTaskFormTitle,
  newTaskFormLocation,
  newTaskFormLabels,
  chipsWithText,
} from '../helpers/selectors';
import {
  addTask,
  getProjectsDetails,
  getCurrentSelectedProj,
} from '../modules/projects';
import { getLabel } from '../modules/labels.js';
import ProjectOptions from './ProjectOptions';
import TaskItem from './TaskItem';
import LabelPopover from './LabelPopover.js';
import Chip from './Chip';

const CreateTaskForm = () => {
  const addLabel = (label) => {
    if (label.selected) {
      append(
        Component.createElementFromString(
          Chip(label.id, label.color, label.name)
        )
      ).to($(newTaskFormLabels));
    } else {
      remove($(chipsWithText(label.id))).from($(newTaskFormLabels));
    }
  };

  const openLabelPopover = () => {
    $('#popover').classList.add('visible');
  };

  const createNewTask = () => {
    let currentLocation = getCurrentSelectedProj();

    let title = $(newTaskFormTitle).value;
    let notes = $(newTaskFormNotes).value;
    let dueDate = $(newTaskFormDueDate).value;
    let location = $(newTaskFormLocation).value;
    let labels = [...$(newTaskFormLabels).children].map((chip) =>
      getLabel(chip.getAttribute('data-label-id'))
    );

    let task = new Task({ title, notes, dueDate, location, labels });
    let appendConditions = [
      currentLocation === location,
      currentLocation === '',
      currentLocation === 'today' && isDueToday(parse(dueDate)),
      currentLocation === 'week' && isDueThisWeek(parse(dueDate)),
      currentLocation === 'upcoming' && isUpcoming(parse(dueDate)),
    ];

    // Import this from projects
    addTask(task);
    if (appendConditions.some((condition) => condition === true)) {
      append(TaskItem({ task })).to($(currentTasks));
    }
    destroyForm();
  };

  const destroyForm = () => {
    $(newTaskForm).removeEventListener('submit', createNewTask);
    closeModal();
  };

  return Component.parseString`
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
        ${ProjectOptions(getProjectsDetails(), getCurrentSelectedProj())}
      </select>

      <label for="task-labels" class="section-header">Labels</label>
      <div id="form-labels">
        <button ${{ onClick: openLabelPopover }}>+</button>
        <div data-id="new-task-labels"></div>
        ${LabelPopover({ toggleLabel: addLabel })}
      </div>

      <label for="task-notes" class="section-header">Notes</label>
      <textarea name="task-notes" data-id="new-task-notes"></textarea>

      <label for="task-due" class="section-header">Due Date</label>
      <input name="task-due" type="date" data-id="new-task-date" />
      <br/>
      <button class="submit" ${{ onClick: createNewTask }}>Submit</button>
    </div>
  `;
};

export default CreateTaskForm;
