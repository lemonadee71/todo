import Component from '../helpers/component';
import convertToMarkdown from '../helpers/showdown';
import { formatDate } from '../helpers/date';
import $, { append, hide, remove, show, rerender } from '../helpers/helpers';
import {
  taskItemNotes,
  taskItemDueDateText,
  taskItemDueDateIcon,
  taskItemTitle,
  taskItemLabels,
  labelsArea,
  taskNotesArea,
  chips,
  chipsWithText,
} from '../helpers/selectors';
import { getLabel } from '../modules/labels';
import {
  getCurrentSelectedProj,
  getProjectsDetails,
  transferTask,
} from '../modules/projects';
import Chip from './Chip';
import Icons from './Icons';
import LabelPopover from './LabelPopover';
import ProjectOptions from './ProjectOptions';

// Selectors are so messy for this component
// Since there's only one modal component at a time
// Maybe change it to ids
// But make sure to not have conflicts with other components that shows modal-content too
// Add a delete button
const TaskModal = ({ task }) => {
  /*
   * Private methods
   */
  const _updateTaskDetails = (prop, value) => {
    task[prop] = value;
  };

  const _updateTaskLabels = (method, id) => {
    if (method === 'add') {
      task.addLabel(getLabel(id));
    } else if (method === 'remove') {
      task.removeLabel(id);
    }
  };

  /*
   * Functions that updates the task
   */
  const updateTitle = (e) => {
    if (!e.target.value) {
      alert('Task name must not be empty');
      e.target.value = task.title;
      return;
    }

    _updateTaskDetails('title', e.target.value);
    $(taskItemTitle(task.id)).textContent = task.title;
  };

  const updateNotes = () => {
    _updateTaskDetails('notes', $('#edit-task-notes').value);

    let taskCardNotes = $(taskItemNotes(task.id));
    if (task.notes === '') {
      hide(taskCardNotes);
    } else {
      show(taskCardNotes);
    }
  };

  const updateDueDate = (e) => {
    _updateTaskDetails('dueDate', e.target.value);

    let dueDateIcon = $(taskItemDueDateIcon(task.id));
    let dueDateText = $(taskItemDueDateText(task.id));

    if (task.dueDate === '') {
      hide(dueDateIcon);
      dueDateText.textContent = '';
    } else {
      show(dueDateIcon);
      dueDateText.textContent = formatDate(task.dueDate);
    }
  };

  // This is a mess
  const updateLabels = (label) => {
    if (label.selected) {
      _updateTaskLabels('add', label.id);

      append(Component.createElementFromString(Chip(label.id, label.color))).to(
        $(taskItemLabels(task.id))
      );
      append(
        Component.createElementFromString(
          Chip(label.id, label.color, label.name)
        )
      ).to($(labelsArea));
    } else {
      _updateTaskLabels('remove', label.id);

      remove($(`#${task.id} ${chips(label.id)}`)).from(
        $(taskItemLabels(task.id))
      );

      remove($(chipsWithText(label.id))).from($(labelsArea));
    }
  };

  const updateLocation = (e) => {
    let prevLocation = task.location;
    let newLocation = e.currentTarget.value;

    _updateTaskDetails('location', newLocation);
    transferTask(task.id, prevLocation, newLocation);

    let currentLocation = getCurrentSelectedProj();

    if (currentLocation) {
      remove($(`#${task.id}`), true);
    }
  };

  /*
   * DOM functions
   */
  // Title
  const editTitle = (e) => {
    e.currentTarget.previousElementSibling.removeAttribute('disabled');
    hide(e.currentTarget);
  };

  const disableEdit = (e) => {
    show(e.currentTarget.nextElementSibling);
    e.currentTarget.setAttribute('disabled', '');
  };

  // Labels
  const openLabelPopover = () => {
    $('#popover').classList.add('visible');
  };

  // Notes
  const editNotes = () => {
    $('--data-id=edit-notes-btn').classList.toggle('hidden');
    rerender($(taskNotesArea), notesTextArea());
  };

  const saveNotes = () => {
    $('--data-id=edit-notes-btn').classList.toggle('hidden');
    updateNotes();
    rerender(
      $(taskNotesArea),
      Component.render(Component.objectToString(notesPreview()))
    );
  };

  /*
   * TaskModal elements
   */
  const notesTextArea = () =>
    Component.render(Component.parseString`
      <textarea id="edit-task-notes" "name="notes">${task.notes}</textarea>
      <button class="submit" type="submit" ${{ onClick: saveNotes }}>
        Save
      </button>  
  `);

  const notesPreview = () => ({
    type: 'div',
    className: 'markdown-body',
    prop: {
      innerHTML: convertToMarkdown(task.notes),
    },
  });

  return Component.render(Component.parseString`
    <div class="title">
      <input
        type="text"
        name="title"
        class="light"
        placeholder="Unnamed Task"
        value="${task.title}"
        disabled
        required
        ${{ onChange: updateTitle, onFocusout: disableEdit }}
      />
      <button ${{ onClick: editTitle }}>${Icons('edit')}</button>
    </div>
    <div class="proj">
      <span>in Project</span>
      <select id="edit-task-location" name="location"
      ${{ onChange: updateLocation }}>
      ${ProjectOptions(getProjectsDetails(), task.location)}
      </select>
    </div>
    <div id="labels">
      <div class="section-header">
        ${Icons('tag')}
        <span>Labels</span>
      </div>
      <button data-id="edit-label-btn" ${{ onClick: openLabelPopover }}>
        +
      </button>
      <div data-id="labels-area">
        ${task
          .getLabels()
          .map((label) => Chip(label.id, label.color, label.name))}
      </div>
      ${LabelPopover({
        taskLabels: task.getLabels(),
        toggleLabel: updateLabels,
      })}
    </div>
    <div class="notes">
      <div class="section-header">
        ${Icons('details')}
        <span>Notes</span>
      </div>
      <button data-id="edit-notes-btn" ${{ onClick: editNotes }}>
        ${Icons('edit')}
      </button>
      <div data-id="notes-area">${notesPreview()}</div>
    </div>
    <div class="date">
      <div class="section-header">
        ${Icons('calendar')}
        <span>Due Date</span>
      </div>
      <input 
        type="date" 
        name="due-date" 
        ${task.dueDate ? `value="${task.dueDate}"` : ''} 
        ${{ onChange: updateDueDate }}
      />
    </div>
  `);
};

export default TaskModal;
