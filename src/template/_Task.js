import PoorManJSX, { html } from 'poor-man-jsx';
import Chip from '../components/Chip';

const TaskTemplate = ({ children, props }) => {
  const { template, type, id, title, completed } = props;
  const badges = [...props.badges];
  const labels = [...props.labels];

  return html`
    <div
      :key="${type}-${id}"
      :skip="style"
      class="${type} box-border flex flex-col bg-white dark:bg-[#353535] z-[2]"
      tabindex="0"
      data-id="${id}"
      ${template.main}
    >
      <div
        class="flex justify-between items-center space-x-2"
        data-name="task__body"
      >
        ${children.before_main}

        <div class="flex flex-1 flex-col space-y-1" data-name="task__main">
          <div
            class="flex flex-wrap gap-1"
            data-name="task__labels"
            ${template.labels}
          >
            ${labels.items.map(Chip)}
          </div>

          <h3
            class="font-sans break-words line-clamp-3"
            class:line-through=${completed}
            data-name="task__title"
            ${template.title}
          >
            ${title}
          </h3>

          <div
            class="flex flex-wrap gap-1"
            data-name="task__badges"
            ${template.badges}
          >
            ${badges}
          </div>
        </div>

        ${children.after_main}
      </div>

      ${children.unnamed}
    </div>
  `;
};

PoorManJSX.customComponents.define('task-template', TaskTemplate);
