import { html } from 'poor-man-jsx';
import { TASK } from '../actions';
import { DEFAULT_COLORS } from '../constants';
import Core from '../core';
import { SubtasksIcon } from '../assets/icons';
import { isGuest } from '../utils/auth';
import Badge from './Badge';
import BaseTask from './BaseTask';
import DateBadge from './DateBadge';

class TaskGlobalVariant extends BaseTask {
  constructor(data) {
    super(data, TASK);

    this.projectData = Core.data.root.get(data.project);
    this.props = {
      checkbox: {
        style: 'display: none;',
      },
      // to avoid clutter and additional reads for online mode
      labels: {
        style: 'display: none;',
      },
      menu: {
        style: 'display: none;',
      },
    };

    // replace default date badge
    if (this.data.dueDate) {
      this.badges = [DateBadge(data, true)];
    }

    // to avoid fetching just to show how many subtasks there are
    const hasSubtasks = isGuest()
      ? this.data.totalSubtasks
      : this.data.__initialSubtasksOrder.length;

    if (this.data.totalSubtasks && hasSubtasks) {
      this.badges.push(
        Badge({
          content: SubtasksIcon('stroke-white', 16, 1.75),
          bgColor: DEFAULT_COLORS[9],
          props: {
            key: 'subtasks',
            'data-tooltip': 'This task has subtasks',
          },
        })
      );
    }

    this.template.push({
      target: 'checkbox',
      method: 'before',
      template: html`<div
        class="self-stretch w-1"
        style="background-color: ${this.projectData.color};"
      ></div>`,
    });
  }

  openOnLocation = () => {
    Core.data.queue.push(this.location);
    Core.router.navigate(`app/${this.projectData.link}`, {
      title: this.projectData.name,
    });
  };
}

export default TaskGlobalVariant;
