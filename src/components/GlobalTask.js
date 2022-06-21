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
  #projectData;

  constructor(data) {
    super(data);
    this.#projectData = Core.main.getProject(data.project);

    // to avoid clutter and additional reads for online mode
    this.props.labels = { style: 'display: none;' };
    this.props.openBtn = {
      class: 'px-2 py-1 rounded text-white text-sm bg-sky-500 hover:bg-sky-600',
    };

    if (this.data.dueDate) this.badges.push(DateBadge(data, true));

    // to avoid fetching just to show how many subtasks there are
    const hasSubtasks = isGuest()
      ? this.data.totalSubtasks
      : this.data.$$order.length;

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
  }

  openOnLocation = () => {
    const url = this.#projectData.link;

    if (url !== Core.state.currentPage) {
      Core.data.queue.push(this.data.location);
      Core.router.navigate(url, { title: this.#projectData.name });
    } else {
      // it's okay to emit directly since we know that data is already fetched
      Core.event.emit(
        EDIT_TASK,
        // NOTE: May not be necessary
        Core.main.getTask(...Object.values(this.data.location))
      );
    }
  };

  render() {
    // we add the templates here so that we have access to props
    this.template.push(
      // show the color of project
      {
        target: 'main',
        method: 'before',
        template: html`<div
          class="self-stretch w-1"
          style="background-color: ${this.#projectData.color};"
        ></div>`,
      },
      {
        target: 'main',
        method: 'after',
        template: html`
          <button onClick=${this.openOnLocation} ${this.props.openBtn}>
            Open
          </button>
        `,
      }
    );

    return super.render();
  }
}

export default GlobalTask;
