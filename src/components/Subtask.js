import Core from '../core';
import { TASK } from '../core/actions';
import { dispatchCustomEvent } from '../utils/dispatch';
import { curry } from '../utils/misc';
import { $ } from '../utils/query';
import { useUndo } from '../utils/undo';
import BaseTask from './BaseTask';

export default class Subtask extends BaseTask {
  constructor(data) {
    super(data, TASK.SUBTASKS);
  }

  get location() {
    return {
      project: this.data.project,
      list: this.data.list,
      task: this.data.parent,
      subtask: this.data.id,
    };
  }

  deleteTask() {
    const parent = $.data('id', this.data.parent);
    const dispatch = curry(dispatchCustomEvent)(parent, 'subtaskdelete');

    dispatch({
      cancelled: false,
      completed: this.data.completed,
    });

    useUndo({
      selector: `[data-id="${this.id}"]`,
      multiple: true,
      text: 'Task removed',
      callback: () => {
        Core.event.emit(this.action.REMOVE, this.location);

        dispatch({
          success: true,
          completed: this.data.completed,
        });
      },
      onCancel: () => {
        dispatch({
          cancelled: true,
          completed: this.data.completed,
        });
      },
    })();
  }

  render(isParentComplete = false) {
    this.extraProps = {
      main: {
        'data-parent': this.data.parent,
        display: Core.state.undo.includes(`[data-id="${this.id}"]`)
          ? 'none'
          : 'block',
      },
      checkbox: { disabled: isParentComplete },
    };

    return super.render();
  }
}
