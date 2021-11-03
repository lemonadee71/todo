import { html } from 'poor-man-jsx';
import Core from '../core';
import { $ } from '../utils/query';
import { useUndo } from '../utils/undo';
import TaskModal from './TaskModal';
import Chip from './Chip';

// data here points to the Task stored in main
// so we rely on the fact that changes are reflected on data
export default class BaseTask {
  constructor(type, data, action) {
    this.type = type;
    this.data = data;
    this.action = action;

    this.id = this.data.id;
    // both task and subtask ids start with `task`
    // so to allow for conversion, prefix key with actual type instead
    this.key = `${this.type}-${this.data.id.split('-')[1]}`;

    this.location = {
      project: this.data.project,
      list: this.data.list,
      task: this.data.id,
    };

    // title component could change between types so we separate it
    this.titleComponent = html`
      <div class="task__title">
        <p class="task__name">${this.data.title}</p>
        <span class="task__number">#${this.data.numId}</span>
      </div>
    `;

    this.extraProps = '';
    this.extraContent = '';
  }

  toggleComplete = (e) => {
    Core.event.emit(this.action.UPDATE, {
      ...this.location,
      data: { completed: e.target.checked },
    });
  };

  deleteTask = () => Core.event.emit(this.action.REMOVE, this.location);

  editTask = () => {
    // TODO: Change class if we have subtask specific modal styles
    // TODO: Make this work for subtasks
    $('#main-modal').changeContent(TaskModal(this.data), 'task-modal').show();
  };

  render() {
    const deleteTaskWithUndo = useUndo({
      element: `#${this.data.id}`,
      text: 'Task removed',
      callback: this.deleteTask,
    });

    return html`
      <div
        class="${this.data.completed ? `${this.type}--done` : this.type}"
        id="${this.id}"
        key="${this.key}"
        data-project="${this.data.project}"
        data-list="${this.data.list}"
        ${this.extraProps}
      >
        <div class="task__main">
          <input
            class="task__checkbox"
            type="checkbox"
            name="mark-as-done"
            ${{ checked: this.data.completed, onChange: this.toggleComplete }}
          />
          <div class="task__body">
            <div class="task__labels" is-list>
              ${this.data.labels.items.map((label) => Chip(label))}
            </div>

            ${this.titleComponent}

            <div class="task__badges"></div>
          </div>
          <div class="task__menu">
            <button ${{ onClick: this.editTask }}>Edit</button>
            <button ${{ onClick: deleteTaskWithUndo }}>Delete</button>
          </div>
        </div>

        ${this.extraContent}
      </div>
    `;
  }
}
