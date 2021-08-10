import { html, render, createState } from '../helpers/component';
import convertToMarkdown from '../helpers/showdown';
import $, { append } from '../helpers/helpers';
import { taskItemLabels, labelsArea } from '../helpers/selectors';
import { CALENDAR_ICON, NOTES_ICON, TAG_ICON } from './Icons';
import LabelPopover from './LabelPopover';
import ProjectOptions from './ProjectOptions';
import Chip from './Chip';
import event from '../modules/event';

// Selectors are so messy for this component
// Since there's only one modal component at a time
// Maybe change it to ids
// But make sure to not have conflicts with other components that shows modal-content too
// TODO: Add a delete button
const TaskModal = ({ task }) => {
  const updateTaskDetails = (payload) => {
    event.emit('task.update', { info: task, data: payload });
  };

  const updateTaskLabels = (method, id) => {
    event.emit('task.labels.update', {
      info: task,
      action: method,
      labelId: id,
    });
  };

  const updateTitle = (e) => {
    if (!e.target.value) {
      alert('Task name must not be empty');
      e.target.value = task.title;
      return;
    }

    task.title = e.target.value;
    updateTaskDetails({ title: e.target.value });
  };

  const updateNotes = () => {
    task.notes = $('#edit-task-notes').value;
    updateTaskDetails({ notes: $('#edit-task-notes').value });
  };

  const updateDueDate = (e) => {
    task.dueDate = e.target.value;
    updateTaskDetails({ dueDate: e.target.value });
  };

  // This is a mess
  const updateLabels = (label) => {
    if (label.selected) {
      updateTaskLabels('add', label.id);

      append(Chip({ label, clickable: true })).to($(taskItemLabels(task.id)));
      append(Chip({ label, expanded: true })).to($(labelsArea));
    } else {
      updateTaskLabels('remove', label.id);

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
    task.location = newLocation;

    event.emit('task.transfer', {
      prevLocation,
      newLocation,
      id: task.id,
    });
    updateTaskDetails({ location: newLocation });
  };

  /*
   * DOM functions
   */
  const isEditingTitle = createState(false);
  const isEditingNotes = createState(false);

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
    html`
      <textarea id="edit-task-notes">${task.notes}</textarea>
      <button class="submit" type="submit" ${{ onClick: toggleNotesEdit }}>
        Save
      </button>
    `;

  const notesPreview = () =>
    html`<div
      class="markdown-body"
      ${{ innerHTML: convertToMarkdown(task.notes) }}
    ></div>`;

  // TODO: Clean attributes here
  return render(html`
    <div class="title">
      <input
        type="text"
        name="title"
        class="light"
        placeholder="Unnamed Task"
        value="${task.title}"
        required
        ${{ $disabled: isEditingTitle.bind('value', (val) => !val) }}
        ${{ onInput: updateTitle, onFocusout: toggleTitleEdit }}
      />
      <button
        is="edit-btn"
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
        ${task.labels.map((label) => Chip({ label, showText: true }))}
      </div>
      ${LabelPopover({
        taskLabels: task.labels,
        toggleLabel: updateLabels,
      })}
    </div>

    <div class="notes">
      <div class="section-header">
        ${NOTES_ICON}
        <span>Notes</span>
      </div>
      <button
        is="edit-btn"
        ${{
          '$style:display': isEditingNotes.bind('value', (val) =>
            val ? 'none' : 'block'
          ),
        }}
        ${{ onClick: toggleNotesEdit }}
      ></button>
      <div
        data-id="notes-area"
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
