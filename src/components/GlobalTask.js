import { html } from 'poor-man-jsx';
import { EDIT_TASK } from '../actions';
import { DEFAULT_COLORS } from '../constants';
import Core from '../core';
import { SubtasksIcon } from '../assets/icons';
import { isGuest } from '../utils/auth';
import TaskTemplate from '../template/Task';
import Badge from './Badge';
import DateBadge from './DateBadge';

class GlobalTask extends TaskTemplate {
  constructor(data) {
    super(data);
    this.projectData = Core.data.root.get(data.project);

    // to avoid clutter and additional reads for online mode
    this.props.labels = { style: 'display: none;' };

    if (this.data.dueDate) this.badges.push(DateBadge(data, true));

    // to avoid fetching just to show how many subtasks there are
    const hasSubtasks = isGuest()
      ? this.data.totalSubtasks
      : this.data.__initialSubtasksOrder.length;

    if (hasSubtasks) {
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

    // show the color of project
    this.template.push({
      target: 'main',
      method: 'before',
      template: html`<div
        class="self-stretch w-1"
        style="background-color: ${this.projectData.color};"
      ></div>`,
    });
  }

  openOnLocation = () => {
    Core.data.queue.push(this.data.location);

    const url = `app/${this.projectData.link}`;

    if (url !== Core.state.currentPage) {
      Core.router.navigate(url, { title: this.projectData.name });
    } else {
      // it's okay to emit directly since we know that data is already fetched
      Core.event.emit(
        EDIT_TASK,
        // NOTE: May not be necessary
        Core.main.getTask(...Object.values(this.data.location))
      );
    }
  };
}

export default GlobalTask;
