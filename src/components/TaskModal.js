import Component from '../helpers/component';
import convertToMarkdown from '../helpers/showdown';
import $, { append, remove } from '../helpers/helpers';
import {
  taskItemLabels,
  labelsArea,
  // completedTasks,
  // currentTasks,
} from '../helpers/selectors';
import Storage from '../modules/storage';
import { getLabel } from '../modules/labels';
import { transferTask } from '../modules/projects';
import { CALENDAR_ICON, NOTES_ICON, TAG_ICON } from './Icons';
import LabelPopover from './LabelPopover';
import ProjectOptions from './ProjectOptions';
// import TaskItem from './TaskItem';
import Chip from './Chip';

// Selectors are so messy for this component
// Since there's only one modal component at a time
// Maybe change it to ids
// But make sure to not have conflicts with other components that shows modal-content too
// Add a delete button
const TaskModal = ({ task }) => {
  /*
   * Private methods
   */
  const _syncData = () => Storage.sync('data');

  const _updateTaskDetails = (...args) => {
    if (args[0] === 'location') {
      const [prop, id, prevLoc, newLoc] = args;
      task[prop] = newLoc;
      transferTask(id, prevLoc, newLoc);
    } else {
      const [prop, value] = args;
      task[prop] = value;
    }

    _syncData();
  };

  const _updateTaskLabels = (method, id) => {
    if (method === 'add') {
      task.addLabel(getLabel(id));
    } else if (method === 'remove') {
      task.removeLabel(id);
    }

    _syncData();
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
  };

  const updateNotes = () => {
    _updateTaskDetails('notes', $('#edit-task-notes').value);
  };

  const updateDueDate = (e) => {
    _updateTaskDetails('dueDate', e.target.value);
  };

  // This is a mess
  const updateLabels = (label) => {
    if (label.selected) {
      _updateTaskLabels('add', label.id);

      append(Component.render(Chip({ label, clickable: true }))).to(
        $(taskItemLabels(task.id))
      );
      append(Component.render(Chip({ label, expanded: true }))).to(
        $(labelsArea)
      );
    } else {
      _updateTaskLabels('remove', label.id);

      const labelSelector = `label-chip[data-label-id="${label.id}"]`;
      const labelChip = $(`#${task.id} ${labelSelector}`);
      const labelChipWithText = $(`${labelsArea} ${labelSelector}`);

      labelChip.remove();
      labelChipWithText.remove();
    }
  };

  const updateLocation = (e) => {
    const prevLocation = task.location;
    const newLocation = e.currentTarget.value;

    _updateTaskDetails('location', task.id, prevLocation, newLocation);

    const currentPath = window.location.hash.replace('#/', '');

    if (currentPath !== newLocation.replace('-', '/')) {
      const taskEl = $(`#${task.id}`);
      remove(taskEl).from(taskEl.parentElement);
    }
    // else if (!$(`#${task.id}`)) {
    //   const list = task.completed ? completedTasks : currentTasks;
    //   append(Component.render(TaskItem({ task }))).to($(list));
    // }
  };

  /*
   * DOM functions
   */
  const isEditingTitle = Component.createState(false);
  const isEditingNotes = Component.createState(false);

  const toggleTitleEdit = () => {
    isEditingTitle.value = !isEditingTitle.value;
  };

  const toggleNotesEdit = () => {
    if (isEditingNotes.value) {
      updateNotes();
    }

    isEditingNotes.value = !isEditingNotes.value;
  };

  const openLabelPopover = () => {
    $('#popover').classList.add('visible');
  };

  const notesTextArea = () =>
    Component.html`
      <textarea id="edit-task-notes">${task.notes}</textarea>
      <button class="submit" type="submit" ${{ onClick: toggleNotesEdit }}>
        Save
      </button>  
    `;

  const notesPreview = () => ({
    type: 'div',
    className: 'markdown-body',
    prop: {
      innerHTML: convertToMarkdown(task.notes),
    },
  });

  // Clean attributes here
  return Component.render(Component.html`
    <div class="title">
      <input
        type="text"
        name="title"
        class="light"
        placeholder="Unnamed Task"
        value="${task.title}"
        required
        ${{
          $disabled: isEditingTitle.bind('value', (val) =>
            !val ? 'true' : ''
          ),
        }}
        ${{ onInput: updateTitle, onFocusout: toggleTitleEdit }}
      />
      <button is="edit-btn" 
        ${{
          '$style:display': isEditingTitle.bind('value', (val) =>
            val ? 'none' : 'block'
          ),
        }}
        ${{ onClick: toggleTitleEdit }}
      ></button>
    </div>
    <div class="proj">
      <span>in Project</span>
      <select ${{ onChange: updateLocation }}>
        ${ProjectOptions(task.location)}
      </select>
    </div>
    <div id="labels">
      <div class="section-header">
        ${TAG_ICON}
        <span>Labels</span>
      </div>
      <button ${{ onClick: openLabelPopover }}>+</button>
      <div data-id="labels-area">
        ${task.getLabels().map((label) => Chip({ label, expanded: true }))}
      </div>
      ${LabelPopover({
        taskLabels: task.getLabels(),
        toggleLabel: updateLabels,
      })}
    </div>
    <div class="notes">
      <div class="section-header">
        ${NOTES_ICON}
        <span>Notes</span>
      </div>
      <button is="edit-btn"
        ${{
          '$style:display': isEditingNotes.bind('value', (val) =>
            val ? 'none' : 'block'
          ),
        }}
        ${{ onClick: toggleNotesEdit }}
      ></button>
      <div data-id="notes-area"
        ${{
          $content: isEditingNotes.bind('value', (val) =>
            val ? notesTextArea() : notesPreview()
          ),
        }}
      >
        ${notesPreview()}
      </div>
    </div>
    <div class="date">
      <div class="section-header">
        ${CALENDAR_ICON}
        <span>Due Date</span>
      </div>
      <input 
        type="date"
        ${task.dueDate ? `value="${task.dueDate}"` : ''} 
        ${{ onChange: updateDueDate }}
      />
    </div>
  `);
};

export default TaskModal;
