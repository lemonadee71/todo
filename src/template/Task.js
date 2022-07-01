import { html, render } from 'poor-man-jsx';
import { $ } from '../utils/query';
import Chip from '../components/Chip';

export default class Task {
  constructor(data) {
    this.data = data;
    this.type = this.data.type;
    this.id = this.data.id;

    // for customization
    // props that expected to be overriden should go here
    this.props = {
      main: {
        class: `${this.type} box-border flex flex-col px-3 py-2 bg-white dark:bg-[#353535] z-[2]`,
      },
      title: {
        class: `text-base font-sans break-words line-clamp-3 ${
          this.data.completed ? 'line-through' : ''
        }`,
      },
    };
    this.badges = [];
    this.template = [];

    // lifecycle
    this.oncreate = [];
    this.ondestroy = [];
  }

  initTemplate(e) {
    this.template.forEach((content) => {
      const { template, target: selector, method } = content;
      const target = selector
        ? $.data('name', `task__${selector}`, e.target)
        : e.target;

      target[method || 'append'](render(template));
    });
  }

  // TODO: Improve styling for completed
  // prettier-ignore
  render() {
    return html`
      <div
        key="${this.type}-${this.id}"
        ignore="style"
        tabindex="0"
        data-id="${this.id}"
        data-project="${this.data.project}"
        data-list="${this.data.list}"
        data-location="${Object.values(this.data.location).join(',')}"
        onCreate=${(e) => [this.initTemplate.bind(this), ...this.oncreate].forEach((cb) => cb(e))}
        onDestroy=${(e) => this.ondestroy.forEach((cb) => cb(e))}
        ${this.props.main}
      >
        <div class="flex justify-between items-center space-x-2" data-name="task__body">
          <div class="flex flex-1 flex-col space-y-1" data-name="task__main">
            <div is-list class="flex flex-wrap gap-1" data-name="task__labels" ${this.props.labels}>
              ${this.data.labels.items.map(Chip)}
            </div>

            <h3 data-name="task__title" ${this.props.title}>
              ${this.data.title}
            </h3>

            <div is-list class="flex flex-wrap gap-1" data-name="task__badges" ${this.props.badges}>
              ${this.badges}
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
