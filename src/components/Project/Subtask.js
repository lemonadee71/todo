import { TASK } from '../../actions';
import BaseTask from './BaseTask';

const Subtask = (data, i, variant) => {
  const component = new BaseTask(data, TASK.SUBTASKS);

  component.props.main = {
    // remove and reduce padding
    class: component._className
      .replace(/px-[0-9]+/, '')
      .replace(/py-[0-9]+/, 'py-1'),
    'data-parent': data.parent,
  };

  if (variant === 'small') {
    Object.assign(component.props, {
      title: { style: 'font-size: 0.875rem; line-height: 1.25rem;' },
      checkbox: { style: 'width: 1rem; height: 1rem;' },
      checkmark: { style: 'width: 0.5rem; height: 0.5rem;' },
    });
  }

  return component.render(i);
};

export default Subtask;
