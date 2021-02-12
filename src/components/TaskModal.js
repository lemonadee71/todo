import Component from '../helpers/component';
import $, { clear, hide, rerender, show } from '../helpers/helpers';
import Icons from './Icons';
import LabelPopover from './LabelPopover';
import { format } from 'date-fns';
import { Converter } from 'showdown';
import { uncategorizedTasks } from '../modules/controller';
import { ChipWithText } from './Chip';

const options = {
  omitExtraWLInCodeBlocks: true,
  noHeaderId: true,
  ghCompatibleHeaderId: true,
  headerLevelStart: 2,
  parseImgDimensions: true,
  strikethrough: true,
  tables: true,
  ghCodeBlocks: true,
  tasklists: true,
  smartIndentationFix: true,
  simpleLineBreaks: true,
  openLinksInNewWindow: true,
  backslashEscapesHTMLTags: true,
  emoji: true,
};

const textToMarkdownConverter = new Converter(options);
textToMarkdownConverter.setFlavor('github');

// Selectors are so messy for this component
// Since there's only one modal component at a time
// Maybe change it to ids
// But make sure to not have conflicts with other components that shows modal-content too
const TaskModal = ({
  task,
  projects,
  updateTitle,
  updateLocation,
  updateLabels,
  updateNotes,
  updateDueDate,
}) => {
  const tasknotes = '--data-name=notes-area';

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
    $('--data-name=edit-notes-btn').classList.toggle('hidden');
    rerender($(tasknotes), notesTextArea());
  };

  const saveNotes = () => {
    $('--data-name=edit-notes-btn').classList.toggle('hidden');
    updateNotes();
    rerender(
      $(tasknotes),
      Component.render(Component.objectToString(notesPreview()))
    );
  };

  const notesTextArea = () =>
    Component.render(Component.parseString`
      <textarea id="edit-task-notes" "name="notes">${task.notes}</textarea>
      <button class="submit" type="submit" ${{ onClick: saveNotes }}>
        Save
      </button>  
  `);

  const projectList = projects.length
    ? [
        // Use an imported uncategorizedTasks for now
        {
          type: 'option',
          text: 'Uncategorized',
          attr: {
            value: uncategorizedTasks.id,
            disabled: 'true',
            selected: task.location === uncategorizedTasks.id ? 'true' : '',
          },
        },
        ...projects.map((proj) => ({
          type: 'option',
          text: proj.name,
          attr: {
            value: proj.id,
            selected: task.location === proj.id ? 'true' : '',
          },
        })),
      ]
    : '';

  const notesPreview = () => ({
    type: 'div',
    className: 'markdown-body',
    prop: {
      innerHTML: textToMarkdownConverter.makeHtml(task.notes),
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
      ${projectList}
      </select>
    </div>
    <div id="labels">
      <div class="section-header">
        ${Icons('tag')}
        <span>Labels</span>
      </div>
      <button data-name="edit-label-btn" ${{ onClick: openLabelPopover }}>
        +
      </button>
      <div data-name="labels-area">
        ${task
          .getLabels()
          .map((label) => ChipWithText(label.name, label.color))}
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
      <button data-name="edit-notes-btn" ${{ onClick: editNotes }}>
        ${Icons('edit')}
      </button>
      <div data-name="notes-area">${notesPreview()}</div>
    </div>
    <div class="date">
      <div class="section-header">
        ${Icons('calendar')}
        <span>Due Date</span>
      </div>
      <input 
        type="date" 
        name="due-date" 
        ${task.dueDate ? `value="${format(task.dueDate, 'yyyy-MM-dd')}"` : ''} 
        ${{ onChange: updateDueDate }}
      />
    </div>
  `);
};

export default TaskModal;
