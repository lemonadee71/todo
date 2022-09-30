import { html } from 'poor-man-jsx';
import { TASK } from '../../actions';

const Subtask = (data, idx, variant) => {
  const template = { main: { 'class:py-1': true } };

  if (variant === 'small') {
    Object.assign(template, {
      title: {
        'class:text-sm': true,
      },
      checkbox: {
        'class:[w-4,h-4]': true,
      },
      checkmark: {
        'class:[w-2,h-2]': true,
      },
    });
  }

  return html`
    <base-task
      data=${data}
      action=${TASK.SUBTASKS}
      badges=${[]}
      position=${idx}
      template=${template}
    />
  `;
};

export default Subtask;
